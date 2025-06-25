"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Fish Spot API Documentation",
            version: "1.0.0",
            description: "API documentation for Fish Spot Server",
        },
        servers: [
            {
                url: "http://localhost:3001", // Replace with your server URL
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Adjust the path to your route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwaggerDocs = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log("Swagger docs available at http://localhost:3001/api-docs");
};
exports.setupSwaggerDocs = setupSwaggerDocs;
//# sourceMappingURL=swagger.js.map