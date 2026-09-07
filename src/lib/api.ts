const configuredBaseUrl = import.meta.env.VITE_PORTFOLIO_API_URL?.replace(/\/$/, '');

export function apiUrl(path: string) {
  const suffix = path.replace(/^\/api/, '');
  return configuredBaseUrl ? `${configuredBaseUrl}${suffix}` : `/api${suffix}`;
}

export function portfolioFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}
