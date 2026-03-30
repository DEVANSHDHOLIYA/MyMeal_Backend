import express from 'express';
import { authRoute } from './auth.routes.js';
import { profilerouter } from './profile.routes.js';
import { subscriptionrouter } from './subscription.routes.js';
import { userrouter } from './user.routes.js';
const _Router = express.Router({
    strict: true,
  mergeParams: true,
  caseSensitive: true,
})

_Router.use('/auth',authRoute);
_Router.use('/profile',profilerouter);
_Router.use('/subscription',subscriptionrouter);
_Router.use('/user',userrouter);
export const indexRoute = _Router;