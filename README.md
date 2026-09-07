# Aila Marie B. Aleria Portfolio PWA

An installable portfolio for a Graphic Designer, Frontend Developer, and UI/UX Designer. GitHub Pages hosts the frontend, while a Supabase Edge Function permanently stores portfolio data, inquiries, and uploaded images.

## Run locally

1. Run `npm install`.
2. Create `.env.local` and set `VITE_PORTFOLIO_API_URL` to the deployed Supabase Edge Function URL.
3. Run `npm run dev`.
4. Open `http://localhost:5173`. The admin dashboard uses `#/admin`.

## Set up Supabase

1. Open the Supabase SQL Editor, paste `supabase/setup.sql`, and run it once.
2. Link the Supabase CLI to the new project:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Set private admin credentials and deploy the API:

   ```bash
   npx supabase secrets set ADMIN_EMAIL="owner@example.com" ADMIN_PASSWORD="your-strong-password" ADMIN_PIN="optional-pin"
   npx supabase functions deploy portfolio-api --no-verify-jwt
   ```

4. In the `AilaPortfolio` GitHub repository, create the Actions variable:

   ```text
   VITE_PORTFOLIO_API_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/portfolio-api
   ```

5. In repository Settings → Pages, choose **GitHub Actions** as the source. The included workflow publishes the site after every push to `main`.

The published site is `https://2001105254-netizen.github.io/AilaPortfolio/`, and the admin route is `https://2001105254-netizen.github.io/AilaPortfolio/#/admin`.
