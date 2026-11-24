export function resolveAuth0BaseUrl(domain: string): string {
  return (domain.startsWith('http') ? domain : `https://${domain}`).replace(/\/$/, '');
}
