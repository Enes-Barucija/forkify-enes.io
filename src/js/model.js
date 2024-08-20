// Importing the named import with the actual name. We need to use curly braces with the name {API_URL}
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";

import { AJAX } from "./helpers.js";

// The empty "state" object is exported which will receive the data from the function "loadRecipe" below
export const state = {
  // Object to store the recipe data
  recipe: {},
  // search object with placeholder query and result parameters which the loadSearchResults function will pass in.
  search: {
    query: "",
    results: [],
    // Setting the page default to 1
    page: 1,
    // to avoid hard-coding values in the getSearchResultsPage, we determine it here and pass it on dynamically. To avoic "magic numbers", we get the value from the config file
    resultsPerPage: RES_PER_PAGE,
  },
  // Adding an empty array for Bookmarks
  bookmarks: [],
};

// refactoring the data we receive into an object we can reuse
const createRecipeObject = function (data) {
  // Destructure (unpack) the recipe data from the API response since "recipe" is an object of the "data:" key. Without destructuring, we would need to write the value as data.data.recipe
  const { recipe } = data.data;
  // reformat the data retrived from the API into a new object from which we can pass the data to various points in our code (e.g. when rendering the recipe)
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // the AND operator short-circuits, if we get a falsy value (no key), nothing happens. If we do have a key, it will return an object. The spread operator ... will spread the object which will give us a simple key:value pair
    ...(recipe.key && { key: recipe.key }),
  };
};

// Function to load recipe data from the API
export const loadRecipe = async function (id) {
  // Error handling try/catch block
  try {
    // Fetch recipe data from the API using the recipe ID with an async function. Use the named import API_URL since it contains the URL. and since no parameter, ? add the KEY
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Store the recipe data in the state object
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 🤦‍♀️🤦‍♂️`);
    // Alert the user if there's an error fetching the data
    // alert(err);
    // re-throwing the error so it will get to the controller
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // Storing the search query in a variable (e.g. "pizza")
    state.search.query = query;
    // We use the getJSON helper function we created. The URL is the search function of the API. & and the KEY
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    // We get the data from the object parsed with JSON and we can map over it to create a new array of objects containing the parameters from the result of the query (id, image_url, publisher, title). The data will be stored in a variable to be passed on.

    state.search.results = data.data.recipes.map(rec => {
      // we return an array of objects with id, title, publisher and image
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // reset the page to 1 after searching for a new recipe
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🤦‍♀️🤦‍♂️`);
    throw err;
  }
};
// This will not be an async function because at this stage we will have the data already. Reach into the state and get the data requested. Returning a part of the results.
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // If we request the first page, (1 - 1) * 10 = 0 - how we get our starting value. For the second page (2 - 1) = 1 * 10 = 10 - start at 10.
  const start = (page - 1) * state.search.resultsPerPage; //0;
  // Then we multiply the page - first page 1 * 10 = 10 - slice then ignores the last digit and we get from 0 to 9. For the second page 2 * 10 = 20 - again, the slice will ignore the last so, index 10 - 19.
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // Formula for calculating the new quantity of servings // new quantity = old quantity * new servings / old servings // 2 * 8 / 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Create a local function to store any bookmarks as JSON strings in local storage. The function will be called whenever the user saves or deletes a bookmark
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add/push the recipe to the empty bookmark array
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark the current recipe as NOT bookmarked
  // Mark the current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// Create a local function to initialize as soon as the program starts. This will read get the bookmarks from local storage and store it in the "storage" variable. Then, only if there are any items in the storage, store the data in state.bookmarks by parsing the data with JSON
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

// creating a development helper for clearing local storage
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// By default, this should be disabled
// clearBookmarks();

// Create an async function which will take the new Recipe generated from the addRecipeView and convert it so it can be used to upload to the API.
export const uploadRecipe = async function (newRecipe) {
  // error handling try/catch
  try {
    // We want to create an array of ingredients using the map method. To get arrays we need to convert the object that we get using Object.entries - this will return arrays with the first element (index 0) as the ingredient string and the second (index 1) as the actual ingredient details (e.g. 0.5,kg,Rice)
    const ingredients = Object.entries(newRecipe)
      // We filter each entry of the arrays to for the first element which needs to contain "ingredient" and the second element which cannot be an empty string
      .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
      // finally, we call map on these ingredients
      .map(ing => {
        // ingredient details where there are spaces will be replaced by an empty string and the rest will be split by the coma
        // const ingArr = ing[1].replaceAll(" ", "").split(",");
        // To fix a bug, we have to opt for trim instead of replaceAll
        const ingArr = ing[1].split(",").map(el => el.trim());
        // condition to warn the user if they do not enter the correct format
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        // destructure the arrays by quantity, unit and description
        const [quantity, unit, description] = ingArr;
        // returning an object which will have the key value pairs. Also, using a turnary operator, we can check if a quantity, which we convert into a number exists, if not, set the value to null
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Using the sendJSON function with the URL and our unique KEY. Since we will get a response from the server, we also want to store it into a variable data and await it.

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); // sendJSON has two parameters, URL and data - the data that we are sending is the recipe defined in the recipe object
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    // add the new recipe to the bookmark local storage with the addBookmark function
    // re-throw the error so the controller can pass it on so it can be rendered
    throw err;
  }
};
