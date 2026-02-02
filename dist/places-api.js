import {
  Loader
} from "./chunks/chunk-X6GY2OOG.js";
import {
  debounce
} from "./chunks/chunk-IX3EIQDC.js";
import {
  getActiveScript,
  getHtmlElement
} from "./chunks/chunk-4S3UMDLU.js";
import {
  init_live_reload
} from "./chunks/chunk-VVUAQP7I.js";

// src/features/places-api.ts
init_live_reload();
var scriptElement = getActiveScript(import.meta.url);
if (!scriptElement) {
  throw new Error("Search Address script element was not found!");
}
var placesApiKey = scriptElement.getAttribute("data-places-key");
if (!placesApiKey) {
  throw new Error(
    "Places API key was not found in the script element! Please set data-places-key attribute in the script."
  );
}
var loader = new Loader({
  apiKey: placesApiKey,
  version: "weekly"
});
var processLocationString = (location) => {
  return location.replaceAll(" - ", ", ").replaceAll(" | ", ", ");
};
var getAutocompleteSuggestionsFunc = async () => {
  const { AutocompleteSuggestion } = await loader.importLibrary("places");
  const addressQueryCache = /* @__PURE__ */ new Map();
  const fetchAddresses2 = async (query, callback) => {
    const cachedResult = addressQueryCache.get(query);
    if (cachedResult !== void 0) {
      callback(cachedResult);
      return;
    }
    try {
      const request = {
        input: query,
        includedRegionCodes: ["ae"],
        includedPrimaryTypes: [
          "lodging",
          "sublocality",
          "apartment_complex",
          "neighborhood",
          // "establishment",
          "condominium_complex"
        ]
      };
      const suggestions = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      console.clear();
      suggestions.suggestions.forEach((suggestion) => {
        const mainLocationResult = suggestion?.placePrediction.mainText?.text;
        if (!mainLocationResult) {
          throw new Error("No main text found for suggestion");
          return;
        }
        const processedLocation = processLocationString(mainLocationResult);
        console.log("-------");
        console.log(processedLocation);
        console.log(suggestion?.placePrediction?.types);
        console.log("--------------");
      });
      const result = suggestions.suggestions.filter((suggestion) => suggestion.placePrediction != null).map((suggestion) => suggestion.placePrediction.text.text);
      addressQueryCache.set(query, result);
      callback(result);
    } catch (error) {
      console.error("Something went wrong with places api:", error);
      const emptyResult = [];
      addressQueryCache.set(query, emptyResult);
      callback(emptyResult);
    }
  };
  const debouncedFetchAddresses = debounce(fetchAddresses2, 100);
  return { fetchAddresses: debouncedFetchAddresses };
};
var fetchAddresses = getAutocompleteSuggestionsFunc();
var init = async () => {
  fetchAddresses.then(({ fetchAddresses: fetchAddresses2 }) => {
    console.log("Autocompletetions Loaded Succesfully!");
    const inputEl = getHtmlElement({ selector: "[data-search-input]" });
    if (!inputEl) return;
    inputEl.addEventListener("input", () => {
      const value = inputEl.value;
      fetchAddresses2(value, (results) => {
      });
    });
  });
};
init();
export {
  fetchAddresses
};
//# sourceMappingURL=places-api.js.map
