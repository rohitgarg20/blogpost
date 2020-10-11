import { Application } from "express";
import express from 'express';
import { userRouter } from "./routes/UserRoutes";
import { profileRouter } from './routes/ProfileRoutes';
import { errorController } from "./controller/error";
import { postRouter } from "./routes/PostRoutes";
import { commentRouter } from "./routes/CommentRoutes";

const app: Application = express();

app.use(express.json());

app.use((req,res,next) => {
    next()
})
app.use('/api/v1/user', userRouter )
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/comment', commentRouter)

app.use(errorController)

export {
    app
};


