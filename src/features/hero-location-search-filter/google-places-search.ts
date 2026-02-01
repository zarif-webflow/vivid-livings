import { Loader } from "@googlemaps/js-api-loader";
import { getActiveScript } from "@taj-wf/utils";
import { debounce } from "es-toolkit";

const scriptElement = getActiveScript(import.meta.url);

if (!scriptElement) {
  throw new Error("Search Address script element was not found!");
}

const placesApiKey = scriptElement.getAttribute("data-places-key");

if (!placesApiKey) {
  throw new Error(
    "Places API key was not found in the script element! Please set data-places-key attribute in the script."
  );
}

const loader = new Loader({
  apiKey: placesApiKey,
  version: "weekly",
});

const formatResult = (location: string) => {
  return location.replaceAll(" - ", ", ").replaceAll(" | ", ", ");
};

const getGooglePlacesSearch = async () => {
  const { AutocompleteSuggestion } = await loader.importLibrary("places");

  const fetchAddresses = async (query: string, callback: (result: string[]) => void) => {
    try {
      const request: google.maps.places.AutocompleteRequest = {
        input: query,
        includedRegionCodes: ["ae"],
      };

      const suggestions = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      const results: string[] = [];

      for (const suggestion of suggestions.suggestions) {
        const mainLocationResult = suggestion?.placePrediction?.mainText?.text;
        if (!mainLocationResult) continue;

        const formattedResult = formatResult(mainLocationResult);

        results.push(formattedResult);
      }

      callback(results);
    } catch (error) {
      console.error("Something went wrong with places api:", error);
      // Return empty array on error and cache it to avoid repeated failed requests
      const emptyResult: string[] = [];
      callback(emptyResult);
    }
  };

  return { fetchAddresses: fetchAddresses };
};
