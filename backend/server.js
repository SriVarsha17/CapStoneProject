// Import dependencies
import 'dotenv/config'
import exp from 'express'
import {connect} from 'mongoose'
import { userRoute} from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { commonRouter } from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app=exp()

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1)
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(exp.json())

app.use(cookieParser())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Register route handlers for different user roles
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
        console.log("DB connected") 
        
        // Start HTTP server after successful DB connection
    const port = Number(process.env.PORT) || 5000
    app.listen(port,()=>{
      console.log(port,"port connected")
        })
    } catch(err){
        console.log("DB connection failed", err)
    }
}

connectDB()

//dealing with invalid path
app.use((req,res,next)=> {
  res.status(404).json({message: `${req.url} is invalid path`});
});

// Global error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // strict mode unknown field error
  if (err.name === "StrictModeError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});