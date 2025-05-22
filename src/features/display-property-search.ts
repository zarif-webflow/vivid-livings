import { setStyle } from '@/utils/util';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { trackInteractOutside } from '@zag-js/interact-outside';

const SELECTORS = {
  searchInput: '[data-display-property-element=search-input]',
  searchWrapper: '[data-display-property-element=search-wrapper]',
  searchResultContainer: '[data-display-property-element=search-result-cont]',
  searchResultList: '[data-display-property-element=search-result-list]',
  searchResultItem: '[data-display-property-element=search-result-item]',
  searchResultItemValue: '[data-display-property-element=search-result-item-value]',
};

const focusedClassName = 'is--focused';

const init = () => {
  const searchInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(SELECTORS.searchInput)
  );

  for (const searchInput of searchInputs) {
    const resultContainer = searchInput
      .closest<HTMLElement>(SELECTORS.searchWrapper)
      ?.querySelector<HTMLElement>(SELECTORS.searchResultContainer);

    if (!resultContainer) {
      console.log('Result container wasnt found for', searchInput);
      continue;
    }

    const resultList = resultContainer.querySelector<HTMLElement>(SELECTORS.searchResultList);

    if (!resultList) {
      console.log('Result list wasnt found for', searchInput);
      continue;
    }

    const resultItem = resultList.querySelector<HTMLElement>(SELECTORS.searchResultItem);

    if (!resultItem) {
      console.log('Result item wasnt found for', searchInput);
      continue;
    }

    /*
     * UI States
     */
    const modalFragment = document.createDocumentFragment();
    let resultItems: HTMLLIElement[] = [];
    let highlightedIndex = 0;
    let position: 'top' | 'bottom' | undefined = undefined;
    let isModalOpen = false;
    const optionListId = resultList.id || 'prop-search';

    let cleanupAutoUpdate: (() => void) | undefined = undefined;
    let cleanupOutsideInteraction: (() => void) | undefined = undefined;

    modalFragment.appendChild(resultContainer);
    resultContainer.dataset.initialized = 'true';

    const setupInitialAttributes = () => {
      searchInput.type = 'search';
      searchInput.ariaAutoComplete = 'both';
      searchInput.setAttribute('autocomplete', 'off');
      searchInput.setAttribute('autocorrect', 'off');
      searchInput.setAttribute('autocapitalize', 'off');
      searchInput.setAttribute('spellcheck', 'false');
      searchInput.setAttribute('aria-controls', optionListId);

      resultList.role = 'listbox';
      resultList.id = optionListId;
    };

    const setModalPosition = () => {
      computePosition(searchInput, resultContainer, {
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
        searchInput.setAttribute('aria-activedescendant', currItem.id);
      }

      highlightedIndex = index;
    };

    let keyboardNavigationCallback: ((e: KeyboardEvent) => void) | undefined = undefined;

    const selectResultItem = (index: number) => {
      const selectedItem = resultItems[index]!;

      const textElement = selectedItem.querySelector<HTMLElement>(SELECTORS.searchResultItemValue);

      if (!textElement) {
        console.log('Text element was not found for', selectedItem);
        return;
      }

      const text = textElement.textContent?.trim();

      if (!text) {
        console.log('Text was not found for', selectedItem);
        return;
      }

      searchInput.value = text;
      searchInput.focus();
    };

    const closeResultModal = () => {
      modalFragment.appendChild(resultContainer);
      searchInput.removeAttribute('aria-activedescendant');

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
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          searchInput.blur();
          selectResultItem(highlightedIndex);
          searchInput.focus();
          closeResultModal();
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(
            highlightedIndex >= resultItems.length - 1 ? 0 : highlightedIndex + 1
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(
            highlightedIndex <= 0 ? resultItems.length - 1 : highlightedIndex - 1
          );
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

      cleanupAutoUpdate = autoUpdate(searchInput, resultContainer, setModalPosition);
      cleanupOutsideInteraction = trackInteractOutside(resultContainer, {
        onPointerDownOutside: closeResultModal,
        onInteractOutside: closeResultModal,
        onFocusOutside: closeResultModal,
      });
    };

    const renderResults = (addresses: string[]) => {
      resultList.innerHTML = '';
      setHighlightedIndex(0);

      if (addresses.length === 0) {
        setResultItems([]);
        return;
      }

      const resultItems: HTMLLIElement[] = [];
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < addresses.length; i++) {
        const listItem = resultItem.cloneNode(true) as HTMLLIElement;

        const textElement = listItem.querySelector<HTMLElement>(SELECTORS.searchResultItemValue);

        if (!textElement) {
          console.log('Text element was not found for', listItem);
          return;
        }

        textElement.textContent = addresses[i]!;
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
  }
};

init();
