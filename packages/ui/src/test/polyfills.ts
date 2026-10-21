/**
 * jsdom lacks a few browser APIs that Radix primitives rely on (Select, Checkbox/Switch inside forms,
 * Dialog, Tooltip...). Import this file from any test that renders such components.
 */
if (typeof window !== "undefined") {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  if (!("ResizeObserver" in window)) {
    Object.defineProperty(window, "ResizeObserver", { value: ResizeObserverStub });
  }

  const proto = window.HTMLElement.prototype;
  if (!proto.hasPointerCapture) proto.hasPointerCapture = () => false;
  if (!proto.setPointerCapture) proto.setPointerCapture = () => {};
  if (!proto.releasePointerCapture) proto.releasePointerCapture = () => {};
  if (!proto.scrollIntoView) proto.scrollIntoView = () => {};
}
