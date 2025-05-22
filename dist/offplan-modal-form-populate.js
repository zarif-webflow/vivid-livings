const init = () => {
  const modalSelector = "[data-offplan-element=modal]";
  const targetInputSelector = "[data-offplan-element=input]";
  const offplanListSelector = "[data-offplan-element=list]";
  const offplanModalTriggerSelector = "[data-offplan-element=modal-trigger]";
  const offplanListItemSelector = "[data-offplan-element=list-item]";
  const nameSelector = "[data-offplan-element=name]";
  const locationSelector = "[data-offplan-element=location]";
  const modal = document.querySelector(modalSelector);
  if (modal === null) {
    console.debug(`Offplan Modal not found. Selector: ${modalSelector}`);
    return;
  }
  const targetInput = document.querySelector(targetInputSelector);
  if (targetInput === null) {
    console.debug(`Offplan Modal Input not found. Selector: ${targetInputSelector}`);
    return;
  }
  const offplanList = document.querySelector(offplanListSelector);
  if (offplanList === null) {
    console.debug(`Offplan List not found. Selector: ${offplanListSelector}`);
    return;
  }
  const openOffplanModal = () => {
    modal.style.opacity = "1";
    modal.style.display = "block";
  };
  offplanList.addEventListener("click", (event) => {
    const selectedListItem = event.target.closest(offplanModalTriggerSelector)?.closest(offplanListItemSelector);
    if (!selectedListItem)
      return;
    const nameElement = selectedListItem.querySelector(nameSelector);
    if (!nameElement) {
      console.debug(`Offplan List Item Name not found. Selector: ${nameSelector}`);
      return;
    }
    const locationElement = selectedListItem.querySelector(locationSelector);
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
