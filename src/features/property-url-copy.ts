import { getToaster, type ToastProps } from '../utils/toast';

const SELECTORS = {
  list: '[data-url-copy=list]',
  listItem: '[data-url-copy=list-item]',
  copyButton: '[data-url-copy=button]',
  link: '[data-url-copy=link]',
};

const init = () => {
  const propertyListElements = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS.list));

  for (const propertyListElement of propertyListElements) {
    propertyListElement.addEventListener('click', async (event: MouseEvent) => {
      const targetEl = event.target as HTMLElement;
      const clickedButton = targetEl.closest<HTMLButtonElement>(SELECTORS.copyButton);
      if (!clickedButton) return;

      const targetListItem = clickedButton.closest<HTMLElement>(SELECTORS.listItem);
      if (!targetListItem) {
        console.error('No list item found for the clicked button', clickedButton);
        return;
      }

      const linkElement = targetListItem.querySelector<HTMLAnchorElement>(SELECTORS.link);
      if (!linkElement) {
        console.error('No link element found in the list item', targetListItem);
        return;
      }

      const url = linkElement.href;

      const { toastMarginX, toastMarginY, toastDuration, toastPosition, toastIsTop, toastText } =
        clickedButton.dataset;

      if (!toastText) {
        console.error('No toast text found in the clicked button', clickedButton);
        return;
      }

      const parsedDuration = Number.parseInt(toastDuration || '');
      const duration = Number.isNaN(parsedDuration) ? undefined : parsedDuration;

      const toastProps: ToastProps = {
        text: toastText,
        isTop: toastIsTop === 'true',
        offsetX: toastMarginX,
        offsetY: toastMarginY,
        position: toastPosition,
        duration,
      };

      await navigator.clipboard.writeText(url);

      const toaster = getToaster(toastProps);

      toaster.showToast();
    });
  }
};

init();
