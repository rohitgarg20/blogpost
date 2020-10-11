import mongoose, { Schema, Document } from 'mongoose';
import validator  from 'validator'; 
import bcrypt from 'bcrypt';

interface IUser extends Document{
    name: string,
    email: string,
    password: string | any,
    passwordChangedAt?: number
    avtar?: string
    createdWhen?: number
    createdAt?: Date
    checkPassword(hashedPassword: string, plainPassword: string): string
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is the required field'],
        trim: true,
        minlength: 5
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: [true, 'Email is the required field'],
        validate: validator.isEmail
    },
    password: {
        type: String,
        minlength: [6, 'Password should be atleast of 6 length'],
        required: [true, 'Password is required']
    },
    passwordChangedAt: {
        type: Number,
    },
    avtar: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

userSchema.pre<IUser>('save', async function(next) {
    if(this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 12)
        this.password = hashedPassword
        this.passwordChangedAt = Date.now() - 1000;
        return next()
    }
    return next()
})

userSchema.virtual('createdWhen').get(function(this: IUser ){
    return this.createdAt && this.createdAt.getTime()
})

userSchema.methods.checkPassword = async function(hashedPassword: string, plainPassword: string){
    const isPasswordSame = await bcrypt.compare(plainPassword, hashedPassword)
    return isPasswordSame
}


const User = mongoose.model<IUser>('user', userSchema)

export {
    User,
    IUser
}