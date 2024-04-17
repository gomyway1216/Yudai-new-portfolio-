export const apiCall = async (url, params) => {
  console.log('url:', url);
  const urlObject = new URL(url);
  urlObject.search = new URLSearchParams(params).toString();
  try {
    const response = await fetch(urlObject);
    const text = await response.text(); // Get the response as text
    console.log('text:', text);
    if (text) {
      const data = JSON.parse(text); // Parse the text as JSON if it's not empty
      console.log('data:', data);
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