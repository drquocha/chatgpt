# Private ChatGPT Web App

A simple web application that allows users to create accounts and chat with ChatGPT using your OpenAI API key. Each user has their own chat history that is stored locally and completely separate from others.

## Features

- User registration and login system
- Individual chat histories for each user
- Clean, responsive interface
- Local storage (no server required)
- Easy GitHub Pages deployment

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Configure the App

1. Open `config.js`
2. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key:
   ```javascript
   OPENAI_API_KEY: 'sk-your-actual-api-key-here',
   ```

### 3. Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your app will be available at: `https://yourusername.github.io/repository-name`

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