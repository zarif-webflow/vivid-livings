import { SELECTORS, setupCombobox } from '@/utils/combobox';

const init = () => {
  const comboboxInputs = Array.from(
    document.querySelectorAll<HTMLComboboxInputElement>(SELECTORS.comboboxInput)
  );

  for (const input of comboboxInputs) {
    setupCombobox(input);
  }
};

init();
