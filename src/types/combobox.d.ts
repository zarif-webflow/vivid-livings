declare global {
  /**
   * Combobox API interface defining all available methods
   */
  interface ComboboxAPI {
    /**
     * Opens the result modal/dropdown for the combobox
     */
    openResultModal: () => void;

    /**
     * Closes the result modal/dropdown for the combobox
     */
    closeResultModal: () => void;

    /**
     * Renders a list of string results in the dropdown
     */
    renderResults: (results: string[]) => void;

    /**
     * Selects a result item by its index
     */
    selectResultItem: (index: number) => void;
  }

  /**
   * Detail object for the combobox-init event
   */
  interface ComboboxInitEventDetail {
    api: ComboboxAPI;
  }

  /**
   * Detail object for the combobox-select event
   */
  interface ComboboxSelectEventDetail {
    api: ComboboxAPI;
    selectedItem: HTMLLIElement;
    selectedIndex: number;
    selectedValue: string;
  }

  /**
   * Dedicated interface for combobox input elements
   * extending the standard HTMLInputElement
   */
  interface HTMLComboboxInputElement extends HTMLInputElement {
    comboboxApi?: ComboboxAPI;
  }

  /**
   * Combobox initialization event
   */
  interface ComboboxInitEvent extends CustomEvent<ComboboxInitEventDetail> {}

  /**
   * Combobox selection event
   */
  interface ComboboxSelectEvent extends CustomEvent<ComboboxSelectEventDetail> {}

  /**
   * Add event listener types for the custom combobox events
   */
  interface HTMLElementEventMap {
    'combobox-init': ComboboxInitEvent;
    'combobox-select': ComboboxSelectEvent;
  }
}

export {};
