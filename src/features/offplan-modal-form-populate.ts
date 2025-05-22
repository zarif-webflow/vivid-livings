const init = () => {
  /**
   * All Element Selectors
   */
  const modalSelector = '[data-offplan-element=modal]';
  const targetInputSelector = '[data-offplan-element=input]';
  const offplanListSelector = '[data-offplan-element=list]';
  const offplanModalTriggerSelector = '[data-offplan-element=modal-trigger]';
  const offplanListItemSelector = '[data-offplan-element=list-item]';
  const nameSelector = '[data-offplan-element=name]';
  const locationSelector = '[data-offplan-element=location]';

  /**
   * All Element Variables
   */
  const modal = document.querySelector<HTMLElement>(modalSelector);

  if (modal === null) {
    console.debug(`Offplan Modal not found. Selector: ${modalSelector}`);
    return;
  }

  const targetInput = document.querySelector<HTMLInputElement>(targetInputSelector);

  if (targetInput === null) {
    console.debug(`Offplan Modal Input not found. Selector: ${targetInputSelector}`);
    return;
  }

  const offplanList = document.querySelector<HTMLElement>(offplanListSelector);

  if (offplanList === null) {
    console.debug(`Offplan List not found. Selector: ${offplanListSelector}`);
    return;
  }

  const openOffplanModal = () => {
    modal.style.opacity = '1';
    modal.style.display = 'block';
  };

  offplanList.addEventListener('click', (event) => {
    const selectedListItem = (event.target as HTMLElement)
      .closest<HTMLElement>(offplanModalTriggerSelector)
      ?.closest<HTMLElement>(offplanListItemSelector);

    if (!selectedListItem) return;

    const nameElement = selectedListItem.querySelector<HTMLElement>(nameSelector);
    if (!nameElement) {
      console.debug(`Offplan List Item Name not found. Selector: ${nameSelector}`);
      return;
    }

    const locationElement = selectedListItem.querySelector<HTMLElement>(locationSelector);
    if (!locationElement) {
      console.debug(`Offplan List Item Location not found. Selector: ${locationSelector}`);
      return;
    }

    const nameValue = nameElement.textContent || nameElement.innerText;
    const locationValue = locationElement.textContent || locationElement.innerText;

    const targetInputValue = `${nameValue}, ${locationValue}`;

    openOffplanModal();

    targetInput.value = targetInputValue;
  });
};

init();
