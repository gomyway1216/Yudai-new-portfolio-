export const getResponse = async (body) => {
  const url = 'http://127.0.0.1:5001/yudai-portfolio/us-central1/voice_chat';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: {
      },
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};