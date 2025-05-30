import { unstable_cache as next_unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Options for the custom unstable_cache.
 */
export interface CustomCacheOptions {
  /**
   * The revalidation period in seconds.
   * Alternatively, `false` to cache indefinitely until manually revalidated,
   * or `0` to prevent caching (always revalidate).
   */
  revalidate: number | false;
  /**
   * An array of tags to associate with the cache entry.
   * These tags are used for on-demand revalidation.
   */
  tags: string[];
}

/**
 * A custom caching utility that combines Next.js's `unstable_cache` with React's `cache`.
 *
 * `next_unstable_cache` handles server-side data caching with revalidation strategies (time-based or on-demand via tags).
 * `react.cache` handles request-time memoization, preventing re-computation of the same promise
 * if the cached function is called multiple times with the same arguments during a single server render pass.
 *
 * @template Args - The argument types of the callback function.
 * @template Return - The return type of the callback function.
 * @param callback - The asynchronous function whose result needs to be cached.
 * @param keyParts - An array of strings that uniquely identify the cache entry.
 *                              These are used by `next_unstable_cache` to generate a cache key.
 * @param options - Options for caching, including `revalidate` time and `tags` for invalidation.
 * @returns The cached version of the callback function.
 */
export const customUnstableCache = <Args extends unknown[], Return>(
  callback: (...args: Args) => Promise<Return>,
  keyParts: string[],
  options: CustomCacheOptions,
): ((...args: Args) => Promise<Return>) => {
  // Wrap with next_unstable_cache for data caching and revalidation
  const nextCachedCallback = next_unstable_cache(callback, keyParts, options);
  // Wrap with React's cache for request-time memoization/deduplication
  return cache(nextCachedCallback) as (...args: Args) => Promise<Return>;
}; 