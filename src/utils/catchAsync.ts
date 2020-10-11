import { NextFunction, Response } from "express"

const catchAsync = (fn: any) => {
    return (req: any ,res:  Response ,next: NextFunction ) => {
        fn(req ,res ,next).catch((err: any) => next(err))
    }
}

export {
    catchAsync
}