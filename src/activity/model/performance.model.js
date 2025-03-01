import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 0, max: 100 },
  evaluation: { type: String, required: true },
  _id: false
});

const overallPerformanceSchema = new mongoose.Schema({
  score: { type: Number, required: true, min: 0, max: 100 },
  evaluation: { type: String },
  _id: false
});

const speechEvaluationSchema = new mongoose.Schema({
  // Direct Map of performances
  candidate_performance: {
    type: Map,
    of: performanceSchema,
    required: true
  },
  
  overall_performance: {
    type: overallPerformanceSchema,
    required: true
  },
  
  // AI feedback as dynamic object
  evaluation_summary: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  enhanced_response: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Performance", speechEvaluationSchema);