import type { ListInstance, ListItem } from "@/types/finsweet-attributes-list";

export const getAppliedFilters = (listInstance: ListInstance) => {
  return listInstance.filters.value.groups?.[0]?.conditions ?? [];
};

export const getAllFieldsValues = (listItems: ListItem[]) => {
  return listItems.map((item) => item.fields);
};

export interface QueryFilter {
  /** will become the suffix of the key, e.g. "name-with-location_equal" */
  id: string;
  /** the raw value to send */
  value?: string | number | boolean;
  /** only include if true */
  interacted?: boolean;
}

/**
 * Build a Webflow‐compatible query string from any list of filter objects.
 * @param prefix  the literal prefix before each key (e.g. "prefix_")
 * @param filters your array of { id, value, interacted }
 * @returns either "" or "?prefix_id1=val1&prefix_id2=val2…"
 */
export function generateSearchQueryParams(filters: QueryFilter[], prefix: string): string {
  // only add an underscore when prefix is non-empty
  const normalizedPrefix = prefix ? (prefix.endsWith("_") ? prefix : `${prefix}_`) : "";

  const parts = filters
    .filter(
      ({ interacted, value }) => interacted === true && value != null && String(value).trim() !== ""
    )
    .map(({ id, value }) => {
      const key = `${normalizedPrefix}${id}`;
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return parts.length > 0 ? `?${parts.join("&")}` : "";
}
