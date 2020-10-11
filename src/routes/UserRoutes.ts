import express from 'express';
import { createUser, loginUser } from '../controller/auth';

const userRouter = express.Router()

userRouter.route('/signup').post(createUser)

userRouter.route('/login').post(loginUser)

export  {
    userRouter
}