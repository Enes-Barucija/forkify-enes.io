// Importing a parent class
import View from "./View.js";

// Importing icons for the UI. This is from the point of view of the recipeView.js file. So, the icons are essentially 2 folders lower, so we use ../..
import icons from "url:../../img/icons.svg";
// Importing a library to handle fractions (to turn for example 0.5 to 1/2)
// import { Fraction } from "fractional";

// Extending the child class to the parent class View
class RecipeView extends View {
  // The parent element where the recipe will be rendered
  _parentElement = document.querySelector(".recipe");

  // Storing the error message which will be displayed in the renderError
  _errorMessage = "We could not find that recipe. Please try another one!";
  // Storing a "success message" placeholder
  _message = "";

  // Publisher - code that wants to know when to react. It is a public API method - receives a handler (the function controlRecipes) which will be called as soon as any of these events happen.
  addHandlerRender(handler) {
    // Add event listeners to handle URL hash changes and page load events. Since both events use the same function, we can simply store them in an Array and use forEach and set the controlRecipes function argument for both.
    ["hashchange", "load"].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      // selecting the buttons for updating servings
      const btn = e.target.closest(".btn--update-servings");
      // adding a guard clause so we return early if no button was clicked (e.g. the icon could be clicked and produce an error)
      if (!btn) return;
      // storing the event to a variable so we can pass it on to the handler/ "subscriber". Also, destructuring the object immediately. Then, it returns a string
      const { updateTo } = btn.dataset;
      // Adding + so the value gets converted to a number preventing the value from going below 1, only then, do we pass it on to the handler
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;
      handler();
    });
  }

  // Method to generate HTML markup for the recipe
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? "-fill" : ""
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out directions at their website.
      </p>
      <a class="btn--small recipe__btn" href="${
        this._data.sourceUrl
      }" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    `;
  }

  // Method to generate HTML markup for a single ingredient. Each ingredient will have a list element markup which will be filled with the specific ingredients. Also, there is a turnary operator to return either a fraction (e.g. 1/2 instead of 0.5) or if there is no quantity, to return an empty string (instead of null)
  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? ing.quantity: ""
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    `;
  }
}

// Export an instance of the RecipeView class
export default new RecipeView();
