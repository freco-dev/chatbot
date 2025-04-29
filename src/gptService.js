const axios = require('axios');

class GPTService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = "https://openrouter.ai/api/v1";
    }

    async sendMessage(userMessage) {
        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: "openai/gpt-3.5-turbo",
                    messages: [{ role: "user", content: userMessage }],
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data.choices[0].message?.content || "No response";
        } catch (error) {
            console.error("Error communicating with OpenRouter:", error.response?.data || error.message);
            throw new Error("Failed to get response from OpenRouter");
        }
    }
}

module.exports = GPTService;