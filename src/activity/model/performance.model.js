import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 0, max: 10 },
  evaluation: { type: String, required: true }
});

const candidatePerformanceSchema = new mongoose.Schema({
  fluency: { type: performanceSchema, required: true },
  pronunciation: { type: performanceSchema, required: true },
  vocabulary: { type: performanceSchema, required: true },
  grammar: { type: performanceSchema, required: true },
  coherence: { type: performanceSchema, required: true }
});

const overallPerformanceSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 0, max: 10 },
  evaluation: { type: String, required: true }
});

const speechEvaluationSchema = new mongoose.Schema({
  candidate_performance: { type: candidatePerformanceSchema, required: true },
  overall_performance: { type: overallPerformanceSchema, required: true },
  strengths: { type: String, required: true },
  weaknesses: { type: String, required: true },
  suggestions: { type: String, required: true },
  improved_answer: { type: String, },
  organization_of_ideas: { type: String, },
  ai_organization_of_ideas: { type: String, },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Performance", speechEvaluationSchema);
