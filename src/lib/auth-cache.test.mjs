import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthCache, isMongoConnectionError } from './auth-cache.js';

// Minimal stand-in for a MongoClient: connect() can be made to fail, and the
// cache only needs close() and the EventEmitter surface.
function makeClient({ failConnect = false } = {}) {
  const listeners = new Map();
  return {
    closed: false,
    connectCalls: 0,
    async connect() {
      this.connectCalls += 1;
      if (failConnect) {
        const error = new Error('connect ECONNREFUSED 127.0.0.1:1');
        error.name = 'MongoServerSelectionError';
        throw error;
      }
    },
    on(event, handler) {
      listeners.set(event, handler);
    },
    emit(event) {
      const handler = listeners.get(event);
      if (handler) handler();
    },
    async close() {
      this.closed = true;
    },
  };
}

test('a failed connect rejects and the next get() builds a new client', async () => {
  const clients = [];
  const cache = createAuthCache(async () => {
    const client = makeClient({ failConnect: clients.length === 0 });
    clients.push(client);
    return { auth: { id: clients.length }, client };
  });

  await assert.rejects(cache.get(), /ECONNREFUSED/);

  // The rejected promise must not be memoised: this builds client #2.
  const auth = await cache.get();
  assert.equal(auth.id, 2);
  assert.equal(clients.length, 2);
  assert.equal(clients[1].connectCalls, 1);

  // A healthy cache keeps returning the same instance.
  assert.equal(await cache.get(), auth);
  assert.equal(clients.length, 2);
});

test('emitting topologyClosed makes the next get() build a new client', async () => {
  const clients = [];
  const cache = createAuthCache(async () => {
    const client = makeClient();
    clients.push(client);
    return { auth: { id: clients.length }, client };
  });

  const first = await cache.get();
  assert.equal(first.id, 1);

  clients[0].emit('topologyClosed');
  assert.equal(clients[0].closed, true);

  const second = await cache.get();
  assert.equal(second.id, 2);
  assert.equal(clients.length, 2);
});

test('reset() closes the current client and forces a reconnect', async () => {
  const clients = [];
  const cache = createAuthCache(async () => {
    const client = makeClient();
    clients.push(client);
    return { auth: { id: clients.length }, client };
  });

  await cache.get();
  cache.reset();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(clients[0].closed, true);
  assert.equal((await cache.get()).id, 2);
});

test('concurrent get() calls share one connect', async () => {
  const clients = [];
  const cache = createAuthCache(async () => {
    const client = makeClient();
    clients.push(client);
    return { auth: { id: clients.length }, client };
  });

  const [a, b] = await Promise.all([cache.get(), cache.get()]);
  assert.equal(a, b);
  assert.equal(clients.length, 1);
  assert.equal(clients[0].connectCalls, 1);
});

test('isMongoConnectionError matches driver failures only', () => {
  const topology = Object.assign(new Error('Topology is closed'), {
    name: 'MongoTopologyClosedError',
  });
  const selection = Object.assign(new Error('timed out'), {
    name: 'MongoServerSelectionError',
  });
  const network = Object.assign(new Error('socket hang up'), {
    name: 'MongoNetworkError',
  });

  assert.equal(isMongoConnectionError(topology), true);
  assert.equal(isMongoConnectionError(selection), true);
  assert.equal(isMongoConnectionError(network), true);
  assert.equal(isMongoConnectionError(new Error('Invalid credentials')), false);
  assert.equal(isMongoConnectionError(null), false);
});
