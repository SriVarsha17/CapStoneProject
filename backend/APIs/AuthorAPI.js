// Author API routes for content management
import exp from 'express'
import multer from 'multer'
import { isValidObjectId } from 'mongoose'
import { ArticleTypeModel } from '../models/ArticleModel.js'
import { register } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import cloudinary from '../config/Cloudinary.js'
import { uploadToCloudinary } from '../config/CloundinaryUpload.js'
export const authorRoute=exp.Router()

const upload = multer({ storage: multer.memoryStorage() })

// Implement author registration (public route)
authorRoute.post('/register', upload.single('profileImageUrl'), async (req, res, next) => {
    let cloudinaryResult

    try {
        const userObj = req.body
        console.log(req.body)
        if (req.file) {
            try {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer)
            } catch (uploadErr) {
                console.warn('Cloudinary upload failed, skipping profile image:', uploadErr.message)
                // Continue without profile image if upload fails
            }
        }

        const newUserObj = await register({
            ...userObj,
            role: 'author',
            profileImageUrl: cloudinaryResult?.secure_url,
        })

        res.status(201).json({ message: 'Author registered', user: newUserObj })
    } catch (err) {
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id)
        }
        next(err)
    }
});

// Implement create article (protected route)
authorRoute.post('/articles', verifyToken('author'), async (req, res, next) => {
    //get article from req
    const articleObj = req.body
    const authorId = req.user?.userId
    if (!authorId || authorId === 'undefined' || !isValidObjectId(authorId)) {
        return res.status(401).json({ message: 'Invalid author session. Please login again.' })
    }
    //create article document with author id
    const articleWithAuthor = { ...articleObj, author: authorId }
    //save
    const created = await ArticleTypeModel.create(articleWithAuthor);
    //send res
    res.status(201).json({ message: 'Article created', payload: created });
});

// Implement read articles by author (protected route)
authorRoute.get("/articles/:authorId", verifyToken('author'), async (req, res, next) => {
    //get author id
    let authorId = req.params.authorId
    if (authorId !== req.user.userId) {
        return res.status(403).json({ message: 'Forbidden. You can access only your own articles' })
    }
    const includeInactive = req.query.includeInactive === 'true'
    const query = includeInactive
        ? { author: authorId }
        : { author: authorId, isArticleActive: true }
    //read articles by this author
    let articles = await ArticleTypeModel.find(query).sort({ createdAt: -1 })
    //send res
    res.status(200).json({ message: 'Articles by author', payload: articles })
});

//Edit article by author (protected route)
authorRoute.put("/articles", verifyToken('author'), async (req, res, next) => {
    //get modified article from req
    //find article
    //update the article
    //send res(updated article)
    const { articleId, title, category, content } = req.body
    if (!articleId) {
        return res.status(400).json({ message: 'Article ID is required' })
    }
    const articleOfDB = await ArticleTypeModel.findById(articleId)
    if (!articleOfDB) {
        return res.status(404).json({ message: 'Article not found' })
    }
    if (articleOfDB.author?.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to edit this article' })
    }

    if (title !== undefined) {
        articleOfDB.title = title
    }
    if (category !== undefined) {
        articleOfDB.category = category
    }
    if (content !== undefined) {
        articleOfDB.content = content
    }

    const updated = await articleOfDB.save()
    res.status(200).json({ message: 'Article updated', payload: updated })
});

//delete (soft delete) article (protected route)
authorRoute.patch("/articles/:articleId", verifyToken('author'), async (req, res, next) => {
    let articleId = req.params.articleId
    const articleOfDB = await ArticleTypeModel.findById(articleId)
    if (!articleOfDB) {
        return res.status(404).json({ message: 'Article not found' })
    }
    if (articleOfDB.author?.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to delete this article' })
    }
    articleOfDB.isArticleActive = false
    const updated = await articleOfDB.save()
    res.status(200).json({ message: 'Article deleted', payload: updated })
});

//restore soft deleted article (protected route)
authorRoute.patch('/articles/:articleId/restore', verifyToken('author'), async (req, res, next) => {
    const articleId = req.params.articleId
    const articleOfDB = await ArticleTypeModel.findById(articleId)
    if (!articleOfDB) {
        return res.status(404).json({ message: 'Article not found' })
    }
    if (articleOfDB.author?.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to restore this article' })
    }
    articleOfDB.isArticleActive = true
    const updated = await articleOfDB.save()
    res.status(200).json({ message: 'Article restored', payload: updated })
})
