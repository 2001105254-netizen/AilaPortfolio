// @ts-nocheck
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const emptyStore = () => ({ sessions: {} as Record<string, { email: string; createdAt: number; expiresAt: number }> });
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

async function getStore() {
  const { data, error } = await supabase.from('portfolio_store').select('data').eq('id', 'main').maybeSingle();
  if (error) throw error;
  return data?.data || emptyStore();
}

async function saveStore(data: Record<string, unknown>) {
  const { error } = await supabase.from('portfolio_store').upsert({
    id: 'main', data, updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function requireAdmin(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const store = await getStore();
  const session = store.sessions?.[token];
  return session && Date.now() <= session.expiresAt ? session : null;
}

function safeEqual(value: string, expected?: string) {
  return Boolean(expected && value.length === expected.length && value === expected);
}

async function uploadImage(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/);
  if (!match) throw new Error('Only JPG, PNG, WEBP, and GIF images can be uploaded.');
  const bytes = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  if (bytes.byteLength > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller.');

  const extension = match[1].split('/')[1] === 'jpeg' ? 'jpg' : match[1].split('/')[1];
  const filePath = `projects/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('portfolio-images').upload(filePath, bytes, {
    contentType: match[1], upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from('portfolio-images').getPublicUrl(filePath).data.publicUrl;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^.*\/portfolio-api/, '') || '/';
    const body = ['POST', 'PUT', 'DELETE'].includes(req.method) && req.headers.get('content-type')?.includes('application/json')
      ? await req.json() : {};

    if (req.method === 'GET' && path === '/portfolio') {
      const store = await getStore();
      return response({ success: true, ...store });
    }

    if (req.method === 'POST' && path === '/auth/login') {
      const adminEmail = Deno.env.get('ADMIN_EMAIL')?.trim();
      const adminPassword = Deno.env.get('ADMIN_PASSWORD');
      const adminPin = Deno.env.get('ADMIN_PIN');
      const emailMatches = body.email && adminEmail && body.email.trim().toLowerCase() === adminEmail.toLowerCase();
      const authorized = (emailMatches && (safeEqual(body.password || '', adminPassword) || safeEqual(body.password || '', adminPin)))
        || safeEqual(body.passcode?.trim() || '', adminPin)
        || safeEqual(body.passcode?.trim() || '', adminPassword);
      if (!authorized) return response({ success: false, error: 'Invalid credentials.' }, 401);

      const store = await getStore();
      const token = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
      if (!store.sessions) store.sessions = {};
      store.sessions[token] = { email: adminEmail || 'portfolio-owner', createdAt: Date.now(), expiresAt: Date.now() + 7 * 86400000 };
      await saveStore(store);
      return response({ success: true, token, user: { email: adminEmail || 'portfolio-owner', role: 'admin', name: store.profile?.name || 'Portfolio Owner' } });
    }

    if (req.method === 'GET' && path === '/auth/verify') {
      const session = await requireAdmin(req);
      return session
        ? response({ success: true, authenticated: true, user: { email: session.email, role: 'admin' } })
        : response({ success: false, authenticated: false }, 401);
    }

    if (req.method === 'POST' && path === '/auth/logout') {
      const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (token) {
        const store = await getStore();
        delete store.sessions?.[token];
        await saveStore(store);
      }
      return response({ success: true });
    }

    if (req.method === 'POST' && path === '/portfolio/contact') {
      if (!body.name || !body.email || !body.message) return response({ success: false, error: 'Please fill in all required fields.' }, 400);
      const store = await getStore();
      store.inquiries = store.inquiries || [];
      store.inquiries.unshift({ id: `inq-${Date.now()}`, name: body.name.trim(), email: body.email.trim(), subject: (body.subject || 'Portfolio Contact Inquiry').trim(), message: body.message.trim(), inquiryType: body.inquiryType || 'General', date: new Date().toISOString(), read: false });
      await saveStore(store);
      return response({ success: true, message: 'Thank you! Your message has been sent successfully.' });
    }

    const session = await requireAdmin(req);
    if (!session) return response({ success: false, error: 'Admin authentication required.' }, 401);

    if (req.method === 'POST' && path === '/admin/portfolio') {
      const store = await getStore();
      for (const key of ['profile', 'projects', 'services', 'skills', 'experience', 'education', 'certifications', 'socials']) {
        if (body[key]) store[key] = body[key];
      }
      await saveStore(store);
      return response({ success: true, portfolio: store });
    }

    if (req.method === 'POST' && path === '/admin/projects') {
      const store = await getStore();
      store.projects = store.projects || [];
      const project = { ...body, id: body.id || `proj-${Date.now()}`, stars: body.stars || 0, completionDate: body.completionDate || new Date().getFullYear().toString() };
      store.projects.unshift(project);
      await saveStore(store);
      return response({ success: true, project });
    }

    const projectMatch = path.match(/^\/admin\/projects\/(.+)$/);
    if (projectMatch && req.method === 'PUT') {
      const store = await getStore();
      const id = projectMatch[1];
      const index = (store.projects || []).findIndex((project) => project.id === id);
      if (index < 0) store.projects = [{ ...body, id }, ...(store.projects || [])];
      else store.projects[index] = { ...store.projects[index], ...body, id };
      await saveStore(store);
      return response({ success: true });
    }

    if (projectMatch && req.method === 'DELETE') {
      const store = await getStore();
      store.projects = (store.projects || []).filter((project) => project.id !== projectMatch[1]);
      await saveStore(store);
      return response({ success: true });
    }

    if (req.method === 'POST' && path === '/admin/media/upload') {
      if (!body.dataUrl) return response({ success: false, error: 'Missing image data.' }, 400);
      const imageUrl = body.dataUrl.startsWith('data:') ? await uploadImage(body.dataUrl) : body.dataUrl;
      return response({ success: true, url: imageUrl });
    }

    if (req.method === 'GET' && path === '/admin/inquiries') {
      const store = await getStore();
      return response({ success: true, inquiries: store.inquiries || [] });
    }

    const inquiryMatch = path.match(/^\/admin\/inquiries\/(.+)$/);
    if (inquiryMatch && req.method === 'DELETE') {
      const store = await getStore();
      store.inquiries = (store.inquiries || []).filter((inquiry) => inquiry.id !== inquiryMatch[1]);
      await saveStore(store);
      return response({ success: true });
    }

    if (req.method === 'POST' && path === '/admin/reset') {
      await supabase.from('portfolio_store').delete().eq('id', 'main');
      return response({ success: true });
    }

    return response({ success: false, error: 'Route not found.' }, 404);
  } catch (error) {
    return response({ success: false, error: error instanceof Error ? error.message : 'Server error.' }, 500);
  }
});
