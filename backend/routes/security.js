import express from 'express';
import SecurityController from '../controllers/SecurityController.js';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const securityRouter = express.Router();

// Record security incident (Admin only)
securityRouter.post(
    '/incidents',
    accessTokenAutoRefresh,
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    SecurityController.recordIncident
);

// Get security incidents (Admin only)
securityRouter.get(
    '/incidents',
    accessTokenAutoRefresh,
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    SecurityController.getIncidents
);

export default securityRouter;