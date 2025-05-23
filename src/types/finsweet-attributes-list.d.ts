// ============================================================================
// Finsweet Attributes — List attribute types
// ============================================================================

/**
 * The hook names in the list lifecycle.
 */
export type ListHookKey =
  | 'start'
  | 'filter'
  | 'sort'
  | 'pagination'
  | 'beforeRender'
  | 'render'
  | 'afterRender';

/**
 * A single rendered item in a list.
 */
export interface ListItem {
  /**
   * The root HTMLElement for this item.
   */
  element: HTMLElement;

  /**
   * Raw CMS field data.
   * - type: input type, e.g. 'text', 'number', etc.
   * - value: processed value(s)
   * - rawValue: original value(s)
   */
  fields: Record<
    string,
    {
      type: string;
      value: any;
      rawValue: any;
    }
  >;

  /**
   * A simpler alias for fields → value mapping.
   */
  value: Record<string, any>;
}

/**
 * A single filter condition.
 */
export interface ListFilterCondition {
  id: string;
  fieldKey: string;
  type: string;
  op: string;
  value: any;
  filterMatch?: string;
  fieldMatch?: string;
  fuzzyThreshold?: string;
  interacted?: boolean;
  customTagField?: string;
}

/**
 * A group of filter conditions.
 */
export interface ListFilterGroup {
  id: string;
  element: HTMLElement;
  conditions: ListFilterCondition[];
  cleanup: () => void;
}

/**
 * The combined filters state.
 */
export interface ListFilters {
  groups: ListFilterGroup[];
}

/**
 * The main List instance API.
 */
export interface ListInstance {
  /**
   * Unique instance identifier, or null if none.
   */
  instance: string | null;

  /**
   * The wrapper HTMLElement for this CMS or static list.
   */
  listElement: HTMLElement;

  /**
   * A reactive container for the current items.
   */
  items: { value: ListItem[] };

  /**
   * The current filters state.
   */
  filters: { value: ListFilters };

  /**
   * Register a lifecycle hook.
   * @param key The hook name.
   * @param callback Receives the current items and can return a new array or mutate in-place.
   * @returns A cleanup function that removes the callback.
   */
  addHook(
    key: ListHookKey,
    callback: (items: ListItem[]) => ListItem[] | void | Promise<ListItem[] | void>
  ): () => void;

  // ...you can extend with other public props/methods like sorting, pagination, etc.
}

/**
 * Augment the global window object to strongly-type the 'list' push callback.
 */
declare global {
  interface Window {
    FinsweetAttributes: {
      /**
       * Enqueue a callback for when 'list' attribute instances are loaded.
       * @param config A two-tuple ['list', callback]
       */
      push(config: ['list', (instances: ListInstance[]) => void]): void;

      // other push overloads (for different keys) can be declared here
      // push(...args: any[]): void;
    };
  }
}
