const init = () => {
  let isRestartRunning = false;

  const restartRangeSlider = async () => {
    if (isRestartRunning) return;
    isRestartRunning = true;

    // @ts-expect-error no typed finsweet
    const finsweetModules = window.FinsweetAttributes?.modules;
    if (!finsweetModules) {
      isRestartRunning = false;
      return;
    }

    const rangeSliderModule = finsweetModules.rangeslider;
    if (!rangeSliderModule) {
      isRestartRunning = false;
      return;
    }

    const restartFn = rangeSliderModule.restart;

    if (!restartFn) {
      isRestartRunning = false;
      return;
    }

    await restartFn();

    isRestartRunning = false;
  };

  const restartTriggers = document.querySelectorAll("[restart-range-slider]");
  restartTriggers.forEach((trigger) => {
    trigger.addEventListener("click", async () => {
      await restartRangeSlider();
      await restartRangeSlider();
    });
  });
};

init();
