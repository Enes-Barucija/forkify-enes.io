import { TIMEOUT_SEC } from "./config.js";

// Function to create a timeout promise, used for handling long API requests
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// refactoring the get and send JSON functions. Setting uploadData default to undefined
export const AJAX = async function (url, uploadData = undefined) {
  // conditionally defining if fetchPro is receiving any uploadData with a turnary operator
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          // specify the method - POST
          method: "POST",
          // specify an object of headers - important to specify the Content-Type - information about the request. We tell the API that the data we are sending will be in the JSON format
          headers: {
            "Content-Type": "application/json",
          },
          // The payload/the data we will be sending
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Parse the JSON response and store it into a variable called "data"
    const data = await res.json();
    // Guard clause for if the response is not OK (if the key "ok" in the object is set to "false"), throw an error
    // Reads the actual message of the error and the status so the error is more descriptive - the error will be caught in the catch block below
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    // returns the data so it can be used when called in the model.js. The data is the resolved value of the json parsing promise.
    return data;
  } catch (err) {
    // we need to re-throw the error since the promise would otherwise be a fulfilled promise even if it fails here
    throw err;
  }
};
