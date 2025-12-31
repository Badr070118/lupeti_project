import { env } from './config';

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: HeadersInit;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
  accessToken?: string | null;
}

export async function fetchApi<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  const url = `${env.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${options.accessToken}`;
  }

  const init: RequestInit = {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers,
    cache: options.cache ?? 'no-store',
    next: options.next,
  };

  if (options.body !== undefined) {
    init.body =
      options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body);
    if (options.body instanceof FormData) {
      // Let the browser set the correct boundary header
      delete (headers as Record<string, string>)['Content-Type'];
    }
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new ApiError(
      0,
      'Unable to reach the API. Please try again shortly.',
      error,
    );
  }

  if (!response.ok) {
    const errorBody = await safeJson(response);
    throw new ApiError(
      response.status,
      errorBody?.message ??
        `Request failed with status ${response.statusText}`,
      errorBody,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  const payload = await safeJson(response);
  return payload as T;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}
