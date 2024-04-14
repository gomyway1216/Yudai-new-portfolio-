export const getResponse = async (body) => {
  try {
    const response = await fetch(process.env.REACT_APP_TASK_URL, {
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