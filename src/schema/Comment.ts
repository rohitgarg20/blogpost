import mongoose, { Schema } from 'mongoose';

const commentSchema: Schema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    name: {
        type: String
    },
    avtar: {
        type: String
    },
    comment: {
        type: String,
        required: [true, 'Comment is required']
    }
})

const Comment = mongoose.model('comment', commentSchema)

export {
    Comment
}