import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import responseFormatter from './src/shared/middlewares/response.middleware.js';
import * as authMiddleware from './src/shared/middlewares/auth.middleware.js';
import authRoutes from './src/user/routes/auth.routes.js';
import userRoutes from './src/user/routes/user.routes.js';
import aoRoutes from './src/activity/routes/activity_outline.routes.js';
import activityRoutes from './src/activity/routes/activity.routes.js';
import s3Routes from './src/media/routes/s3.routes.js';
import queRoutes from './src/activity/routes/question.routes.js';
import transcriptRoutes from './src/transcript/routes/transcript.routes.js';
import performanceRoutes from './src/activity/routes/performance.routes.js';
import adminUserRoutes from './src/user/routes/user.admin.routes.js';
import adminActivityOutlineRoutes from './src/activity/routes/activity_outline.admin.routes.js';
import adminActivityRoutes from './src/activity/routes/activity.admin.routes.js';
import adminQuestionRoutes from './src/activity/routes/question.admin.routes.js';
import adminQuestionBankRoutes from './src/activity/routes/question_bank.admin.routes.js';
import adminTranscriptRoutes from './src/transcript/routes/transcript.admin.routes.js';

dotenv.config();

const corsOptions = {
    origin: ['http://localhost:5173', "https://orateme.netlify.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

// constants
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors(corsOptions));

// middlewares
app.use(express.json());
app.use(responseFormatter);
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

// admin routes
app.use("/api/v1/admin/user", authMiddleware.restrictTo(["admin"]), adminUserRoutes);
app.use("/api/v1/admin/ao", authMiddleware.restrictTo(["admin"]), adminActivityOutlineRoutes);
app.use("/api/v1/admin/activity", authMiddleware.restrictTo(["admin"]), adminActivityRoutes);
app.use("/api/v1/admin/ques", authMiddleware.restrictTo(["admin"]), adminQuestionRoutes);
app.use("/api/v1/admin/ques_bank", authMiddleware.restrictTo(["admin"]), adminQuestionBankRoutes);
app.use("/api/v1/admin/transcript", authMiddleware.restrictTo(["admin"]), adminTranscriptRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });