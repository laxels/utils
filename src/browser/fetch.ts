type ExtraFetchOptions = {
  baseURL?: string;
};

export function fetch(
  path: string,
  init?: RequestInit & ExtraFetchOptions
): ReturnType<typeof window.fetch> {
  return window.fetch(`${init?.baseURL ?? ``}${path}`, init);
}
