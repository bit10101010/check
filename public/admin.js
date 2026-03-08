const usernameNode = document.getElementById('admin-username');
const loginTimeNode = document.getElementById('login-time');
const logoutBtn = document.getElementById('logout-btn');

const authState = sessionStorage.getItem('auth');

if (!authState) {
  window.location.replace('/');
} else {
  const { username = 'Unknown user', loginAt } = JSON.parse(authState);
  usernameNode.textContent = username;
  loginTimeNode.textContent = loginAt
    ? new Date(loginAt).toLocaleString()
    : 'Unknown time';
}

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('auth');
  window.location.href = '/';
});
