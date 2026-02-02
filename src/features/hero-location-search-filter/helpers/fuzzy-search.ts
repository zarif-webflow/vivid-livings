import Fuse from "fuse.js";

export const getFuzzySearchFunction = (allResults: string[]) => {
  const fuse = new Fuse(allResults, {
    includeScore: true,
    threshold: 0.2,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  return {
    search: (query: string) => {
      const results = fuse.search(query);
      const resultsSet = new Set<string>();

      for (const result of results) {
        resultsSet.add(result.item);
      }

      return resultsSet;
    },
  };
};
