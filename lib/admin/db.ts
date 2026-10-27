import mongoose from "mongoose";

type ConnectionCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & {
  __gatewayAdminMongo?: ConnectionCache;
};

const cache = (globalCache.__gatewayAdminMongo ??= {
  connection: null,
  promise: null,
});

export async function connectAdminDb() {
  if (cache.connection) return cache.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB_NAME || "test",
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
