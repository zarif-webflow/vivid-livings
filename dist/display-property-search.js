const SELECTORS = {
  searchInput: "[data-display-property-element=search-input]",
  searchWrapper: "[data-display-property-element=search-wrapper]",
  searchResultContainer: "[data-display-property-element=search-result-cont]",
  searchResultList: "[data-display-property-element=search-result-list]",
  searchResultItem: "[data-display-property-element=search-result-item]",
  searchResultItemValue: "[data-display-property-element=search-result-item-value]"
};
const init = () => {
  const searchInputs = Array.from(document.querySelectorAll(SELECTORS.searchInput));
  for (const searchInput of searchInputs) {
    const resultContainer = searchInput.closest(SELECTORS.searchWrapper)?.querySelector(SELECTORS.searchResultContainer);
    if (!resultContainer) {
      console.log("Result container wasnt found for", searchInput);
      continue;
    }
    const resultList = resultContainer.querySelector(SELECTORS.searchResultList);
    if (!resultList) {
      console.log("Result list wasnt found for", searchInput);
      continue;
    }
    const resultItem = resultList.querySelector(SELECTORS.searchResultItem);
    if (!resultItem) {
      console.log("Result item wasnt found for", searchInput);
      continue;
    }
    const modalFragment = document.createDocumentFragment();
    const optionListId = resultList.id || "prop-search";
    modalFragment.appendChild(resultContainer);
    resultContainer.dataset.initialized = "true";
    const setupInitialAttributes = () => {
      searchInput.type = "search";
      searchInput.ariaAutoComplete = "both";
      searchInput.setAttribute("autocomplete", "off");
      searchInput.setAttribute("autocorrect", "off");
      searchInput.setAttribute("autocapitalize", "off");
      searchInput.setAttribute("spellcheck", "false");
      searchInput.setAttribute("aria-controls", optionListId);
      resultList.role = "listbox";
      resultList.id = optionListId;
    };
    setupInitialAttributes();
  }
};
init();
