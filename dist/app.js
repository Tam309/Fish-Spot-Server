"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const cloudinaryRoute_1 = __importDefault(require("./routes/cloudinaryRoute"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const swagger_1 = require("./swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Fish Spot Server!');
});
app.use('/users', userRoute_1.default);
app.use('/cloudinary', cloudinaryRoute_1.default);
app.use('/posts', postRoute_1.default);
app.use('/comments', commentRoute_1.default);
(0, swagger_1.setupSwaggerDocs)(app);
exports.default = app;
//# sourceMappingURL=app.js.map