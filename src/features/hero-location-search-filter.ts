import { getHtmlElement } from "@taj-wf/utils";
import { debounce } from "es-toolkit";

import type { ListFilterCondition, ListInstance } from "@/types/finsweet-attributes-list";
import {
  generateSearchQueryParams,
  getAllFieldsValues,
  getAppliedFilters,
} from "@/utils/finsweet-list-helpers";

const initLocationSearch = (fsListInstanceName: string, pageSlug: string) => {
  const SELECTORS = {
    locationSearchInput: `[fs-list-instance=${fsListInstanceName}] input[fs-list-field=name-with-location][data-input-combobox=input]`,
    searchButton: `[fs-list-instance=${fsListInstanceName}] form button[data-search-button=true]`,
  };

  const locationSearchInput = getHtmlElement<HTMLComboboxInputElement>({
    selector: SELECTORS.locationSearchInput,
  });

  if (!locationSearchInput) {
    console.error("Location search input not found", SELECTORS.locationSearchInput);
    return;
  }

  const searchButton = getHtmlElement<HTMLButtonElement>({
    selector: SELECTORS.searchButton,
  });

  if (!searchButton) {
    console.error("Search button not found", SELECTORS.searchButton);
    return;
  }

  let searchParamsPrefix = locationSearchInput.getAttribute("data-search-params-prefix");
  if (!searchParamsPrefix) {
    console.debug("Search params prefix not found, using default value");
    searchParamsPrefix = "";
  }

  let comboboxApi = locationSearchInput.comboboxApi;
  let comboboxResults: string[] = [];
  let listFilterConditions: ListFilterCondition[] = [];
  let listInstance: ListInstance | undefined = undefined;

  locationSearchInput.addEventListener("combobox-init", (event) => {
    comboboxApi = event.detail.api;
  });

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    (instances) => {
      for (const instance of instances) {
        if (instance.instance !== fsListInstanceName) continue;

        listInstance = instance;

        instance.addHook("filter", (items) => {
          const allFieldValues = getAllFieldsValues(items);

          const newComboboxResults = [];

          for (const fieldValue of allFieldValues) {
            const nameWithLocation = fieldValue["name-with-location"]?.value;
            if (typeof nameWithLocation !== "string") continue;
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

  locationSearchInput.addEventListener("input", () => {
    if (!comboboxApi) {
      console.error("Combobox API not found", locationSearchInput);
      return;
    }

    const value: string = locationSearchInput.value;

    debouncedLocationInputCallback(value, comboboxApi);
  });

  searchButton.addEventListener("click", () => {
    const query = generateSearchQueryParams(listFilterConditions, searchParamsPrefix);
    // build full "/buy" URL on the current origin
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/${pageSlug}${query}`;
    // navigate to the new URL
    window.location.href = fullUrl;
  });

  locationSearchInput.addEventListener("combobox-select", (event) => {
    const selectedValue = event.detail.selectedValue;

    const filtersObjectConditions = listInstance?.filters.value.groups[0]?.conditions;

    if (filtersObjectConditions) {
      for (const condition of filtersObjectConditions) {
        if (condition.fieldKey === "name-with-location") {
          condition.value = selectedValue;
        }
      }
    }
  });
};

const init = () => {
  initLocationSearch("property-location-search", "buy");
  initLocationSearch("offplan-location-search", "off-plan");
};

init();
