import {
  init_live_reload
} from "./chunks/chunk-VVUAQP7I.js";

// src/features/tabs.ts
init_live_reload();
var init = () => {
  let isRestartRunning = false;
  const restartRangeSlider = async () => {
    if (isRestartRunning) return;
    isRestartRunning = true;
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
//# sourceMappingURL=tabs.js.map
