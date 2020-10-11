import { NextFunction, Response } from "express";
import { Post } from "../schema/Post";
import { catchAsync } from "../utils";
import { ApiError } from "../utils/Error";

const addPost = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const {_id, name, avtar } = req.currentUser
    const { text } = req.body
    const postAdded = await Post.create({
        name,
        avtar,
        user: _id,
        text
    })
    res.status(200).json({
        status: 'Success',
        message: "post has been successfully added",
        data: {
            post: postAdded
        }
    })
})

const editPost = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const { text } = req.body
    const updatedPost = await Post.findByIdAndUpdate(postId, {
        text
    }, {
        new: true,
        runValidators: true
    })

    if(!updatedPost) {
        return next(new ApiError('No post found with this id', 404))
    }

    return res.status(201).json({
        status: 'Success',
        message: 'post updated successfully',
        data: {
            post: updatedPost
        }
    })
})

const deletePost = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const deletedPost = await Post.findByIdAndDelete(postId)

    if(!deletedPost) {
        return next(new ApiError('No post found with this id', 404))
    }

    return res.status(201).json({
        status: 'Success',
        message: 'post deleted successfully',
    })
})

const likePost = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { postId } = req.params
    const { _id } = req.currentUser

    const postData: any  = await Post.findById(postId)
    console.log('filteredPostData', postData)
    
    const postLikedIndex = postData.likes && postData.likes.findIndex((item: any) => item.toString() === _id)
    console.log('postLikedIndex', postLikedIndex)
    let updatedPostData: any = {}
    if( postLikedIndex === -1 ) {
        updatedPostData =  await postData.updateOne({
            $push: {
                likes: {
                    $each: [ _id ],
                    $position: 0,
                    $sort: {
                        createdAt: -1
                    }
                }
            }
        }, {
            new: true,
            runValidators: true
        })
    } else {
        updatedPostData =  await postData.updateOne({
            $pull: {
               likes: _id
            }
        }, {
            new: true,
            runValidators: true
        })
    }

    return res.status(201).json({
        status: 'Success',
        message: 'post likes updated successfully',
        data: {
            post: updatedPostData
        }
    })
})

const getAllPost = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const posts = await Post.find().populate({
        path: 'comments',
        select: 'name user comment'
    })
    return res.status(200).json({
        status: 'Success',
        count: posts.length,
        data: {
            post: posts
        }
    })
})

export {
    addPost,
    editPost,
    deletePost,
    likePost,
    getAllPost
}

