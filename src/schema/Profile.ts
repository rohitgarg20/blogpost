import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '.';

interface IExpercience {
    _id?: mongoose.Types.ObjectId
    title?: string
    company?: string
    location?: string
    from?: Date
    to?: Date
    current?: boolean
    description?: string
}

interface IEducation {
    _id?:  mongoose.Types.ObjectId
    school: string
    degree: string
    fieldsOfStudy: string
    from: Date
    to?: Date
    current?: boolean
    description?: string
}

interface ISocial {
    twitter?: string
    facebook?: string
    linkedIn?: string
    instagram?: string
    youtube?: string
}

interface IUserProfile {
    company?: string,
    website?: string
    location?: string
    status: string
    skills?: [string]
    bio?: string
    githubUserName?: string
    user: IUser['_id']
    experiences?: [IExpercience]
    education?: [IEducation]
    social?: ISocial
}

interface IProfile extends IUserProfile, Document {}

const experenceSchema: Schema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
})

const educationSchema: Schema = new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    fieldsOfStudy: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
    },
    current: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }

})

const socialSchema: Schema = new mongoose.Schema({
    youtube: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    linkedIn: {
        type: String
    },
    instagram: {
        type: String
    }
})

const profileSchema: Schema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String, // developer, senior developer, instructor or any other
        required: true
    },
    skills: [String],
    bio: {
        type: String
    },
    githubUserName: {
        type: String
    },
    experiences: [experenceSchema],
    education: [educationSchema],
    social: socialSchema,
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


const Profile = mongoose.model<IProfile>('profile', profileSchema)

export {
    Profile,
    IProfile,
    ISocial,
    IUserProfile,
    IExpercience
}