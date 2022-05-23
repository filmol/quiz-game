/**
 * A GET requests to opentdb API endpoint
 * @returns Parsed API call response OR null if failed
 */
export async function fetchQuestions() {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`
  );

  // Handle opentdb API response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occured please try again`);
  }
  try {
    const data: any = await response.json();
    console.log(data.results);
    return data.results;
  } catch (err) {
    console.error(response.statusText);
    console.log('API fetch for opentdb API failed with: ' + err);
    return null;
  }
}
