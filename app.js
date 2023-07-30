import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectdb from "./config/db.js";
const port = process.env.PORT
import userRoutes from './routes/userRouter.js'
import { protect } from "./middleware/authMiddleware.js";

connectdb()
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json())//middleware function ho jasle chai body req ma json data pathune kam garxa 
app.use(express.urlencoded({ extended: true }))//commonly used for processing form data submitted from HTML forms.

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Parsed cookies:', req.cookies);
    next();
})
app.put('http://localhost:5000/api/users/profile', protect, async (req, res) => {
    const { name, email, password } = req.body;
    const user = req.user;

    try {
        user.name = name;
        user.email = email;
        user.password = password;

        await user.save();

        res.json({ message: 'profile updated successfully' })
    } catch (err) {
        res.status(500).json({ message: 'faild to update profile' })
    }



});
app.use('/api/users', userRoutes)

//for Route
app.get('/', (req, res) => res.send('Server is ready'))
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`))