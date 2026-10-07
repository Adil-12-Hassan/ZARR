import mongoose from "mongoose";

const cacheKey = "__zarrMongoose";
const cached = globalThis[cacheKey] ??= { conn: null, promise: null };

async function connectDB() {
  if (cached.conn?.connection.readyState === 1) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");

  // A previous connection may have dropped while this process stayed alive.
  // Do not return its resolved promise or stale connection on the next request.
  if (cached.conn && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.host);
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        cached.conn = null;
        cached.promise = null;
        throw err;
      });
  }
  return cached.promise;
}

export default connectDB;
