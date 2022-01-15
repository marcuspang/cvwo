export const fullUrl = (pathname: string) => {
  return new URL(pathname, process.env.NEXT_PUBLIC_BACKEND_URL).href;
};

// need credentials for login
export const getFetcher = (url: string, options: RequestInit = {}) =>
  fetch(fullUrl(url), {
    ...options,
    credentials: "include",
  }).then((res) => res.json());

type RequestMethods = "POST" | "PUT" | "PATCH" | "DELETE";

// generate POST, PUT, PATCH, DELETE fetchers by passing method in useSWR hook
// see https://swr.vercel.app/docs/arguments#multiple-arguments
export const otherFetchers = (
  url: string,
  body: Record<string, any> = {},
  options: RequestInit = {},
  method: RequestMethods
) =>
  fetch(fullUrl(url), {
    ...options,
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    credentials: "include",
    body: JSON.stringify(body),
  }).then((res) => res.json());

// default fetcher
export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());
