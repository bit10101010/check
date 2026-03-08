const recoveryForm = document.getElementById('recovery-form');
const errorMsg = document.getElementById('error-msg');
const resultPanel = document.getElementById('result-panel');
const recoveryCommand = document.getElementById('recovery-command');
const ticketId = document.getElementById('ticket-id');
const ticketStatus = document.getElementById('ticket-status');

recoveryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  errorMsg.textContent = '';
  resultPanel.classList.add('hidden');

  const username = document.getElementById('username').value.trim();
  const discordTag = document.getElementById('discordTag').value.trim();

  try {
    const response = await fetch('/api/recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, discordTag }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      errorMsg.textContent = data.message || 'Unable to start recovery.';
      return;
    }

    recoveryCommand.textContent = `/recover ${data.recoveryCode}`;
    ticketId.textContent = data.ticketId;
    ticketStatus.textContent = data.status;
    resultPanel.classList.remove('hidden');
  } catch (error) {
    errorMsg.textContent = 'Server error. Please try again.';
  }
});
