# Private ChatGPT Web App

A web application that allows users to create accounts and chat with ChatGPT using your OpenAI API key. Each user has their own chat history that is stored locally and completely separate from others.

## Features

- User registration and login system
- Individual chat histories for each user
- Clean, responsive interface
- Express.js server to handle CORS issues
- Local storage for user data

## Setup Instructions

### Option 1: Run Locally (Recommended)

1. **Get Your OpenAI API Key**
   - Go to [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Configure the App**
   - Open `config.js`
   - Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Server**
   ```bash
   npm start
   ```

5. **Open in Browser**
   - Go to `http://localhost:3000`
   - Your sister can access it at `http://your-ip-address:3000` on the same network

### Option 2: Deploy to a Server

1. Deploy to platforms like:
   - Railway.app (free)
   - Render.com (free)
   - Heroku
   - Your own VPS

2. Set your API key in the deployment environment

## Security Notes

- **Important**: Never commit your actual API key to GitHub
- Consider using environment variables or a secure configuration method for production
- The current setup stores user data locally in the browser
- Each user's chat history is completely separate and private

## Usage

1. Users can sign up with a username and password
2. Login to access their personal chat interface
3. Chat with ChatGPT - each user has their own conversation history
4. Logout to switch users or protect privacy

## File Structure

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - JavaScript functionality
- `config.js` - Configuration file for API key
- `README.md` - This file

## Customization

You can modify:
- Colors and styling in `style.css`
- ChatGPT model and parameters in `config.js`
- System prompt in `script.js`
- UI text and layout in `index.html`

## Troubleshooting

- If chat doesn't work, check browser console for errors
- Verify API key is correctly set in `config.js`
- Ensure you have sufficient OpenAI API credits
- Check that your API key has chat completions access