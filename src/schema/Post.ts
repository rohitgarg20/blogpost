import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    name: {
        type: String
    },
    avtar: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: [true, 'Post requires text']
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

postSchema.virtual('comments', {
    ref: 'comment',
    localField: '_id',
    foreignField: 'post'
})

const Post = mongoose.model('post', postSchema)

export {
    Post
}