const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // This loads the key from your secret .env file

const app = express();
app.use(express.json());
app.use(cors()); // This allows your index.html to talk to this server

// Your API Key is now safely stored in an environment variable
const API_KEY = process.env.GEMINI_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

app.post('/api/translate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // The server makes the request to Google, keeping the key hidden from the user
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        res.json(response.data);
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ error: 'Failed to connect to Gemini API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
