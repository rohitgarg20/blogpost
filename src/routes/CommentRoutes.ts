import express from 'express';
import { authenticateUser } from '../controller/auth';
import { addComment, deleteComment } from '../controller/comment';
const commentRouter = express.Router()

commentRouter.route('/:postId').post(authenticateUser, addComment)
commentRouter.route('/:commentId').delete(authenticateUser, deleteComment)

export {
    commentRouter
}
