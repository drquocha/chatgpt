// Quick setup script to create the test user
// Run this in the browser console after opening the app

function setupTestUser() {
    // Clear any existing data
    localStorage.clear();

    // Create test user
    const users = {
        'phuha': {
            password: 'phuquoc',
            createdAt: new Date().toISOString()
        }
    };

    // Save to localStorage
    localStorage.setItem('chatgpt_users', JSON.stringify(users));

    // Initialize empty chat history
    const userChats = {
        'phuha': []
    };
    localStorage.setItem('chatgpt_chats', JSON.stringify(userChats));

    console.log('✅ Test user created successfully!');
    console.log('Username: phuha');
    console.log('Password: phuquoc');
    console.log('You can now login with these credentials.');
    console.log('Refresh the page to see the login form.');
}

// Run setup
setupTestUser();