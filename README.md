# SigmaGPT 🚀

A premium, modern MERN-stack ChatGPT replica featuring an elegant UI design system, in-memory MongoDB database support, and customizable chat features.

---

## ✨ Features

### 🎨 Visual & UI Polish
* **Dynamic Themes**: Toggle between 4 gorgeous theme styles from Settings:
  * **Sleek Dark**: Default professional, high-contrast dark theme.
  * **Cyberpunk**: Neon pink/purple glow aesthetic.
  * **Glassmorphism**: Elegant translucent windows over rich backdrops.
  * **Emerald Forest**: Sophisticated nature-inspired forest green mode.
* **Modern Typography**: Integrated high-quality Google Fonts (*Outfit* and *Plus Jakarta Sans*).
* **Smooth Transitions & Animations**: CSS animations for messaging bubbles, slide-in sidebar elements, and hover micro-interactions.
* **Pulsing Loader Glow**: Custom typing indicator with smooth pulsing animations matching the active theme.
* **Responsive Mobile Layout**: Fully supports mobile screens with a floating sidebar and navbar hamburger toggles.

### ⚙️ Extended Functionality
* **AI Personas**: Adapt the assistant's behavior on the fly using the Navbar selector:
  * 🤖 **Assistant**: Default general assistant.
  * 💻 **Code Wizard**: Expert software engineer generating clean, documented code.
  * ✍️ **Creative Writer**: Expressive storyteller using rich, literary language.
  * 🤪 **Sarcastic Buddy**: Witty, humorous, and playful chatbot friend.
  * ⚙️ **Custom Bot**: Guided by custom system instructions defined in Settings.
* **Text-to-Speech (TTS)**: Dynamic play/stop audio feedback speaker button next to assistant messages using standard Web Speech API.
* **Interactive Code Themes**: Toggle code syntax highlighting theme styles (GitHub Dark, Monokai Classic, or Cyberpunk Neon) from Settings.
* **Inline Rename Chat**: Double-click or click the edit icon on conversation items in the sidebar to rename them instantly.
* **Usage Analytics Dashboard**: Displays real-time message frequencies, total chats, and theme status inside Settings.
* **Clear All Conversations**: Truncate all stored message threads in the MongoDB database at once via a Danger Zone button.
* **Keyboard Shortcuts Helper**: Visual cheat-sheet for fast navigation:
  * `Ctrl + ,` : Toggle Settings modal
  * `Esc` : Close active modals
  * `Enter` / `Shift+Enter` : Submit message / Add new line
* **Chat Search**: Real-time search filter for your conversation history titles in the sidebar.
* **Export Chat**: Download any active chat thread directly as a Markdown (`.md`) file.
* **One-Click Message Copying**: Copy entire chat responses or individual code blocks with built-in copy buttons.
* **Profile Settings**: Personalize your display name and choose customized avatar background colors.

---

## 🛠️ Installation & Setup

### 📦 Backend Setup
1. Open the `/Backend` directory.
2. Install the node modules:
   ```bash
   npm install
   ```
3. *(Optional)* Setup your API key by creating a `.env` file in the `/Backend` directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   *Note: If no API key is supplied, the server runs in **mock mode** showing custom simulated responses for testing.*
   *Note: If no MONGODB_URI is supplied, the server automatically starts an in-memory database using `mongodb-memory-server`.*
4. Start the backend:
   ```bash
   node server.js
   ```

### 💻 Frontend Setup
1. Open the `/Frontend` directory.
2. Install the node modules:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at [http://localhost:5173/](http://localhost:5173/).
