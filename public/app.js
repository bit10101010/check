const loginForm = document.getElementById('login-form');
const loginCard = document.getElementById('login-card');
const adminPanel = document.getElementById('admin-panel');
const adminUsername = document.getElementById('admin-username');
const adminPassword = document.getElementById('admin-password');
const errorMsg = document.getElementById('error-msg');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      adminUsername.textContent = data.username;
      adminPassword.textContent = data.password;
      errorMsg.textContent = '';
      loginCard.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      return;
    }

    errorMsg.textContent = data.message || 'Login failed.';
  } catch (error) {
    errorMsg.textContent = 'Server error. Please try again.';
  }
});
