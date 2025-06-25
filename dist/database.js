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
exports.closeDatabaseConnection = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const databaseURI = process.env.MONGO_URI;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(databaseURI);
        const db = mongoose_1.default.connection.db;
        const collections = yield (db === null || db === void 0 ? void 0 : db.listCollections().toArray());
        console.log("Connected to database:", db === null || db === void 0 ? void 0 : db.databaseName);
        console.log("Database URI:", databaseURI);
        console.log("Collections in the database:", collections === null || collections === void 0 ? void 0 : collections.map((col) => col.name));
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error instanceof Error ? error.message : error);
    }
});
exports.connectToDatabase = connectToDatabase;
const closeDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        console.log("Successfully disconnected from MongoDB");
    }
    catch (error) {
        console.error("Error disconnecting from MongoDB:", error instanceof Error ? error.message : error);
    }
});
exports.closeDatabaseConnection = closeDatabaseConnection;
//# sourceMappingURL=database.js.map