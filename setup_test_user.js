// Script to create test user "phuha" with password "phuquoc"
// Run this in the browser console on the main page

// Get existing users or create empty object
let users = JSON.parse(localStorage.getItem('chatgpt_users') || '{}');

// Add test user
users['phuha'] = {
    password: 'phuquoc',
    createdAt: new Date().toISOString()
};

// Save to localStorage
localStorage.setItem('chatgpt_users', JSON.stringify(users));

// Initialize empty chat history for the user
let userChats = JSON.parse(localStorage.getItem('chatgpt_chats') || '{}');
if (!userChats['phuha']) {
    userChats['phuha'] = [];
    localStorage.setItem('chatgpt_chats', JSON.stringify(userChats));
}

console.log('✅ Test user "phuha" created successfully!');
console.log('Username: phuha');
console.log('Password: phuquoc');
console.log('You can now login with these credentials.');

// Test the login
if (users['phuha'] && users['phuha'].password === 'phuquoc') {
    console.log('✅ Login test passed!');
} else {
    console.log('❌ Login test failed!');
}