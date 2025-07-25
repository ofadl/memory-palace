require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiService = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// AI Analysis endpoint
app.post('/api/analyze-content', async (req, res) => {
    try {
        const { content } = req.body;
        const analysis = await aiService.analyzeContent(content);
        console.log('Analysis result:', analysis);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});