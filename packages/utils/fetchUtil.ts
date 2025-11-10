type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
const BASIC_HEADER = {
  'Content-Type': 'application/json',
};

interface FetchUtilInterface {
  url: string;
  method: Method;
  headers?: HeadersInit;
  body?: unknown;
}

export async function fetchUtil({ url, method, headers = BASIC_HEADER, body }: FetchUtilInterface) {
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  const data = await response.json();

  return data;
}
