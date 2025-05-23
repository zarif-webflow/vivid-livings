import { setStyle } from '@/utils/util';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { trackInteractOutside } from '@zag-js/interact-outside';

const SELECTORS = {
  comboboxInput: '[data-input-combobox=input]',
  comboboxWrapper: '[data-input-combobox=wrapper]',
  resultContainer: '[data-input-combobox=result-container]',
  resultList: '[data-input-combobox=result-list]',
  resultItem: '[data-input-combobox=result-item]',
  resultItemValue: '[data-input-combobox=result-item-value]',
};

const focusedClassName = 'is--focused';

const setupCombobox = (comboboxInput: HTMLComboboxInputElement, initialResults: string[] = []) => {
  const id = comboboxInput.id;

  if (!id) {
    console.error('Combobox input does not have an id', comboboxInput);
    return;
  }

  const resultContainer = comboboxInput
    .closest<HTMLElement>(SELECTORS.comboboxWrapper)
    ?.querySelector<HTMLElement>(SELECTORS.resultContainer);

  if (!resultContainer) {
    console.log('Result container wasnt found for', comboboxInput);
    return;
  }

  const resultList = resultContainer.querySelector<HTMLElement>(SELECTORS.resultList);

  if (!resultList) {
    console.log('Result list wasnt found for', comboboxInput);
    return;
  }

  const resultItem = resultList.querySelector<HTMLElement>(SELECTORS.resultItem);

  if (!resultItem) {
    console.log('Result item wasnt found for', comboboxInput);
    return;
  }

  /*
   * UI States
   */
  const modalFragment = document.createDocumentFragment();
  let resultItems: HTMLLIElement[] = [];
  let highlightedIndex = 0;
  let position: 'top' | 'bottom' | undefined = undefined;
  let isModalOpen = false;
  const optionListId = id + '-listbox';

  let cleanupAutoUpdate: (() => void) | undefined = undefined;
  let cleanupOutsideInteraction: (() => void) | undefined = undefined;

  modalFragment.appendChild(resultContainer);
  resultContainer.dataset.initialized = 'true';

  const setupInitialAttributes = () => {
    comboboxInput.type = 'search';
    comboboxInput.ariaAutoComplete = 'both';
    comboboxInput.setAttribute('autocomplete', 'off');
    comboboxInput.setAttribute('autocorrect', 'off');
    comboboxInput.setAttribute('autocapitalize', 'off');
    comboboxInput.setAttribute('spellcheck', 'false');
    comboboxInput.setAttribute('aria-controls', optionListId);

    resultList.role = 'listbox';
    resultList.id = optionListId;
  };

  const setModalPosition = () => {
    computePosition(comboboxInput, resultContainer, {
      placement: 'bottom-start',
      middleware: [
        offset(),
        flip(),
        shift(),
        size({
          apply: ({ rects }) => {
            setStyle(resultContainer, { width: `${rects.reference.width}px` });
          },
        }),
      ],
    }).then(({ x, y }) => {
      setStyle(resultContainer, { left: `${x}px`, top: `${y}px` });
    });
  };

  const setResultItems = (items: HTMLLIElement[]) => {
    resultItems = items;
  };

  const setHighlightedIndex = (index: number) => {
    const prevItem = resultItems[highlightedIndex];
    const currItem = resultItems[index];

    if (prevItem) {
      prevItem.classList.remove(focusedClassName);
      prevItem.ariaSelected = 'false';
    }

    if (currItem) {
      currItem.classList.add(focusedClassName);
      currItem.ariaSelected = 'true';
      comboboxInput.setAttribute('aria-activedescendant', currItem.id);
    }

    highlightedIndex = index;
  };

  let keyboardNavigationCallback: ((e: KeyboardEvent) => void) | undefined = undefined;

  const selectResultItem = (index: number) => {
    const selectedItem = resultItems[index]!;

    const textElement = selectedItem.querySelector<HTMLElement>(SELECTORS.resultItemValue);

    if (!textElement) {
      console.log('Text element was not found for', selectedItem);
      return;
    }

    const text = textElement.textContent?.trim();

    if (!text) {
      console.log('Text was not found for', selectedItem);
      return;
    }

    comboboxInput.value = text;
    comboboxInput.focus();

    // Dispatch the combobox-select event after selection is complete
    comboboxInput.dispatchEvent(
      new CustomEvent('combobox-select', {
        bubbles: true,
        detail: {
          api: comboboxApi,
          selectedItem: selectedItem,
          selectedIndex: index,
          selectedValue: text,
        },
      })
    );
  };

  const closeResultModal = () => {
    modalFragment.appendChild(resultContainer);
    comboboxInput.removeAttribute('aria-activedescendant');

    if (keyboardNavigationCallback !== undefined) {
      document.removeEventListener('keydown', keyboardNavigationCallback);
    }

    isModalOpen = false;

    cleanupAutoUpdate?.();
    cleanupOutsideInteraction?.();
  };

  const setupEventListeners = () => {
    /*
     * Click and hover effects
     */
    for (let i = 0; i < resultItems.length; i++) {
      const resultItem = resultItems[i]!;

      resultItem.role = 'option';
      resultItem.ariaSelected = 'false';
      resultItem.id = `address-suggestion-${i}`;

      resultItem.addEventListener('mouseenter', () => {
        setHighlightedIndex(i);
      });

      resultItem.addEventListener('click', () => {
        selectResultItem(i);
        closeResultModal();
      });
    }

    /*
     * Keyboard navigation
     */

    if (keyboardNavigationCallback !== undefined) {
      document.removeEventListener('keydown', keyboardNavigationCallback);
    }

    keyboardNavigationCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        comboboxInput.blur();
        selectResultItem(highlightedIndex);
        comboboxInput.focus();
        closeResultModal();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(highlightedIndex >= resultItems.length - 1 ? 0 : highlightedIndex + 1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(highlightedIndex <= 0 ? resultItems.length - 1 : highlightedIndex - 1);
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeResultModal();
      }
    };

    document.addEventListener('keydown', keyboardNavigationCallback);
  };

  const openResultModal = () => {
    document.body.appendChild(resultContainer);
    setModalPosition();
    isModalOpen = true;

    cleanupAutoUpdate = autoUpdate(comboboxInput, resultContainer, setModalPosition);
    cleanupOutsideInteraction = trackInteractOutside(resultContainer, {
      onPointerDownOutside: closeResultModal,
      onInteractOutside: closeResultModal,
      onFocusOutside: closeResultModal,
    });
  };

  const renderResults = (results: string[]) => {
    resultList.innerHTML = '';
    setHighlightedIndex(0);

    if (results.length === 0) {
      setResultItems([]);
      return;
    }

    const resultItems: HTMLLIElement[] = [];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < results.length; i++) {
      const listItem = resultItem.cloneNode(true) as HTMLLIElement;

      const textElement = listItem.querySelector<HTMLElement>(SELECTORS.resultItemValue);

      if (!textElement) {
        console.log('Text element was not found for', listItem);
        return;
      }

      textElement.textContent = results[i]!;
      textElement.dataset.index = i.toString();

      if (i === 0) {
        listItem.classList.add(focusedClassName);
      }

      fragment.appendChild(listItem);
      resultItems.push(listItem);
    }

    resultList.appendChild(fragment);

    setResultItems(resultItems);
    setupEventListeners();
  };

  setupInitialAttributes();
  renderResults(initialResults);

  const comboboxApi = {
    openResultModal,
    closeResultModal,
    renderResults,
    selectResultItem,
  };

  // Attach API to the input element
  comboboxInput.comboboxApi = comboboxApi;

  // Dispatch initialization event
  comboboxInput.dispatchEvent(
    new CustomEvent('combobox-init', {
      bubbles: true,
      detail: { api: comboboxApi },
    })
  );

  return comboboxApi;
};

export { setupCombobox, SELECTORS };
