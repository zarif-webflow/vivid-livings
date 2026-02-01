import { getHtmlElement } from "@taj-wf/utils";

import type { ListFilterCondition } from "@/types/finsweet-attributes-list";
import { generateSearchQueryParams, getAppliedFilters } from "@/utils/finsweet-list-helpers";

const fsListInstanceNames = {
  buy: "property-buy-search",
  rent: "property-rent-search",
  offplan: "offplan-search",
};

const fsListFieldNames = {
  buy: "location",
  rent: "location",
  offplan: "name-with-location",
};

const configs = {
  buy: {
    pageSlug: "buy",
    fsListInstanceName: fsListInstanceNames.buy,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.buy}] input[combobox-input=${fsListFieldNames.buy}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.buy}] form button[data-search-button=true]`,
    },
    fieldName: fsListFieldNames.buy,
  },
  rent: {
    pageSlug: "rent",
    fsListInstanceName: fsListInstanceNames.rent,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.rent}] input[combobox-input=${fsListFieldNames.rent}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.rent}] form button[data-search-button=true]`,
    },
    fieldName: fsListFieldNames.rent,
  },
  offplan: {
    pageSlug: "off-plan",
    fsListInstanceName: fsListInstanceNames.offplan,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.offplan}] input[combobox-input=${fsListFieldNames.offplan}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.offplan}] form button[data-search-button=true]`,
    },
    fieldName: fsListFieldNames.offplan,
  },
};

const initSearchFilter = ({
  fsListInstanceName,
  pageSlug,
  selectors: SELECTORS,
  fieldName,
}: (typeof configs)[keyof typeof configs]) => {
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

  let listFilterConditions: ListFilterCondition[] = [];
  //   let listInstance: ListInstance | undefined = undefined;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    (instances) => {
      for (const instance of instances) {
        if (instance.instance !== fsListInstanceName) continue;

        // listInstance = instance;

        instance.addHook("filter", (items) => {
          const appliedFilters = getAppliedFilters(instance);
          listFilterConditions = appliedFilters;
          return items;
        });
      }
    },
  ]);

  searchButton.addEventListener("click", () => {
    let query = generateSearchQueryParams(listFilterConditions, searchParamsPrefix);
    const locationValue = locationSearchInput.value.trim();

    if (locationValue) {
      query +=
        (query ? "&" : "?") +
        `${encodeURIComponent(`${searchParamsPrefix}_${fieldName}_equal`)}=${encodeURIComponent(locationValue)}`;
    }

    const baseUrl = window.location.origin;

    const fullUrl = `${baseUrl}/${pageSlug}${query}`;

    window.location.href = fullUrl;
  });
};

const init = () => {
  initSearchFilter(configs.buy);
  initSearchFilter(configs.rent);
  initSearchFilter(configs.offplan);
};

init();
