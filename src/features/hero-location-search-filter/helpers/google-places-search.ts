import { Loader } from "@googlemaps/js-api-loader";
import { getActiveScript } from "@taj-wf/utils";

const formatResult = (location: string) => {
  return location.replaceAll(" - ", ", ").replaceAll(" | ", ", ");
};

export const initGooglePlacesSearch = () => {
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

  const getGooglePlacesSearch = async () => {
    const { AutocompleteSuggestion } = await loader.importLibrary("places");

    const search = async (query: string): Promise<string[]> => {
      try {
        const request: google.maps.places.AutocompleteRequest = {
          input: query,
          includedRegionCodes: ["ae"],
          includedPrimaryTypes: [
            "natural_feature",
            "sublocality",
            "apartment_complex",
            "neighborhood",
            "condominium_complex",
          ],
        };

        const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        if (!response) {
          console.error("No response from AutocompleteSuggestion");
          return [];
        }

        if (response.suggestions.length === 0) {
          return [];
        }

        const results: string[] = [];

        for (const suggestion of response.suggestions) {
          const mainLocationResult = suggestion?.placePrediction?.mainText?.text;
          if (!mainLocationResult) continue;

          const formattedResult = formatResult(mainLocationResult);

          results.push(formattedResult);
        }

        return results;
      } catch (error) {
        console.error("Something went wrong with places api:", error);
        return [];
      }
    };

    return { search };
  };

  return { getGooglePlacesSearch };
};

export type GooglePlacesSearchFunc = (query: string) => Promise<string[]>;
