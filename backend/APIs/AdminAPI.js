// Admin API routes for platform administration
import exp from 'express'
import { ArticleTypeModel } from '../models/ArticleModel.js'
import { UserTypeModel } from '../models/UserModel.js'
import { authenticate } from '../services/authService.js'
export const adminRoute=exp.Router()

// Implement admin authentication
adminRoute.post('/users', async (req, res, next) => {
    let userObj = req.body
    const authRes = await authenticate(userObj.email, userObj.password, 'admin')
    res.status(200).json({ message: 'Admin authenticated', ...authRes })
})

// Implement read all articles functionality
adminRoute.get('/articles', async (req, res, next) => {
    const articles = await ArticleTypeModel.find()
    res.status(200).json({ message: 'Articles list', payload: articles })
});


// Write two functions to block and unblock author separately
adminRoute.put('/block/:authorId', async (req, res, next) => {
    const authorId = req.params.authorId
    const updated = await UserTypeModel.findOneAndUpdate(
        { _id: authorId, role: 'author' },
        { isActive: false },
        { new: true }
    )
    if (!updated) {
        return res.status(404).json({ message: 'Author not found' })
    }
    res.status(200).json({ message: 'Author blocked', payload: updated })
}
)


adminRoute.put('/unblock/:authorId', async (req, res, next) => {
    const authorId = req.params.authorId
    const updated = await UserTypeModel.findOneAndUpdate(
        { _id: authorId, role: 'author' },
        { isActive: true },
        { new: true }
    )
    if (!updated) {
        return res.status(404).json({ message: 'Author not found' })
    }
    res.status(200).json({ message: 'Author unblocked', payload: updated })
})