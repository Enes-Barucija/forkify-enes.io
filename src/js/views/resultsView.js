// Importing a parent class
import View from "./View.js";
import previewView from "./previewView.js";

// Importing icons for the UI. This is from the point of view of this file. So, the icons are essentially 2 folders lower, so we use ../..
import icons from "url:../../img/icons.svg";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  // Storing the error message which will be displayed in the renderError
  _errorMessage = "No recepies found for your query! Please try again.";
  // Storing a "success message" placeholder
  _message = "";
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join("");
  }
}

export default new ResultsView();
