import exp from 'express'
import bcrypt from 'bcrypt'
import { authenticate } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { UserTypeModel } from '../models/UserModel.js'
export const commonRouter=exp.Router()

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        httpOnly: true,
        path: '/',
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
    }
}

//login
commonRouter.post("/login",async(req,res,next)=>{
    try {
            //get user obj from req
            let userObj = req.body
            //call authenticate
            let { token, user } = await authenticate(userObj.email, userObj.password, userObj.role)
            //save token as httponly cookie
            res.cookie("token", token, getCookieOptions())
            //send res
            res.status(200).json({ message: 'User authenticated', user, token })
        } catch (err) {
            next(err)
        }
})

//logout
commonRouter.post("/logout",async(req,res,next)=>{
    res.clearCookie("token", getCookieOptions())
    res.status(200).json({ message: 'Logged out successfully' })
});

//password changing
commonRouter.put("/change-password", verifyToken, async (req, res, next) => {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'currentPassword and newPassword are required' })
        }

        const userId = req.user?.userId
        const user = await UserTypeModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
});

//protected route
commonRouter.get(
    "/check-auth", 
    verifyToken("user", "author", "admin"),
    async (req, res) => {
        const userId = req.user?.userId
        const user = await UserTypeModel.findById(userId).select('-password')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            message: "authenticated",
            user
        })
    }
);