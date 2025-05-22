import { setupCombobox } from '@/utils/combobox';

const SELECTORS = {
  comboboxInput: '[data-input-combobox=input]',
  comboboxWrapper: '[data-input-combobox=wrapper]',
  resultContainer: '[data-input-combobox=result-container]',
  resultList: '[data-input-combobox=result-list]',
  resultItem: '[data-input-combobox=result-item]',
  resultItemValue: '[data-input-combobox=result-item-value]',
};

const init = () => {
  const comboboxInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(SELECTORS.comboboxInput)
  );

  for (const input of comboboxInputs) {
    setupCombobox(input);
  }
};

init();
