// Importing icons for the UI. This is from the point of view of this file. So, the icons are essentially 2 folders lower, so we use ../..
import icons from "url:../../img/icons.svg";

export default class View {
  // Data to be used in the view
  _data;
  // Method to render the recipe data in the UI. Part of the public API. Receives data from the model state object through the controller.
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // Assign the data to the class property
    this._data = data;
    // Generate the HTML markup
    const markup = this._generateMarkup();

    if (!render) return markup;
    // Clear the parent element
    this._clear();
    // Insert the markup into the DOM
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Method to clear the parent element
  _clear() {
    this._parentElement.innerHTML = "";
  }

  // Method to render a loading spinner in the UI
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    // Clear the parent element
    this._clear();
    // Insert the spinner markup
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  // Creating a method which will display the error message. A message argument can be passed in and if there is none, a default will be displayed instead contained in the this._errorMessage
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
       </div>
      <p>${message}</p>
    </div>
          `;
    // Clear the parent element
    this._clear();
    // Insert the spinner markup
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Creating a method which will display the "success" message. A message argument can be passed in and if there is none, a default will be displayed instead contained in the this._errorMessage
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
       </div>
      <p>${message}</p>
    </div>
          `;
    // Clear the parent element
    this._clear();
    // Insert the spinner markup
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
