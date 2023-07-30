
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
//@desc Auth user/set/token
//route Post/api/user/auth
//@access Public

const authUser = asyncHandler(async (req, res) => {
    // res.status(401);
    // throw new Error('something went wrong')
    /*res.status(200).json({ message: 'Auth User' })*/
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

//@desc Register a new user
//route Post/api/user
//@access Public

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body
    console.log(name)
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password })

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('User not created')
    }
    // res.status(200).json({ message: 'Register user' })
})

//@desc Logout user
//route Post/api/user/logout
//@access Public

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logged Out ' })
})

//@desc getUser profile
//route Post/api/user/profile
//@access Private

const getUserProfile = asyncHandler(async (req, res) => {
    console.log(req.user)
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    }

    // res.status(200).json({ message: 'getProfile User' })
    res.status(200).json(user)
})


//@desc Update User profile
//route Post/api/user/profile
//@access Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }
        const updateUser = await user.save()
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
        })

    } else {
        res.status(404);
        throw new Error('User not found');
    }
    // res.status(200).json({ message: 'UpdateProfile User' })
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};