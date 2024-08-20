// Importing a parent class
import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  // Storing the error message which will be displayed in the renderError
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  // Storing a "success message" placeholder
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
