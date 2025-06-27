import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit'
import responseFormatter from './src/shared/middlewares/response.middleware.js';
import * as authMiddleware from './src/shared/middlewares/auth.middleware.js';
import authRoutes from './src/user/routes/auth.routes.js';

// user routes
import userRoutes from './src/user/routes/user.routes.js';
import aoRoutes from './src/activity/routes/activity_outline.routes.js';
import activityRoutes from './src/activity/routes/activity.routes.js';
import s3Routes from './src/media/routes/s3.routes.js';
import queRoutes from './src/activity/routes/question.routes.js';
import transcriptRoutes from './src/transcript/routes/transcript.routes.js';
import performanceRoutes from './src/activity/routes/performance.routes.js';
import planRoutes from './src/license/routes/licenseOutline.routes.js';
import licenseRoutes from './src/license/routes/license.routes.js';

// admin routes
import adminUserRoutes from './src/user/routes/user.admin.routes.js';
import adminActivityOutlineRoutes from './src/activity/routes/activity_outline.admin.routes.js';
import adminActivityRoutes from './src/activity/routes/activity.admin.routes.js';
import adminQuestionRoutes from './src/activity/routes/question.admin.routes.js';
import adminQuestionBankRoutes from './src/activity/routes/question_bank.admin.routes.js';
import adminTranscriptRoutes from './src/transcript/routes/transcript.admin.routes.js';
import adminPlanRoutes from './src/license/routes/licenseOutline.admin.routes.js';
import adminLicenseRoutes from './src/license/routes/license.admin.routes.js';

dotenv.config();

// Global mongoose connection for serverless
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// MongoDB connection with proper configuration
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

const corsOptions = {
    origin: ['http://localhost:5173', 'https://orateme.netlify.app', 'https://www.orateme.com', 'https://orateme.com', 'https://web.orateme.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    optionsSuccessStatus: 200
};

// constants
const app = express();
const PORT = process.env.PORT || 3000;

// Apply middlewares
app.use(cors(corsOptions));

// Define the rate limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // Limit each IP to 30 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true,
});

app.use(limiter);
app.use(express.json());
app.use(responseFormatter);

// Database connection middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.use(authMiddleware.authorizeUser);

app.get('/', (req, res) => {
    res.sendResponse(200, { message: "Health Check for 'orateme_backend' APIs." });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", authMiddleware.restrictTo(), userRoutes);
app.use("/api/v1/ao", authMiddleware.restrictTo(), aoRoutes);
app.use("/api/v1/act", authMiddleware.restrictTo(), activityRoutes);
app.use("/api/v1/media", authMiddleware.restrictTo(), s3Routes);
app.use("/api/v1/ques", authMiddleware.restrictTo(), queRoutes);
app.use("/api/v1/transcript", authMiddleware.restrictTo(), transcriptRoutes);
app.use("/api/v1/result", authMiddleware.restrictTo(), performanceRoutes);
app.use("/api/v1/plan", authMiddleware.restrictTo(), planRoutes);
app.use("/api/v1/license", authMiddleware.restrictTo(), licenseRoutes);

// admin routes
app.use("/api/v1/admin/user", authMiddleware.restrictTo(["admin"]), adminUserRoutes);
app.use("/api/v1/admin/ao", authMiddleware.restrictTo(["admin"]), adminActivityOutlineRoutes);
app.use("/api/v1/admin/activity", authMiddleware.restrictTo(["admin"]), adminActivityRoutes);
app.use("/api/v1/admin/ques", authMiddleware.restrictTo(["admin"]), adminQuestionRoutes);
app.use("/api/v1/admin/ques_bank", authMiddleware.restrictTo(["admin"]), adminQuestionBankRoutes);
app.use("/api/v1/admin/transcript", authMiddleware.restrictTo(["admin"]), adminTranscriptRoutes);
app.use("/api/v1/admin/plan", authMiddleware.restrictTo(["admin"]), adminPlanRoutes);
app.use("/api/v1/admin/license", authMiddleware.restrictTo(["admin"]), adminLicenseRoutes);

// For Vercel, export the app instead of listening
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    });
}