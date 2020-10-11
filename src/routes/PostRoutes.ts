import express from 'express';
import { authenticateUser } from '../controller/auth';
import { addPost, deletePost, editPost, getAllPost, likePost } from '../controller/post';
const postRouter = express.Router()

postRouter.route('/').post(authenticateUser, addPost)
                     .get(authenticateUser, getAllPost)

postRouter.route('/like/:postId').put(authenticateUser, likePost)
postRouter.route('/:postId').put(authenticateUser, editPost)
                     .delete(authenticateUser, deletePost)

export {
    postRouter
}