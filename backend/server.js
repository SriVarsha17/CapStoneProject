// Import dependencies
import 'dotenv/config'
import exp from 'express'
import { connect } from 'mongoose'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { commonRouter } from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = exp()

// ✅ Allowed Origins (LOCAL + VERCEL)
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  'http://localhost:5173,https://cap-stone-project-three.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, '')) // remove trailing slash
  .filter(Boolean)

// Trust proxy (needed for cookies on Render)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1)
}

// ✅ CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / no-origin requests
      if (!origin) return callback(null, true)

      const cleanOrigin = origin.replace(/\/$/, '')

      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(exp.json())
app.use(cookieParser())

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Routes
app.use('/users', userRoute)
app.use('/authors', authorRoute)
app.use('/admins', adminRoute)
app.use('/common', commonRouter)

// Connect to MongoDB and start server
async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required in environment variables')
    }

    await connect(process.env.MONGO_URI)
    console.log("✅ DB connected")

    const port = Number(process.env.PORT) || 5000
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
    })
  } catch (err) {
    console.log("❌ DB connection failed", err)
  }
}

connectDB()

// Invalid route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.url} is invalid path` })
})

// Global error handling
app.use((err, req, res, next) => {
  console.log("Error name:", err.name)
  console.log("Error code:", err.code)
  console.log("Full error:", err)

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    })
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    })
  }

  if (err.name === "StrictModeError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    })
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0]
    const value = keyValue[field]
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    })
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    })
  }

  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  })
})