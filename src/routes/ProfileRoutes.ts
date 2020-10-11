import express from 'express';
import { authenticateUser } from '../controller/auth';
import { getMyProfile, createUpdateMyProfile, getAllProfiles, getProfileByUserId, removeMyProfile, updateExperience, deleteExperience, updateEducation, deleteEducation } from '../controller/profile';

const profileRouter = express.Router();


profileRouter.route('/me').get(authenticateUser, getMyProfile).delete(authenticateUser, removeMyProfile);

profileRouter.route('/experience').put(authenticateUser, updateExperience)

profileRouter.route('/experience/:expId').delete(authenticateUser, deleteExperience)

profileRouter.route('/education').put(authenticateUser, updateEducation)

profileRouter.route('/education/:educationId').delete(authenticateUser, deleteEducation)

profileRouter.route('/:userId').get(getProfileByUserId)

profileRouter.route('/').post(authenticateUser, createUpdateMyProfile).get(getAllProfiles)


export {
    profileRouter
}