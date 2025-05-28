import { S as SELECTORS, s as setupCombobox } from './chunks/combobox.js';

const init = () => {
  const comboboxInputs = Array.from(document.querySelectorAll(SELECTORS.comboboxInput));
  for (const input of comboboxInputs) {
    setupCombobox(input);
  }
};
init();
