import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/Error';
class GenerateToken{
 
    generateAuthToken = (payload: any) => {
        const secretKey = process.env.secretKey || ''
        const token = jwt.sign(payload, secretKey, {
            expiresIn: 3600
        } )
        return token;
    }

    verifyAuthToken = (userToken: string, next: NextFunction) => {
        const secretKey = process.env.secretKey || ''
        if(!userToken) {
            return next(new ApiError('Please login', 400))
        }
        const token =  userToken.split(' ')
        if(!token[0] || token[0]!== 'JWT' || !token[1]){
            return next(new ApiError('Please login', 400))
        }

        const tokenValue = token[1]
        const decodedData = jwt.verify(tokenValue, secretKey )

        return decodedData
    }

}

export {
    GenerateToken
}