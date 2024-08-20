class SearchView {
  _parentElement = document.querySelector(".search");

  getQuery() {
    // Storing the query in a variable
    const query = this._parentElement.querySelector(".search__field").value;
    // clearing the input field
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    // adding a listener for "submit" this event will trigger no matter if the user clicks the submit button or hits enter to submit the query
    this._parentElement.addEventListener("submit", function (e) {
      // preventing the default of submitting a form to prevent the page from reloading
      e.preventDefault();
      // calling the handler function (controlSearchResults)
      handler();
    });
  }
}

export default new SearchView();
