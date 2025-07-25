const axios = require('axios');

class AIService {
    constructor() {
        this.anthropicKey = process.env.ANTHROPIC_API_KEY;
        console.log('API Key loaded:', this.anthropicKey ? 'Yes' : 'No');
        console.log('Key starts with:', this.anthropicKey?.substring(0, 10));
    }

async analyzeContent(content) {
    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 1000,
                system: "You are a JSON-only API. Always respond with valid JSON in the exact format requested. Never include explanations, apologies, or markdown formatting.",
                messages: [{
                    role: 'user',
                    content: `Create memory palace data for this content. Use different object types (cube, sphere, cylinder, cone) for variety. Return only this JSON structure:
{
  "concepts": ["concept1", "concept2"],
  "memoryObjects": [
    {
      "concept": "concept1",
      "object": "cube",
      "color": "red", 
      "position": [0, 1, -3],
      "description": "brief description"
    },
    {
      "concept": "concept2", 
      "object": "sphere",
      "color": "blue",
      "position": [3, 1, -3],
      "description": "brief description"
    }
  ]
}

Available object types: cube, sphere, cylinder, cone
Available colors: red, blue, green, yellow, purple, orange, pink, cyan

Content: "${content}"`
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.anthropicKey,
                    'anthropic-version': '2023-06-01'
                }
            }
        );

        const responseText = response.data.content[0].text.trim();
        return JSON.parse(responseText);
        
    } catch (error) {
        console.error('AI failed:', error.message);
        return this.generateMockResponse(content);
    }
}
}

module.exports = new AIService();