import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { memoryStore } from './services/memoryStore.service.js';

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
const uploadsPath = path.resolve(process.cwd(), config.uploadDir);
app.use('/uploads', express.static(uploadsPath));

// API routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Server startup
async function startServer() {
  const isMongoConnected = await connectDB();
  if (isMongoConnected) {
    await memoryStore.syncToMongoDB();
  }

  app.listen(config.port, () => {
    console.log(`
============================================================
🚀 ProcureAI Backend API Engine Running!
📡 Port: ${config.port}
🔗 Health Check: http://localhost:${config.port}/api/health
💾 Mode: ${isMongoConnected ? 'MongoDB (Live Cluster)' : 'Dual-Mode In-Memory Store (Active & Pre-seeded)'}
🤖 AI Engine: ${config.geminiApiKey ? 'Google Gemini 1.5 Flash (Live API)' : 'ProcureAI Heuristic NLP Engine v2.4 (Offline Fallback)'}
============================================================
`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
