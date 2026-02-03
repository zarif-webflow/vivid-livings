import { getHtmlElement } from "@taj-wf/utils";
import { debounce } from "es-toolkit";

import { getFuzzySearchFunction } from "./helpers/fuzzy-search";
import {
  getOffplanCmsSearchResults,
  getPropsCmsSearchResults,
} from "./helpers/get-cms-search-results";
import {
  type GooglePlacesSearchFunc,
  initGooglePlacesSearch,
} from "./helpers/google-places-search";
import { searchFilterConfigs } from "./search-filter";

const initSearchSuggestions = () => {
  let googlePlacesSearch: GooglePlacesSearchFunc | null = null;

  const setupGooglePlacesSearch = () => {
    try {
      const { getGooglePlacesSearch } = initGooglePlacesSearch();
      getGooglePlacesSearch().then((res) => {
        googlePlacesSearch = res.search;
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error initializing Google Places Search:", error.message);
      googlePlacesSearch = null;
      return;
    }
  };

  setupGooglePlacesSearch();

  const initSearchSuggestion = (comboboxInputSelector: string, allStaticPropResults: string[]) => {
    const comboboxInput = getHtmlElement<HTMLComboboxInputElement>({
      selector: comboboxInputSelector,
      log: "error",
    });
    if (!comboboxInput) return;

    let comboboxApi = comboboxInput.comboboxApi;

    const { search: cmsFuzzySearch } = getFuzzySearchFunction(allStaticPropResults);

    comboboxInput.addEventListener("combobox-init", (event) => {
      comboboxApi = event.detail.api;
    });

    const resultsCache = new Map<string, string[]>();

    const getSearchResults = async (query: string): Promise<string[]> => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === "") return [];

      if (resultsCache.has(trimmedQuery)) {
        return resultsCache.get(trimmedQuery)!;
      }

      const resultsSet = cmsFuzzySearch(trimmedQuery);

      if (googlePlacesSearch !== null) {
        try {
          const googleResults = await googlePlacesSearch(trimmedQuery);

          if (googleResults && googleResults.length > 0) {
            for (const result of googleResults) {
              resultsSet.add(result);
            }
          }
        } catch (err) {
          const error = err as Error;
          console.error("Error fetching Google Places Search results:", error.message);
        }
      }

      const results = Array.from(resultsSet);

      resultsCache.set(trimmedQuery, results);

      return results;
    };

    let currentAbortController: AbortController | null = null;

    const handleInput = async () => {
      if (!comboboxApi) {
        console.error("Combobox API not found on Combobox Input", comboboxInput);
        return;
      }

      // Create new abort controller for this request
      currentAbortController = new AbortController();
      const thisRequestController = currentAbortController;

      const searchResults = await getSearchResults(comboboxInput.value);

      // Check if this request was aborted
      if (thisRequestController.signal.aborted) {
        return;
      }

      if (searchResults.length === 0) {
        comboboxApi.renderResults([]);
        comboboxApi.closeResultModal();
        return;
      }
      comboboxApi.renderResults(searchResults);
      comboboxApi.openResultModal();
    };

    const debouncedHandleInput = debounce(handleInput, 200);

    comboboxInput.addEventListener("input", () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      debouncedHandleInput();
    });
  };

  const initAllSearches = () => {
    const allStaticPropResults = getPropsCmsSearchResults();

    if (!allStaticPropResults || allStaticPropResults.length === 0) {
      console.error("No CMS search results found for initializing combobox");
      return;
    }

    initSearchSuggestion(
      searchFilterConfigs.buy.selectors.locationSearchInput,
      allStaticPropResults
    );
    initSearchSuggestion(
      searchFilterConfigs.rent.selectors.locationSearchInput,
      allStaticPropResults
    );

    const allStaticOffplanResults = getOffplanCmsSearchResults();

    if (!allStaticOffplanResults || allStaticOffplanResults.length === 0) {
      console.error("No Offplan CMS search results found for initializing combobox");
      return;
    }
    initSearchSuggestion(searchFilterConfigs.offplan.selectors.locationSearchInput, [
      ...allStaticOffplanResults,
      ...allStaticPropResults,
    ]);
  };

  initAllSearches();
};

initSearchSuggestions();
