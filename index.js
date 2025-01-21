require('dotenv').config();
const express = require('express');
const responseFormatter = require('./src/shared/middlewares/response.middleware');
const authMiddleware = require('./src/shared/middlewares/auth.middleware');
const { default: mongoose } = require('mongoose');
const authRoutes = require('./src/user/routes/auth.routes');
const userRoutes = require('./src/user/routes/user.routes');
const aoRoutes = require('./src/activity/routes/activity_outline.routes')
const activityRoutes = require('./src/activity/routes/activity.routes');

const adminUserRoutes = require('./src/user/routes/user.admin.routes');
const adminActivityOutlineRoutes = require('./src/activity/routes/activity_outline.admin.routes');
const adminActivityRoutes = require('./src/activity/routes/activity.admin.routes');



// constants
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

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
app.use("/api/v1/ao",aoRoutes)
app.use("/api/v1/activity", activityRoutes);



// admin routes
app.use("/api/v1/admin/user", authMiddleware.restrictTo(["admin"]), adminUserRoutes);
app.use("/api/v1/admin/ao", authMiddleware.restrictTo(["admin"]), adminActivityOutlineRoutes);
app.use("/api/v1/admin/activity", authMiddleware.restrictTo(["admin"]), adminActivityRoutes);


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
  