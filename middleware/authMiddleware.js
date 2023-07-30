import jwt from "jsonwebtoken";

import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    //const token = req.headers.authorization?.split(' ')[1];
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = await User.findById(decoded.userId).select('-password ');
            next();

        } catch (error) {
            res.status(401);
            throw new Error('not Authorized,invalid token');
        }
    } else {
        res.status(401);
        throw new Error('not Authorized,no token');
    }
})
export { protect }
