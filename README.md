# AnythingLLM for VS Code

This extension integrates a locally installed [AnythingLLM](https://anythingllm.com/desktop) instance with Visual Studio Code. It offers a lightweight and secure alternative to cloud-based assistants like GitHub Copilot.

The benifit of using this is to save $$ on a chat-bot like ChatGPT's paid version, as well as GitHub Copilot subscription fees and pay as-you-go.

---

## ⚙️ Prerequisites

To use this extension, you must:

1. [Install AnythingLLM](https://anythingllm.com/desktop) and run it locally.
2. Set up an LLM provider inside AnythingLLM (e.g., OpenAI GPT-4o).
3. Generate your personal AnythingLLM API key.
4. Note the local API URL (default: `http://localhost:3001/api`).
5. Install this extension in VS Code.

---

## 🔧 Configuration

After installation, go to:

**Settings > Extensions > Chat UI**

Set the following fields:
- **API Base URL**: (e.g. `http://localhost:3001/api`)
- **API Key**: Paste your AnythingLLM API token

---

## 💬 Usage

1. Press `Cmd+Shift+P` or `Ctrl+Shift+P`
2. Search for: `Open AnythingLLM Chat Viewer`
3. View your workspaces, threads, and chat history in a secure webview

---

## 🔐 Security & Privacy

- Your API key is **stored locally** and **never sent externally**
- No cloud backend — communication stays between VS Code and your local AnythingLLM instance

---

## 🧠 Features

- Visualize all local workspaces and threads from AnythingLLM
- View and scroll chat history with proper formatting and syntax highlighting
- Responsive and clean user interface
- Supports dark/light themes

---

## 📦 Requirements

- AnythingLLM must be installed and running locally
- A valid API key configured with a working LLM provider in AnythingLLM

---

## 🧪 Development

For contributors:

1. Clone the repo
2. Run `npm install`
3. Launch VS Code Extension host with F5
4. Make sure AnythingLLM is running locally on `http://localhost:3001/api`
5. Test with a valid API key from your AnythingLLM dashboard

---

## 📜 License

This project is distributed under a **private license** and is not intended for commercial redistribution or resale.

---

## 👤 Developer

Developed by **Mehrdad Alemzadeh**  
📧 zade.mehrdad@gmail.com

---