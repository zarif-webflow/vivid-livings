import { getHtmlElement } from "@taj-wf/utils";

import { getFuzzySearchFunction } from "./helpers/fuzzy-search";
import { getPropsCmsSearchResults } from "./helpers/get-cms-search-results";
import { searchFilterConfigs } from "./search-filter";

const initSearchSuggestions = () => {
  const initSearchSuggestion = (comboboxInputSelector: string, allStaticResults: string[]) => {
    const comboboxInput = getHtmlElement<HTMLComboboxInputElement>({
      selector: comboboxInputSelector,
      log: "error",
    });
    if (!comboboxInput) return;

    let comboboxApi = comboboxInput.comboboxApi;

    const { search: cmsFuzzySearch } = getFuzzySearchFunction(allStaticResults);

    comboboxInput.addEventListener("combobox-init", (event) => {
      comboboxApi = event.detail.api;
    });

    const getSearchResults = async (query: string): Promise<string[]> => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === "") return [];

      const cmsResults = cmsFuzzySearch(trimmedQuery);

      return cmsResults;
    };

    const handleInput = async () => {
      if (!comboboxApi) {
        console.error("Combobox API not found on Combobox Input", comboboxInput);
        return;
      }

      const searchResults = await getSearchResults(comboboxInput.value);

      if (searchResults.length === 0) {
        comboboxApi.renderResults([]);
        comboboxApi.closeResultModal();
        return;
      }
      comboboxApi.renderResults(searchResults);
      comboboxApi.openResultModal();
    };

    comboboxInput.addEventListener("input", handleInput);
  };

  const initBuySearch = () => {
    const allStaticResults = getPropsCmsSearchResults();

    if (!allStaticResults || allStaticResults.length === 0) {
      console.error("No CMS search results found for initializing combobox");
      return;
    }

    initSearchSuggestion(searchFilterConfigs.buy.selectors.locationSearchInput, allStaticResults);
  };

  initBuySearch();
};

initSearchSuggestions();
