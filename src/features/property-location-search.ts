import {
  generateSearchQueryParams,
  getAllFieldsValues,
  getAppliedFilters,
} from '@/utils/finsweet-list-helpers';
import { SELECTORS as ComboboxSelectors } from '@/utils/combobox';
import { debounce } from 'es-toolkit';
import { ListFilterCondition } from '@/types/finsweet-attributes-list';

const SELECTORS = {
  locationSearchInput: `input[fs-list-field=name-with-location]${ComboboxSelectors.comboboxInput}`,
  searchButton: '[fs-list-instance=property-location-search] form button[data-search-button=true]',
};
const INSTANCE_NAME = 'property-location-search';

const init = () => {
  const locationSearchInput = document.querySelector<HTMLComboboxInputElement>(
    SELECTORS.locationSearchInput
  );

  if (!locationSearchInput) {
    console.error('Location search input not found', SELECTORS.locationSearchInput);
    return;
  }

  const searchButton = document.querySelector<HTMLButtonElement>(SELECTORS.searchButton);

  if (!searchButton) {
    console.error('Search button not found', SELECTORS.searchButton);
    return;
  }

  let searchParamsPrefix = locationSearchInput.getAttribute('data-search-params-prefix');
  if (!searchParamsPrefix) {
    console.warn('Search params prefix not found, using default value');
    searchParamsPrefix = '';
  }

  let comboboxApi = locationSearchInput.comboboxApi;
  let comboboxResults: string[] = [];
  let listFilterConditions: ListFilterCondition[] = [];

  locationSearchInput.addEventListener('combobox-init', (event) => {
    comboboxApi = event.detail.api;
  });

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    (instances) => {
      for (const instance of instances) {
        if (instance.instance !== INSTANCE_NAME) continue;

        instance.addHook('filter', (items) => {
          const allFieldValues = getAllFieldsValues(items);

          const newComboboxResults = [];

          for (const fieldValue of allFieldValues) {
            const nameWithLocation = fieldValue['name-with-location']?.value;
            if (typeof nameWithLocation !== 'string') continue;
            newComboboxResults.push(nameWithLocation);
          }

          comboboxResults = newComboboxResults;

          const appliedFilters = getAppliedFilters(instance);
          listFilterConditions = appliedFilters;
          return items;
        });
      }
    },
  ]);

  const debouncedLocationInputCallback = debounce((value: string, comboboxApi: ComboboxAPI) => {
    if (!value.trim()) {
      comboboxApi.renderResults([]);
      comboboxApi.closeResultModal();
      return;
    }

    comboboxApi.renderResults(comboboxResults);
    comboboxApi.openResultModal();
  }, 200);

  locationSearchInput.addEventListener('input', () => {
    if (!comboboxApi) {
      console.warn('Combobox API not found', locationSearchInput);
      return;
    }

    const value: string = locationSearchInput.value;

    debouncedLocationInputCallback(value, comboboxApi);
  });

  searchButton.addEventListener('click', () => {
    const query = generateSearchQueryParams(listFilterConditions, searchParamsPrefix);
    // build full "/buy" URL on the current origin
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/buy${query}`;
    // navigate to the new URL
    window.location.href = fullUrl;
  });
};

init();
