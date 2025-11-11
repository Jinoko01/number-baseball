export function getHeaders(accessToken: string | undefined): HeadersInit {
  if (!accessToken) {
    return {
      'Content-Type': 'application/json',
    };
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}
