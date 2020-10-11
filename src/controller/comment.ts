import { NextFunction, Response } from "express"
import { Comment } from "../schema/Comment"
import { catchAsync } from "../utils"

const addComment = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {_id, name, avtar } = req.currentUser
    const { comment } = req.body
    const { postId } = req.params
    const commentData = await Comment.create({
        name,
        avtar,
        user: _id,
        comment,
        post: postId
    })
    res.status(200).json({
        status: 'Success',
        message: "Comment has been successfully added",
        data: {
            comment: commentData
        }
    })
})

const deleteComment = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { commentId } = req.params
    const commentData = await Comment.findByIdAndDelete(commentId)
    res.status(200).json({
        status: 'Success',
        message: "Comment has been successfully deleted",
    })
})

export {
    addComment,
    deleteComment
}