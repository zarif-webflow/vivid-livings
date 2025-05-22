const SELECTORS$1 = {
  comboboxInput: "[data-input-combobox=input]",
  comboboxWrapper: "[data-input-combobox=wrapper]",
  resultContainer: "[data-input-combobox=result-container]",
  resultList: "[data-input-combobox=result-list]",
  resultItem: "[data-input-combobox=result-item]",
  resultItemValue: "[data-input-combobox=result-item-value]"
};
const setupCombobox = (comboboxInput) => {
  const id = comboboxInput.id;
  if (!id) {
    console.error("Combobox input does not have an id", comboboxInput);
    return;
  }
  const resultContainer = comboboxInput.closest(SELECTORS$1.comboboxWrapper)?.querySelector(SELECTORS$1.resultContainer);
  if (!resultContainer) {
    console.log("Result container wasnt found for", comboboxInput);
    return;
  }
  const resultList = resultContainer.querySelector(SELECTORS$1.resultList);
  if (!resultList) {
    console.log("Result list wasnt found for", comboboxInput);
    return;
  }
  const resultItem = resultList.querySelector(SELECTORS$1.resultItem);
  if (!resultItem) {
    console.log("Result item wasnt found for", comboboxInput);
    return;
  }
  const modalFragment = document.createDocumentFragment();
  const optionListId = id + "-listbox";
  modalFragment.appendChild(resultContainer);
  resultContainer.dataset.initialized = "true";
  const setupInitialAttributes = () => {
    comboboxInput.type = "search";
    comboboxInput.ariaAutoComplete = "both";
    comboboxInput.setAttribute("autocomplete", "off");
    comboboxInput.setAttribute("autocorrect", "off");
    comboboxInput.setAttribute("autocapitalize", "off");
    comboboxInput.setAttribute("spellcheck", "false");
    comboboxInput.setAttribute("aria-controls", optionListId);
    resultList.role = "listbox";
    resultList.id = optionListId;
  };
  setupInitialAttributes();
};

const SELECTORS = {
  comboboxInput: "[data-input-combobox=input]",
  comboboxWrapper: "[data-input-combobox=wrapper]",
  resultContainer: "[data-input-combobox=result-container]",
  resultList: "[data-input-combobox=result-list]",
  resultItem: "[data-input-combobox=result-item]",
  resultItemValue: "[data-input-combobox=result-item-value]"
};
const init = () => {
  const comboboxInputs = Array.from(document.querySelectorAll(SELECTORS.comboboxInput));
  for (const input of comboboxInputs) {
    setupCombobox(input);
  }
};
init();
