"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database");
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 3001;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectToDatabase)();
        const httpServer = http_1.default.createServer(app_1.default);
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Shutting down gracefully...");
            yield (0, database_1.closeDatabaseConnection)();
            httpServer.close((err) => {
                if (err) {
                    console.error("Error closing server:", err);
                    process.exit(1);
                }
                process.exit(0);
            });
        });
        process.on("SIGINT", gracefulShutdown);
        process.on("SIGTERM", gracefulShutdown);
    }
    catch (error) {
        console.error("Failed to start server:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=server.js.map