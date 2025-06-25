import app from "./app";
import { connectToDatabase, closeDatabaseConnection } from "./database";
import http from "http";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectToDatabase();
    
    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const gracefulShutdown = async () => {
      console.log("Shutting down gracefully...");
      await closeDatabaseConnection();
      httpServer.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          process.exit(1);
        }
        process.exit(0);
      });
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error(
      "Failed to start server:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

startServer();