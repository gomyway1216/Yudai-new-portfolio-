export const apiCall = async (url, params) => {
  const urlObject = new URL(url);
  urlObject.search = new URLSearchParams(params).toString();
  try {
    const response = await fetch(urlObject);
    const text = await response.text(); // Get the response as text
    if (text) {
      const data = JSON.parse(text); // Parse the text as JSON if it's not empty
      return data;
    } else {
      console.log('No data in response');
      return null; // Return null if the response is empty
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};