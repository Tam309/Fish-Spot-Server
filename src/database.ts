// db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not set. Add it in Lambda > Configuration > Environment variables.');
}

// Cache across hot-reloads and Lambda invocations
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: typeof mongoose | null | undefined;
  // eslint-disable-next-line no-var
  var __mongoosePromise: Promise<typeof mongoose> | null | undefined;
}

const g = global as typeof global & {
  __mongooseConn?: typeof mongoose | null;
  __mongoosePromise?: Promise<typeof mongoose> | null;
};

// Reasonable defaults for Lambda + Atlas
const options: mongoose.ConnectOptions = {
  // Fail fast if cluster unreachable (helps surface NAT/allowlist issues)
  serverSelectionTimeoutMS: 5000,
  // Allow long I/O while query runs
  socketTimeoutMS: 45000,
  // Keep the pool small for Lambda
  maxPoolSize: 5,
  minPoolSize: 0,
  // IPv4 sometimes avoids DNS6 hiccups in serverless envs
  family: 4,
};

mongoose.connection.on('connected', () => console.log('[MongoDB] connected'));
mongoose.connection.on('disconnected', () => console.warn('[MongoDB] disconnected'));
mongoose.connection.on('error', (err) => console.error('[MongoDB] error', err));

/**
 * Connect once and reuse the connection for subsequent Lambda invocations.
 * Call this at cold start (before handler) or before app.listen() if using the Web Adapter.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (g.__mongooseConn) return g.__mongooseConn;
  if (!g.__mongoosePromise) {
    console.log('[MongoDB] connecting…');
    g.__mongoosePromise = mongoose.connect(uri!, options).catch((err) => {
      // Reset the promise so a future retry can happen
      g.__mongoosePromise = null;
      throw err;
    });
  }
  g.__mongooseConn = await g.__mongoosePromise;

  // Optional: very noisy; enable only when debugging
  if (process.env.DEBUG_DB_INTROSPECT === 'true') {
    try {
      const db = mongoose.connection.db;
      const cols = await db?.listCollections().toArray();
      console.log('[MongoDB] DB:', db?.databaseName);
      console.log('[MongoDB] Collections:', cols?.map((c) => c.name));
    } catch (e) {
      console.warn('[MongoDB] Introspection failed (non-fatal):', (e as Error).message);
    }
  }

  return g.__mongooseConn!;
}

/**
 * In Lambda you usually do NOT disconnect between requests.
 * Only use this in local scripts or test teardown.
 */
export async function closeDatabaseConnection() {
  await mongoose.disconnect();
  g.__mongooseConn = null;
  g.__mongoosePromise = null;
  console.log('[MongoDB] disconnected manually');
}
