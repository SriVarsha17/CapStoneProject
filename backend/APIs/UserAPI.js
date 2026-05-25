// User API routes for registration, article reading, and commenting
import exp from 'express'
import multer from 'multer'
import { ArticleTypeModel } from '../models/ArticleModel.js'
import { register } from '../services/authService.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import cloudinary from '../config/Cloudinary.js'
import { uploadToCloudinary } from '../config/CloundinaryUpload.js'

export const userRoute = exp.Router()

const upload = multer({ storage: multer.memoryStorage() })

// Implement user registration (public route)
userRoute.post('/register', upload.single('profileImageUrl'), async (req, res, next) => {
  let cloudinaryResult

  try {
    const userObj = req.body

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
      role: 'user',
      profileImageUrl: cloudinaryResult?.secure_url,
    })

    res.status(201).json({ message: 'User registered', user: newUserObj })
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id)
    }
    next(err)
  }
})

// Read all active articles (protected route)
userRoute.get('/articles', verifyToken('user', 'author', 'admin'), async (req, res, next) => {
  try {
    const articles = await ArticleTypeModel.find({ isArticleActive: true })
      .populate('author', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')
    res.status(200).json({ message: 'Articles list', payload: articles })
  } catch (err) {
    next(err)
  }
})

// Read a single active article by id (protected route)
userRoute.get('/articles/:articleId', verifyToken('user', 'author', 'admin'), async (req, res, next) => {
  try {
    const { articleId } = req.params
    const article = await ArticleTypeModel.findOne({ _id: articleId, isArticleActive: true })
      .populate('author', 'firstName lastName')
      .populate('comments.user', 'firstName lastName')

    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.status(200).json({ message: 'Article found', payload: article })
  } catch (err) {
    next(err)
  }
})

// Add a comment to an article (protected route)
userRoute.post('/articles/comments', verifyToken('user', 'author', 'admin'), async (req, res, next) => {
  try {
    const { articleId, comment, userId } = req.body

    if (!articleId) {
      return res.status(400).json({ message: 'Article ID is required' })
    }
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' })
    }
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const updated = await ArticleTypeModel.findOneAndUpdate(
      { _id: articleId, isArticleActive: true },
      { $push: { comments: { user: userId, comment } } },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ message: 'Article not found' })
    }

    res.status(200).json({ message: 'Comment added', payload: updated })
  } catch (err) {
    next(err)
  }
})
