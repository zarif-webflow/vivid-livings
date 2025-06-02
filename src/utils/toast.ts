import Toastify from "toastify-js";

const toasterProps = {
  close: true,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  className: "toast-style",
};

export type ToastProps = {
  text: string;
  duration?: number;
  position?: string;
  isTop?: boolean;
  offsetX?: string;
  offsetY?: string;
};

export const getToaster = ({ text, duration, position, isTop, offsetX, offsetY }: ToastProps) => {
  const toaster = Toastify({
    text,
    duration: duration || 3000,
    ...toasterProps,
    position,
    gravity: isTop ? "top" : "bottom",
    offset: {
      x: offsetX || "1em", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: offsetY || "1em", // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
  });
  return toaster;
};
