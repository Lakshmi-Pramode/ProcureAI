import { runtimeConfig, updateRuntimeConfig } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.service.js';
export const getStatus = (_req, res) => {
    res.json({
        success: true,
        data: {
            isMongoConnected: runtimeConfig.isMongoConnected,
            isGeminiConfigured: runtimeConfig.isGeminiConfigured,
            activeDatabase: runtimeConfig.isMongoConnected ? 'MongoDB (Live Cluster)' : 'Dual-Mode In-Memory Store (Pre-seeded)',
            activeAIEngine: runtimeConfig.isGeminiConfigured ? 'Google Gemini 1.5 Flash (Live API)' : 'ProcureAI Heuristic NLP Engine v2.4 (Offline/Test Mode)',
            geminiKeyPreview: runtimeConfig.geminiApiKey ? `...${runtimeConfig.geminiApiKey.slice(-6)}` : 'Not configured',
            mongoUriPreview: runtimeConfig.mongoUri ? `${runtimeConfig.mongoUri.split('@')[1] || 'Configured'}` : 'Not configured'
        }
    });
};
export const updateConfig = async (req, res) => {
    try {
        const { mongoUri, geminiApiKey } = req.body;
        const updates = {};
        if (mongoUri !== undefined)
            updates.mongoUri = mongoUri;
        if (geminiApiKey !== undefined)
            updates.geminiApiKey = geminiApiKey;
        updateRuntimeConfig(updates);
        let mongoConnected = runtimeConfig.isMongoConnected;
        if (mongoUri !== undefined && mongoUri.trim() !== '') {
            await disconnectDB();
            mongoConnected = await connectDB();
            if (mongoConnected) {
                await memoryStore.syncToMongoDB();
            }
        }
        memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action: 'config_updated',
            details: `Updated system configuration: MongoDB (${mongoConnected ? 'Connected' : 'Pending'}), Gemini AI (${runtimeConfig.isGeminiConfigured ? 'Active' : 'Unset'})`
        });
        res.json({
            success: true,
            message: 'Configuration updated successfully',
            data: {
                isMongoConnected: runtimeConfig.isMongoConnected,
                isGeminiConfigured: runtimeConfig.isGeminiConfigured,
                activeDatabase: runtimeConfig.isMongoConnected ? 'MongoDB (Live Cluster)' : 'Dual-Mode In-Memory Store (Pre-seeded)',
                activeAIEngine: runtimeConfig.isGeminiConfigured ? 'Google Gemini 1.5 Flash (Live API)' : 'ProcureAI Heuristic NLP Engine v2.4'
            }
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
