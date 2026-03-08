const loginForm = document.getElementById('login-form');
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
      sessionStorage.setItem(
        'auth',
        JSON.stringify({
          username: data.username,
          loginAt: new Date().toISOString(),
        }),
      );
      window.location.href = '/admin.html';
      return;
    }

    errorMsg.textContent = data.message || 'Login failed.';
  } catch (error) {
    errorMsg.textContent = 'Server error. Please try again.';
  }
});
