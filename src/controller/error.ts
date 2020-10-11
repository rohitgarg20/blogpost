import { NextFunction, Request, Response } from "express";

const errorController = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('error is', err)
    const { statusCode =  500, errorMessage = 'Something went wrong', errorStatus = 'failure' } = err
    return res.status(statusCode).json({
        status: errorStatus,
        message: errorMessage,
        err
    })
}

export {
    errorController
}