import {
  generateSearchQueryParams,
  getAppliedFilters
} from "./chunk-32VZHZ55.js";
import {
  getHtmlElement
} from "./chunk-4S3UMDLU.js";
import {
  init_live_reload
} from "./chunk-VVUAQP7I.js";

// src/features/hero-location-search-filter/search-filter.ts
init_live_reload();
var fsListInstanceNames = {
  buy: "property-buy-search",
  rent: "property-rent-search",
  offplan: "offplan-search"
};
var fsListFieldNames = {
  buy: "location",
  rent: "location",
  offplan: "name-with-location"
};
var searchFilterConfigs = {
  buy: {
    pageSlug: "buy",
    fsListInstanceName: fsListInstanceNames.buy,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.buy}] input[combobox-input=${fsListFieldNames.buy}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.buy}] form button[data-search-button=true]`
    },
    fieldName: fsListFieldNames.buy
  },
  rent: {
    pageSlug: "rent",
    fsListInstanceName: fsListInstanceNames.rent,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.rent}] input[combobox-input=${fsListFieldNames.rent}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.rent}] form button[data-search-button=true]`
    },
    fieldName: fsListFieldNames.rent
  },
  offplan: {
    pageSlug: "off-plan",
    fsListInstanceName: fsListInstanceNames.offplan,
    selectors: {
      locationSearchInput: `[fs-list-instance=${fsListInstanceNames.offplan}] input[combobox-input=${fsListFieldNames.offplan}][data-input-combobox=input]`,
      searchButton: `[fs-list-instance=${fsListInstanceNames.offplan}] form button[data-search-button=true]`
    },
    fieldName: fsListFieldNames.offplan
  }
};
var initSearchFilter = ({
  fsListInstanceName,
  pageSlug,
  selectors: SELECTORS,
  fieldName
}) => {
  const locationSearchInput = getHtmlElement({
    selector: SELECTORS.locationSearchInput
  });
  if (!locationSearchInput) {
    console.error("Location search input not found", SELECTORS.locationSearchInput);
    return;
  }
  const searchButton = getHtmlElement({
    selector: SELECTORS.searchButton
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
  let listFilterConditions = [];
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    (instances) => {
      for (const instance of instances) {
        if (instance.instance !== fsListInstanceName) continue;
        const appliedFilters = getAppliedFilters(instance);
        listFilterConditions = appliedFilters;
      }
    }
  ]);
  searchButton.addEventListener("click", () => {
    let query = generateSearchQueryParams(listFilterConditions, searchParamsPrefix);
    const locationValue = locationSearchInput.value.trim();
    const finalSearchParamsPrefix = searchParamsPrefix ? searchParamsPrefix + "_" : "";
    if (locationValue) {
      query += (query ? "&" : "?") + `${encodeURIComponent(`${finalSearchParamsPrefix}${fieldName}_equal`)}=${encodeURIComponent(locationValue)}`;
    }
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/${pageSlug}${query}`;
    window.location.href = fullUrl;
  });
};
var init = () => {
  initSearchFilter(searchFilterConfigs.buy);
  initSearchFilter(searchFilterConfigs.rent);
  initSearchFilter(searchFilterConfigs.offplan);
};
init();

export {
  searchFilterConfigs
};
//# sourceMappingURL=chunk-55W2D2EF.js.map
