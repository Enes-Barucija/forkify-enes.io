// Importing the model
import * as model from "./model.js";
// Importing the timeout seconds for closing the modal window
import { MODAL_CLOSE_SEC } from "./config.js";
// Importing the Recipe view
import recipeView from "./views/recipeView.js";
// Importing the Search view
import searchView from "./views/searchView.js";
// Importing the Results view
import resultsView from "./views/resultsView.js";
// Importing the Pagination view
import paginationView from "./views/paginationView.js";
// Importing the Bookmarks view
import bookmarksView from "./views/bookmarksView.js";
// Importing the adding recipe view
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable"; // Polyfills for supporting older browsers
import "regenerator-runtime/runtime"; // Polyfills for async/await

// Prevents the page from reloading when changes are made (coming from Parcel)
// if (module.hot) {
//   module.hot.accept();
// }

// Function to control the loading and rendering of recipes
const controlRecipes = async function () {
  try {
    // Extract the recipe ID from the URL hash
    const id = window.location.hash.slice(1);
    // console.log(id); // Log the recipe ID for debugging

    // If no ID is found, return early
    if (!id) return;

    // Render a loading spinner while fetching data
    recipeView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2. Load the recipe data from the model. Since the loadRecipe is an async function, it will return a promise. We need to await that promise.
    await model.loadRecipe(id);

    // 3. Render the recipe in the view
    recipeView.render(model.state.recipe);
  } catch (err) {
    // Alert the user if there's an error during loading
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    // resultsView.render(model.state.search.results); // old was where we displayed all the results on the same page
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination buttons
    // passing in the data which should be rendered by the paginationView. The data is being computed by the model
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. Render NEW pagination buttons
  // passing in the data which should be rendered by the paginationView. The data is being computed by the model
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // rerender the recipeView - not ideal
  // recipeView.render(model.state.recipe);
  // Update the recipeView by selecting and updating only the elements which have changed
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Adding a handler function for adding new recipes
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // Render the recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL with the history API and by using the .pushState method without reloading the page - this method takes three arguments - state (not required for our example - null), then the title and finally the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // Close the form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// Subscriber - code that wants to react. Passes the function as callback to the method on the Publisher (addHandlerRender) which listens to events.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  // adds a "subscriber" to the recipeView
  recipeView.addHandlerRender(controlRecipes);
  // add a "subscriber" to the recipeView (update servings)
  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // adds a "subscriber" to the searchView
  searchView.addHandlerSearch(controlSearchResults);
  // add a "subscriber" to the paginationView
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
