/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to DB!");

    server = app.listen(envVars.PORT, () => {
      console.log(`🔥 Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Start Server Error : ", error);
  }
};

(async () => {
  await startServer();
})();

/**
 * unhandled rejection error -> promise not handled
 * uncaught rejection error
 * signal termination - sigterm
 */

process.on("unhandledRejection", () => {
  console.log("🚫 Unhandled Rejection detected. Server shutting down!");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("🚫 Uncaught Exception detected. Server shutting down!");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("🚫 SIGTERM signal received. Server shutting down!");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("🚫 SIGINT signal received. Server shutting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
