import { NextFunction, Response, Request  } from "express";
import { IProfile, Profile, ISocial, IUserProfile, IExpercience } from "../schema/Profile";
import { catchAsync } from "../utils";
import { ApiError } from "../utils/Error";
import { get, isEmpty } from 'lodash';
import { User } from "../schema";

const filterKeysAllowed = ['company', 'website', 'location', 'status', 'skills', 'bio', 'githubUserName']
const socialKeys = ['twitter', 'facebook', 'linkedIn', 'instagram', 'youtube']
const experienceKeysAllowed = ['title', 'company', 'location', 'to', 'from', 'current','description']
const educationFieldsAllowed = ['school','degree','fieldsOfStudy','from','to','current','description']


const getMyProfile = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { _id } = req.currentUser
    const profileData = await Profile.findOne({ user: _id }).populate({
        path: 'user',
        select: 'name avtar'
    })

    if(!profileData) {
        return next(new ApiError('No profile exist please create your profile', 400))
    }
     return res.status(200).json({
            status: 'Success',
            message: 'Profile retrieved successfully',
            data: {
                profile: profileData
            }
     })
})  

const createUpdateMyProfile = catchAsync(async(req: any, res: Response, next: NextFunction) => {
   
    const { currentUser } = req
    const { _id } = currentUser
    const profileData = await Profile.findOne({
        user: _id
    })

    let profile: any = {}
    filterKeysAllowed.forEach((key) => {
        if(req.body && Object.keys(req.body).includes(key)) {
            profile = {
                ...profile,
                [key]: req.body[key]
            }
        }
    })

    if(profile.skills) {
        const transformedSkills = profile.skills.split(',')

        profile['skills'] = transformedSkills.map((item: string) => item.trim())
    }

    let socialFields = {}
    socialKeys.forEach(key => {
        if(req.body && Object.keys(req.body).includes(key)) {
            socialFields = {
                ...socialFields,
                ['social.'+ key]: req.body[key]
            }
        }
    })

    if(profileData) {
        const updatedData = await Profile.findOneAndUpdate({ user: _id }, {
            ...socialFields,
            ...profile
        } , {
            new: true,
            runValidators: true
        })

        return res.status(201).json({
            status: 'Success',
            message: 'User profile updated successfully',
            data: {
                profile: updatedData
            }
        })
    } else {
        const profileCreated = await Profile.create({
            ...profile,
            user: _id,
            ...socialFields
        })

        return res.status(200).json({
            status: 'Success',
            message: 'User profile created successfully',
            data: {
                profile: profileCreated
            }
        })
    }
})

// get all profiles

const getAllProfiles = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const profileList =  await Profile.find().populate({
        path: 'user',
        select: 'name avtar'
    })
    return res.status(200).json({
        status: 'Success',
        count: profileList.length,
        data: {
            profiles: profileList
        }
    })
})

const getProfileByUserId = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const profileData = await Profile.findOne({ user: userId }).populate({
        path: 'user',
        select: 'name avtar email'
    })

    if(!profileData) {
        return next(new ApiError('No profile found', 404))
    }
    return res.status(200).json({
        status: 'Success',
        data: {
            profile: profileData
        }
    })

})

// private route remove profile, user and post
const removeMyProfile = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { _id } = req.currentUser
    console.log('req.currentUser', req.currentUser)
    const deletedProfile = await Profile.findOneAndDelete({ user: _id })
    const deleteUser = await User.findByIdAndDelete(_id)
    console.log('deletedProfile', deletedProfile, deleteUser)
    return res.status(200).json({
        status: 'Success',
        message: 'User deleted succesfully'
    })
})

const updateExperience = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    let updatedExperienceData = {}
    experienceKeysAllowed.forEach((key) => {
        if(req.body && Object.keys(req.body).includes(key))
        updatedExperienceData = {
            ...updatedExperienceData,
          [key]: req.body[key]
        }
    })
    const updatedExperience = await Profile.findOneAndUpdate({ user: req.currentUser._id } , {
        $push: {
            experiences: {
                $each: [updatedExperienceData],
                $position: 0
            },

        },
    }, {
        new: true,
        runValidators: true
    } )

    return res.status(201).json({
        status: 'Success',
        data: {
            profile: updatedExperience
        }
    })

})

const deleteExperience = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    const { expId } = req.params
    const deletedExperience: any = await Profile.findOneAndUpdate({ user: req.currentUser._id }, {
        $pull: {
            experiences: {
                _id: expId
            }
        }
    })
    if(!deletedExperience) {
        return next(new ApiError('No experience deleted with this id', 400))
    }
    return res.status(200).json({
        status: 'Success',
        message: 'Experience deleted successfully'
    })
})


const updateEducation = catchAsync(async(req: any, res: Response, next: NextFunction) => {
    let updatedEducationFields: any = {}
    educationFieldsAllowed.forEach((key) => {
        if(req.body && Object.keys(req.body).includes(key)) {
            updatedEducationFields = {
                ...updatedEducationFields,
                [key]: req.body[key]
            }
        }
    })

    const educationAdded = await Profile.findOneAndUpdate({
        user: req.currentUser._id
    }, {
        $push: {
            education: { 
                $each:[updatedEducationFields],
                position: 0
            }
        }
    }, {
        new: true,
        runValidators: true
    })
    return res.status(200).json({
        status: 'Success',
        message: "education field successfully added",
        data: {
            education: educationAdded
        }
    })
    })

const deleteEducation = catchAsync(async(req: any, res: Response, next: NextFunction) => {
        const { educationId } = req.params
        const deletedEducation = await Profile.findOneAndUpdate({
            user: req.currentUser._id
        }, {
            $pull: {
                education: {
                    _id: educationId
                }
            }
        })
        if(!deletedEducation) {
            return next(new ApiError('No experience deleted with this id', 400))
        }
        return res.status(200).json({
            status: 'Success',
            message: 'Education deleted successfully'
        })
})
export {
    getMyProfile,
    createUpdateMyProfile,
    getAllProfiles,
    getProfileByUserId,
    removeMyProfile,
    updateExperience,
    deleteExperience,
    updateEducation,
    deleteEducation
}