const cors = require('cors');
require('dotenv').config();
const express = require('express');
const responseFormatter = require('./src/shared/middlewares/response.middleware');
const authMiddleware = require('./src/shared/middlewares/auth.middleware');
const { default: mongoose } = require('mongoose');
const authRoutes = require('./src/user/routes/auth.routes');
const userRoutes = require('./src/user/routes/user.routes');
const aoRoutes = require('./src/activity/routes/activity_outline.routes')
const activityRoutes = require('./src/activity/routes/activity.routes');
const s3Routes = require('./src/media/routes/s3.routes');
const queRoutes = require('./src/activity/routes/question.routes')
const transcriptRoutes = require('./src/transcript/routes/transcript.routes')

const adminUserRoutes = require('./src/user/routes/user.admin.routes');
const adminActivityOutlineRoutes = require('./src/activity/routes/activity_outline.admin.routes');
const adminActivityRoutes = require('./src/activity/routes/activity.admin.routes');
const adminQuestionRoutes = require("./src/activity/routes/question.admin.routes")
const adminQuestionBankRoutes = require('./src/activity/routes/question_bank.admin.routes')
const adminTranscriptRoutes = require('./src/transcript/routes/transcript.admin.routes')




// enable CORS for localhost
const corsOptions = {
    origin: ['http://localhost:5173'],
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

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", authMiddleware.restrictTo(), userRoutes);
app.use("/api/v1/ao",authMiddleware.restrictTo(),aoRoutes)
app.use("/api/v1/activity",authMiddleware.restrictTo(), activityRoutes);
app.use("/api/v1/media",authMiddleware.restrictTo(),s3Routes);
app.use("/api/v1/ques",authMiddleware.restrictTo(),queRoutes);
app.use("/api/v1/transcript",authMiddleware.restrictTo(),transcriptRoutes);



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
  