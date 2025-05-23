import type { ListInstance, ListItem } from '@/types/finsweet-attributes-list';

export const getAppliedFilters = (listInstance: ListInstance) => {
  return listInstance.filters.value.groups?.[0]?.conditions ?? [];
};

export const getAllFieldsValues = (listItems: ListItem[]) => {
  return listItems.map((item) => item.fields);
};
