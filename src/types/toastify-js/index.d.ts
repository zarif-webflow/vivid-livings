declare module "toastify-js" {
  export interface ToastifyOffset {
    x: number | string;
    y: number | string;
  }

  export interface ToastifyOptions {
    oldestFirst?: boolean;
    text?: string;
    node?: Node;
    duration?: number;
    selector?: string | HTMLElement | ShadowRoot;
    callback?: () => void;
    destination?: string;
    newWindow?: boolean;
    close?: boolean;
    gravity?: string;
    positionLeft?: boolean;
    position?: string;
    backgroundColor?: string;
    avatar?: string;
    className?: string;
    stopOnFocus?: boolean;
    onClick?: () => void;
    offset?: ToastifyOffset;
    escapeMarkup?: boolean;
    ariaLive?: string;
    style?: { [property: string]: string };
  }

  export interface ToastifyInstance {
    options: ToastifyOptions;
    toastElement: HTMLElement | null;
    toastify: string;
    init(options?: ToastifyOptions): this;
    buildToast(): HTMLElement;
    showToast(): this;
    hideToast(): void;
    removeElement(toastElement: HTMLElement): void;
  }

  function Toastify(options?: ToastifyOptions): ToastifyInstance;
  namespace Toastify {
    const defaults: ToastifyOptions;
    function reposition(): void;
  }

  export default Toastify;
}
