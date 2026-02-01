import {
  init_live_reload
} from "./chunk-VVUAQP7I.js";

// src/utils/finsweet-list-helpers.ts
init_live_reload();
var getAppliedFilters = (listInstance) => {
  return listInstance.filters.value.groups?.[0]?.conditions ?? [];
};
var getAllFieldsValues = (listItems) => {
  return listItems.map((item) => item.fields);
};
function generateSearchQueryParams(filters, prefix) {
  const normalizedPrefix = prefix ? prefix.endsWith("_") ? prefix : `${prefix}_` : "";
  const parts = filters.filter(
    ({ interacted, value }) => interacted === true && value != null && String(value).trim() !== ""
  ).map(({ id, value }) => {
    const key = `${normalizedPrefix}${id}`;
    return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
  });
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

export {
  getAppliedFilters,
  getAllFieldsValues,
  generateSearchQueryParams
};
//# sourceMappingURL=chunk-32VZHZ55.js.map
