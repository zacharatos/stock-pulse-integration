/**
 * Define a custom element at the right moment.
 *
 * The integration loads the card with `add_extra_js_url`, so the browser can run this bundle before
 * Home Assistant's own app code. The app installs a scoped custom-element registry when it starts;
 * an element defined before that is invisible to it, and the dashboard shows "Custom element
 * doesn't exist". So inside the Home Assistant page we wait for the app (`<home-assistant>`) to be
 * defined first. Anywhere else (a Lovelace resource loaded later, the test harness) we define now.
 */
export function defineElement(tag: string, ctor: CustomElementConstructor): Promise<void> {
  const define = () => {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
  };
  const app = document.querySelector("home-assistant");
  if (app && !customElements.get("home-assistant")) {
    return customElements.whenDefined("home-assistant").then(define);
  }
  define();
  return Promise.resolve();
}
