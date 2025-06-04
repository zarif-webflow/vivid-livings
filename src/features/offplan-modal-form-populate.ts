import { getHtmlElement } from "@taj-wf/utils";

const init = () => {
  /**
   * All Element Selectors
   */
  const modalSelector = "[data-dialog-id=offplan-form]";
  const targetInputSelector = "[data-offplan-element=input]";
  const offplanListSelector = "[data-offplan-element=list]";
  // const offplanModalTriggerSelector = "[data-dialog-trigger=offplan-form]";
  const offplanListItemSelector = "[data-offplan-element=list-item]";
  const nameSelector = "[data-offplan-element=name]";
  const locationSelector = "[data-offplan-element=location]";

  /**
   * All Element Variables
   */
  const modal = getHtmlElement<CustomDialogElement>({ selector: modalSelector });

  if (modal === null) {
    console.debug(`Offplan Modal not found. Selector: ${modalSelector}`);
    return;
  }

  const targetInput = getHtmlElement<HTMLInputElement>({ selector: targetInputSelector });

  if (targetInput === null) {
    console.debug(`Offplan Modal Input not found. Selector: ${targetInputSelector}`);
    return;
  }

  const offplanList = getHtmlElement<HTMLElement>({ selector: offplanListSelector });

  if (offplanList === null) {
    console.debug(`Offplan List not found. Selector: ${offplanListSelector}`);
    return;
  }

  offplanList.addEventListener("click", (event) => {
    const dialogApi = modal.dialogApi;

    if (dialogApi === undefined) {
      console.error("Dialog API is not available for the modal.", modal);
      return;
    }

    const selectedListItem = (event.target as HTMLElement)?.closest<HTMLElement>(
      offplanListItemSelector
    );

    if (!selectedListItem) return;

    const nameElement = getHtmlElement<HTMLElement>({
      selector: nameSelector,
      parent: selectedListItem,
    });
    if (!nameElement) {
      console.debug(`Offplan List Item Name not found. Selector: ${nameSelector}`);
      return;
    }

    const locationElement = getHtmlElement<HTMLElement>({
      selector: locationSelector,
      parent: selectedListItem,
    });
    if (!locationElement) {
      console.debug(`Offplan List Item Location not found. Selector: ${locationSelector}`);
      return;
    }

    const nameValue = nameElement.textContent || nameElement.innerText;
    const locationValue = locationElement.textContent || locationElement.innerText;

    const targetInputValue = `${nameValue}, ${locationValue}`;

    targetInput.value = targetInputValue;

    dialogApi.open();

    targetInput.focus();
  });
};

init();
