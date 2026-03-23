# 🚀 AI Code Lab v3.0 - Full-Stack Translator & Debugger

A professional web-based tool designed to translate code between multiple programming languages (C++, Java, Python, JavaScript) while providing real-time debugging reports and predicted console outputs.

## 🌟 Key Features
* **Secure Backend:** Uses Node.js and Express to hide the Google Gemini API key from the frontend.
* **AI-Powered Logic:** Interfaces with the Gemini 2.5 Flash model for high-speed code analysis.
* **Clean Output:** Automatically strips AI markdown and comments for a ready-to-use code experience.
* **Professional UI:** Features a modern "Dark Mode" aesthetic with a responsive CSS grid layout.
* **Error Handling:** Robust system to detect and report connection failures or API issues.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **API:** Google Gemini AI (via Axios)
* **Security:** Dotenv for environment variable management and CORS for secure cross-origin requests.

## ⚙️ Setup & Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/translator.git](https://github.com/your-username/translator.git)
    cd translator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    * Create a `.env` file in the root directory.
    * Add your Gemini API key: `GEMINI_KEY=your_actual_key_here`

4.  **Start the server:**
    ```bash
    node server.js
    ```

5.  **Open the App:**
    Launch `index.html` in your browser.

---
*Developed as part of the BSc IT curriculum - 2026*
