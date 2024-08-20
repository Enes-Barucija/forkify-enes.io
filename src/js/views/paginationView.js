//Start by copying the imports and part of the starting code from resultsView since the code is the same

// Importing a parent class
import View from "./View.js";

// Importing icons for the UI. This is from the point of view of this file. So, the icons are essentially 2 folders lower, so we use ../..
import icons from "url:../../img/icons.svg";

class paginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      // using event delegation, we can listen for events on the parent element and to listen up in the DOM tree for parent elements
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // Storing the current page into a variable
    const curPage = this._data.page;
    // figuring out how many pages there are an on which page we currently are
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Scenarios for pages:
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      // If we are on the first page, only the next page button will be rendered
      return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      // If we are on the last page only the previous button will be rendered
      return `
       <button data-goto="${
         curPage - 1
       }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;
    }
    // Other page
    if (curPage < numPages) {
      // If we are neither on the first nor the last page, both buttons will be rendered
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-left"></use>
             </svg>
             <span>Page ${curPage - 1}</span>
         </button>
         <button data-goto="${
           curPage + 1
         }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
     `;
    }
    // Page 1, and there are no other pages
    return "";
  }
}

`   
    <button class="btn--inline pagination__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
        </svg>
    </button>`;

export default new paginationView();
