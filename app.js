import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerDocs from './server/swagger.js';

import { userRouter } from './routes/user.js'
import { cloudinaryRouter } from './cloudinary/cloudinary.js';
import { postRouter } from './routes/post.js';
import { commentRouter } from './routes/comment.js';

dotenv.config();

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

//initialize routes
app.get('/', (req, res) => {
    res.send('Welcome to Fish Spot API')
})

app.use('/',userRouter)
app.use('/',cloudinaryRouter)
app.use('/',postRouter)
app.use('/',commentRouter)

swaggerDocs(app);

const port = process.env.PORT;

app.listen(port)


