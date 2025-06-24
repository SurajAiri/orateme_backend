# 🗣️ Orate Me - AI-Powered Speech Evaluation Platform

**Speak. Evaluate. Improve.**

Orate Me is a comprehensive digital platform designed to help users enhance their speaking skills through AI-powered evaluation and feedback. Whether you're preparing for job interviews, practicing public speaking, or improving presentation skills, Orate Me provides personalized insights to accelerate your speaking development.

## 🚀 Key Features

### Core Functionality
- **Activity Creation**: Choose from various speaking challenges including impromptu speeches, interview questions, and presentation topics
- **Video Recording**: Record responses directly through web interface or mobile app
- **Intelligent Transcription**: Convert speech to text using advanced transcription services (Deepgram integration)
- **AI Evaluation**: Get detailed performance analysis using OpenAI's language models
- **Progress Tracking**: Monitor improvement over time with comprehensive activity history

### Advanced Features
- **Multiple Evaluation Criteria**: 
  - Content Relevance
  - Organization & Structure
  - Argumentation Quality
  - Language Mechanics
  - Engagement Level
- **Enhanced Response Generation**: AI suggests improved versions of your responses
- **Mind Mapping**: Visual organization of ideas for better structure
- **Licensing System**: Flexible subscription plans with usage limits
- **Admin Dashboard**: Comprehensive management tools for administrators

## 🎯 Target Users

- **Job Seekers**: Practice interview responses and receive professional feedback
- **Students**: Improve presentation skills and public speaking confidence
- **Professionals**: Enhance communication skills for meetings and presentations
- **Language Learners**: Develop fluency and speaking confidence in English

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **File Storage**: AWS S3 compatible storage (Backblaze B2)
- **Speech Processing**: Deepgram for transcription
- **AI Evaluation**: OpenAI GPT models for performance analysis

### Key Dependencies
```json
{
  "express": "^4.21.2",
  "mongoose": "^8.9.5",
  "jsonwebtoken": "^9.0.2",
  "@deepgram/sdk": "^3.9.0",
  "@langchain/openai": "^0.4.2",
  "@aws-sdk/client-s3": "^3.731.1",
  "bcrypt": "^5.1.1",
  "joi": "^17.13.3"
}
```

## 📋 Prerequisites

- Node.js (>= 22.11.0)
- MongoDB instance
- Environment variables configured (see `.env` setup)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd orateme_backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file based on `example.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/orateme
ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRE_IN=7d
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_secret
DEEPGRAM_API_KEY=your_deepgram_key
OPENAI_API_KEY=your_openai_key
OPEN_AI_MODEL_NAME=gpt-4o-mini
TRIAL_PLAN_ID=trial_plan_id
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### User Endpoints
- `GET /api/v1/user` - Get user profile
- `PATCH /api/v1/user` - Update user profile
- `PATCH /api/v1/user/change_password` - Change password

### Activity Management
- `GET /api/v1/ao` - Get activity outlines
- `POST /api/v1/act` - Create new activity
- `GET /api/v1/act` - Get user activities
- `GET /api/v1/act/:id` - Get specific activity

### Media & Transcription
- `POST /api/v1/media/upload` - Get upload URL
- `POST /api/v1/media/complete` - Complete upload and trigger transcription
- `POST /api/v1/transcript/url` - Create transcript from audio URL

### Performance Evaluation
- `POST /api/v1/result` - Create performance evaluation
- `GET /api/v1/result/:id` - Get performance details

### License Management
- `GET /api/v1/plan` - Get available plans
- `POST /api/v1/license` - Purchase license
- `GET /api/v1/license/limit` - Check usage limits

## 🏗️ Project Structure

```
src/
├── activity/           # Activity management
│   ├── controllers/    # Request handlers
│   ├── models/         # Database schemas
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   └── validators/     # Input validation
├── evaluation/         # AI evaluation system
├── license/           # Subscription management
├── media/             # File upload handling
├── shared/            # Shared utilities
│   ├── middlewares/   # Express middlewares
│   └── services/      # Shared services
├── transcript/        # Speech-to-text processing
├── user/             # User management
└── utils/            # Utility functions
```

## 🔧 Key Components

### Activity System
- **Activity Outlines**: Template definitions for speaking challenges
- **Activities**: User instances of speaking exercises
- **Records**: Individual question-response pairs
- **Performance**: AI evaluation results

### Evaluation Pipeline
1. **Audio Upload**: Users upload video/audio recordings
2. **Transcription**: Speech converted to text using Deepgram
3. **AI Analysis**: OpenAI evaluates speech quality
4. **Feedback Generation**: Structured performance report with scores

### License Management
- **License Outlines**: Subscription plan templates
- **Licenses**: User subscriptions with usage limits
- **Activity Usage**: Tracking of user activity consumption

## 🔐 Security Features

- JWT-based authentication with role-based access control
- Input validation using Joi schemas
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests

## 📊 Admin Features

- User management and analytics
- Activity outline creation and management
- Question bank administration
- License and subscription management
- Performance monitoring and reporting

## 🚢 Deployment

### Environment Requirements
- MongoDB database
- Backblaze B2 or AWS S3 for file storage
- Deepgram API access
- OpenAI API access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ to help people speak with