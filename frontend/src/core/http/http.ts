type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface FetchOptions extends RequestInit {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string | FormData;
}

interface AdaterOptions {
  baseURL: string;
  includeToken: boolean;
  isBlob: boolean;
}

interface FetchAdapter {
  get: <T>(endpoint: string, headers?: Record<string, string>) => Promise<T>;
  post: <B, T>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ) => Promise<T>;
  patch: <B, T>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ) => Promise<T>;
  delete: <B, T>(
    endpoint: string,
    body: B,
    headers?: Record<string, string>,
  ) => Promise<T>;
}

const requestWithTimeout = async (
  url: string,
  options: FetchOptions,
  timeout = 30000,
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const createFetchAdapter = ({
  baseURL,
  isBlob = false,
}: AdaterOptions): FetchAdapter => {
  const request = async <B, T>(
    endpoint: string,
    method: HttpMethod,
    body?: B,
    headers: Record<string, string> = {},
    retries = 3,
  ): Promise<T> => {
    const url = `${baseURL}${endpoint}`;

    // const token = includeToken ? getToken() : null
    // if (includeToken && (token === null || token === '')) {
    //   throw new Error('Unauthorized: No token found')
    // }

    const options: FetchOptions = {
      method,
      credentials: "include",
      headers: {
        ...(body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...headers,
      },
      ...(body !== undefined &&
        body !== null &&
        !(body instanceof FormData) && {
          body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    };

    try {
      const response = await requestWithTimeout(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            message: errorText !== "" ? errorText : "Unknown error occurred",
          };
        }
        throw Object.assign(new Error(errorData.message), {
          status: response.status,
        });
      }
      if (isBlob) {
        return (await response.blob()) as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying request to ${url} (${retries} retries left)...`);
        return await request<B, T>(
          endpoint,
          method,
          body,
          headers,
          retries - 1,
        );
      }
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const get = async <T>(
    endpoint: string,
    headers: Record<string, string> = {},
  ): Promise<T> =>
    await request<undefined, T>(endpoint, "GET", undefined, headers);

  const post = async <B, T>(
    endpoint: string,
    body: B,
    headers: Record<string, string> = {},
  ): Promise<T> => await request<B, T>(endpoint, "POST", body, headers);

  const patch = async <B, T>(
    endpoint: string,
    body: B,
    headers: Record<string, string> = {},
  ): Promise<T> => await request<B, T>(endpoint, "PATCH", body, headers);

  const deleteRequest = async <B, T>(
    endpoint: string,
    body?: B,
    headers: Record<string, string> = {},
  ): Promise<T> => await request<B, T>(endpoint, "DELETE", body, headers);

  return { get, post, patch, delete: deleteRequest };
};

// Create adapters
const baseURL: string =
  typeof import.meta.env.VITE_BASE_URL === "string"
    ? import.meta.env.VITE_BASE_URL
    : "http://localhost:3001/api";

export const httpPublic = createFetchAdapter({
  baseURL,
  includeToken: false,
  isBlob: false,
});
export const httpPrivate = createFetchAdapter({
  baseURL,
  includeToken: true,
  isBlob: false,
});

export const httpPrivateBlob = createFetchAdapter({
  baseURL,
  includeToken: true,
  isBlob: true,
});
