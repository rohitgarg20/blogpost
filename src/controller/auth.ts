import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../schema';
import { catchAsync } from '../utils';
import { ApiError } from '../utils/Error';
import { GenerateToken } from './generateToken';

const checkIsUserExists = (async(emailId: string) => {
    const userData = await User.findOne({
        email: emailId
    })

    return userData
})

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log('createUser' )
    const { name, email, password }:IUser = req.body

    const isUserExists = await checkIsUserExists(email);
    if(isUserExists) {
        return res.status(400).json({
            status: 'Failure',
            message: 'User Already exists . Please login'
        })
    }
    const createdUser: IUser = await User.create({
        name,
        email,
        password
    })
    console.log('createdUsercreatedUser', createdUser)
    const token = new GenerateToken().generateAuthToken( { _id: createdUser._id } )
    return res.status(200).json({
        status: 'Success',
        message: 'User Created Successfully',
        token: token,
        data: {
            user: createdUser
        }
    })
})


const loginUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { email, userPassword } = req.body
    const userData  = await checkIsUserExists(email)
    if(!userData) {
        return next(new ApiError('Please Signup no user is linked with this email id', 404))
    }
    const { password } = userData
    console.log('loginUser',userData )
   const isPasswordCorrect = await userData.checkPassword(password, userPassword)

   if(!isPasswordCorrect) {
       return next(new ApiError('User password incorrect', 400))
   }

   userData.password = undefined
   const authToken = new GenerateToken().generateAuthToken({ _id: userData._id })
   return res.status(200).json({
    status: 'Success',
    message: 'User Logged in Successfully',
    token: authToken,
    data: {
        user: userData
    }
})


})

const authenticateUser = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { authorization = '' } = req.headers
    const decodedUserData: any =  new GenerateToken().verifyAuthToken(authorization, next)
    if(!decodedUserData) {
        return next(new ApiError('Please login', 400))
    }

    const { _id, iat } = decodedUserData

    const userData: any = await User.findById(_id)
    if(!userData) {
        return next(new ApiError('Please login', 400))
    }

    const isUserPasswordChanged = (userData.passwordChangedAt / 1000) > iat
    if(isUserPasswordChanged) {
        return next(new ApiError('Please login', 400))
    }

    req.currentUser = userData
    next()
})



export {
    createUser,
    loginUser,
    authenticateUser
    
}