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
    const api = setupCombobox(input as HTMLComboboxInputElement, []);
    // api?.openResultModal();
  }
};

const initFinsweetCmsApi = () => {
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      for (const listInstance of listInstances) {
        if (listInstance.instance === 'property-location-search') {
          const values = listInstance.items.value;

          listInstance.addHook('start', (items) => {
            console.log(items, 'Start Hook Props');
            return items;
          });

          console.log(listInstance);

          listInstance.addHook('filter', (items) => {
            console.log(listInstance.filters, 'Applied Filters');
            console.log(items, 'End Hook Props');
            return items;
          });
        }
      }
      // Your code goes here.
    },
  ]);
};

init();
initFinsweetCmsApi();
