import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'procureai_secret_jwt_key_2026',
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

// Runtime dynamic credential cache (can be updated via Settings page API)
export const runtimeConfig = {
  mongoUri: config.mongoUri,
  geminiApiKey: config.geminiApiKey,
  isMongoConnected: false,
  isGeminiConfigured: !!config.geminiApiKey,
};

export const updateRuntimeConfig = (updates: { mongoUri?: string; geminiApiKey?: string }) => {
  if (updates.mongoUri !== undefined) {
    runtimeConfig.mongoUri = updates.mongoUri;
  }
  if (updates.geminiApiKey !== undefined) {
    runtimeConfig.geminiApiKey = updates.geminiApiKey;
    runtimeConfig.isGeminiConfigured = Boolean(updates.geminiApiKey && updates.geminiApiKey.trim().length > 0);
  }
};
