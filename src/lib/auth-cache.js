// Memoises a connectable auth resource (BetterAuth + its MongoClient) so that a
// failed connect is retried on the next request instead of caching a dead client
// forever. Kept dependency-free so the reset logic can be unit tested with an
// injected factory.
const CONNECTION_ERROR_PATTERN =
  /MongoTopologyClosedError|MongoServerSelectionError|MongoNetworkError|Topology is closed/;

export function isMongoConnectionError(error) {
  if (!error) return false;
  return (
    CONNECTION_ERROR_PATTERN.test(error.name ?? "") ||
    CONNECTION_ERROR_PATTERN.test(error.message ?? "")
  );
}

export function createAuthCache(factory) {
  let pending = null;
  let current = null;

  async function get() {
    if (!pending) {
      pending = (async () => {
        // Connect eagerly so a bad host fails here, before any request work.
        const { auth, client } = await factory();
        await client.connect();
        client.on("topologyClosed", () => {
          if (current?.client === client) reset();
        });
        current = { auth, client };
        return auth;
      })().catch((error) => {
        // Never keep a rejected promise: the next call must build a new client.
        pending = null;
        current = null;
        throw error;
      });
    }
    return pending;
  }

  function reset() {
    const previous = current;
    pending = null;
    current = null;
    previous?.client.close().catch(() => {});
  }

  return { get, reset };
}
