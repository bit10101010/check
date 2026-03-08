function createRecoveryTicket(username) {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return {
    ticketId: `TICKET-${Date.now().toString(36).toUpperCase()}`,
    recoveryCode: `${username.slice(0, 3).toUpperCase()}-${token}`,
    status: 'Pending Discord verification',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  try {
    const { username = '', discordTag = '' } = JSON.parse(event.body || '{}');

    if (!username || !discordTag) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          success: false,
          message: 'Username and Discord tag are required.',
        }),
      };
    }

    if (!discordTag.includes('#')) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          success: false,
          message: 'Discord tag must look like name#1234.',
        }),
      };
    }

    const ticket = createRecoveryTicket(username);

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ success: true, ...ticket }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ success: false, message: 'Invalid request body.' }),
    };
  }
};
