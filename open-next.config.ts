// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});


// import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// export default defineCloudflareConfig({
//   incrementalCache: withRegionalCache(r2IncrementalCache, {
//     mode: "long-lived", // or "short-lived"
//     shouldLazilyUpdateOnCacheHit: true,
//   }),
// });