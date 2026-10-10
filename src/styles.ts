import { css } from "lit";

export const cardStyles = css`
  :host {
    /* Colour is reserved for what needs attention (low, out, expiring); everything else stays neutral.
       Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then the value this card always used. Without the Pulse theme nothing changes. */
    --sp-accent: var(--pulse-accent, var(--primary-color));
    --sp-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --sp-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --sp-bad: var(--pulse-bad, var(--red-color, #f44336));
    --sp-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --sp-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    /* The selected chip: a stronger neutral step, like Area Pulse's active action and Home Pulse's current mode. */
    --sp-neutral-bg-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --sp-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --sp-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --sp-chip-height: var(--pulse-chip-height, 30px);
    --sp-row-height: var(--pulse-row-height, 56px);
    --sp-gap: var(--pulse-gap, 12px);
    --sp-pad: var(--pulse-pad, 12px);
    /* Motion: the theme's rhythm, else the durations the card always used. */
    --sp-motion-fast: var(--pulse-motion-fast, 120ms);
    --sp-motion-normal: var(--pulse-motion-normal, 150ms);
    --sp-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }
  :host([compact]) {
    --sp-row-height: 44px;
  }
  @media (prefers-reduced-motion: reduce) {
    :host {
      --sp-motion-fast: 0ms;
      --sp-motion-normal: 0ms;
    }
  }

  ha-card {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--sp-gap);
    padding: var(--sp-pad);
    min-height: 0;
    flex: 1;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--sp-accent);
    outline-offset: 2px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .badge {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 24px;
  }
  .titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Like Area Pulse's readings: coloured only when something is out of range. */
  .secondary .warn { color: var(--sp-warn); }
  .secondary .bad { color: var(--sp-bad); }
  .dot { margin: 0 4px; opacity: 0.6; }
  .round {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    transition: background-color var(--sp-motion-normal) var(--sp-ease), transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 22px;
  }
  .round:hover { background: var(--sp-neutral-bg-hover); }
  .round:active { transform: scale(0.94); }

  /* Search / quick add */
  .search {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search > ha-icon {
    position: absolute;
    left: 12px;
    color: var(--secondary-text-color);
    pointer-events: none;
    --mdc-icon-size: 20px;
  }
  .search input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 40px 0 40px;
    border: none;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    outline: none;
  }
  .search input::-webkit-search-cancel-button { display: none; }
  .search input::placeholder { color: var(--secondary-text-color); }
  .search input:focus { box-shadow: inset 0 0 0 2px var(--sp-accent); }
  .search .clear {
    position: absolute;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    --mdc-icon-size: 18px;
  }

  /* Filter chips */
  .chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 calc(-1 * var(--sp-pad));
    padding: 0 var(--sp-pad);
  }
  .chips::-webkit-scrollbar { display: none; }
  /* Scrollers fade at the edge that has more, so a cut-off chip or row reads as "scroll", not as a bug. */
  .chips.more-end {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
  }
  .chips.more-start {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 40px);
    mask-image: linear-gradient(to right, transparent, #000 40px);
  }
  .chips.more-start.more-end {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent);
    mask-image: linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent);
  }
  .chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--sp-chip-height);
    padding: 0 12px;
    border-radius: calc(var(--sp-chip-height) / 2);
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--sp-motion-normal) var(--sp-ease), color var(--sp-motion-normal) var(--sp-ease),
      transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover { background: var(--sp-neutral-bg-hover); }
  .chip:active { transform: scale(0.96); }
  /* Selected: no accent wash, just the family's stronger neutral step and full-strength text. */
  .chip.selected,
  .chip.selected:hover {
    background: var(--sp-neutral-bg-strong);
    color: var(--primary-text-color);
  }
  .chip .count {
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    opacity: 0.8;
  }

  /* List */
  .list {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    margin: 0 -4px;
    padding: 0 4px;
  }
  .list.more-end {
    -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent);
  }
  .list.more-start {
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 24px);
    mask-image: linear-gradient(to bottom, transparent, #000 24px);
  }
  .list.more-start.more-end {
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 32px), transparent);
  }
  .group-head {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 12px 4px 4px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .group-head:first-child { padding-top: 0; }
  .group-head .n { font-weight: 400; opacity: 0.8; }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--sp-row-height);
    border-radius: var(--sp-control-radius);
  }
  .row + .row { border-top: 1px solid color-mix(in srgb, var(--divider-color) 60%, transparent); }
  .row .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 4px;
    text-align: left;
    border-radius: var(--sp-control-radius);
  }
  .row .main:hover { background: var(--sp-neutral-bg); }
  .ricon {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  :host([compact]) .ricon { width: 30px; height: 30px; --mdc-icon-size: 18px; }
  /* Same rule as Area Pulse's chips: the disc stays neutral, only the icon carries the meaning. */
  .ricon.warn { color: var(--sp-warn); }
  .ricon.bad { color: var(--sp-bad); }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .rname {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row.out .rname { color: var(--secondary-text-color); }
  /* One line of facts. Parts wrap onto a hidden second line instead of being cut to "Fr…",
     so a fact is either shown whole or not at all. Only the first may be shortened. */
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 16px;
    min-width: 0;
    overflow: hidden;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 14px;
  }
  .meta .part { white-space: nowrap; flex: none; }
  .meta .part:first-of-type {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meta .warn { color: var(--sp-warn); }
  .meta .bad { color: var(--sp-bad); }
  .meta .cart { flex: none; margin-right: 4px; height: 16px; align-items: center; }
  :host([compact]) .meta { display: none; }
  :host([compact]) .meta.important { display: flex; }

  .stepper {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .step {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    transition: background-color var(--sp-motion-normal) var(--sp-ease), color var(--sp-motion-normal) var(--sp-ease),
      transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 20px;
  }
  .step:hover { background: var(--sp-neutral-bg); color: var(--primary-text-color); }
  .step:active { transform: scale(0.9); }
  .step[disabled] { opacity: 0.3; cursor: default; background: none; transform: none; }
  .qty {
    /* Fixed, so the +/- buttons line up down the list whatever the unit's length. */
    width: 58px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .qty b { font-size: 15px; font-weight: 500; color: var(--primary-text-color); }
  .qty small { font-size: 11px; color: var(--secondary-text-color); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .row.out .qty b { color: var(--secondary-text-color); }

  .add-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: var(--sp-row-height);
    padding: 4px;
    border-radius: var(--sp-control-radius);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
  .add-row:hover { background: var(--sp-neutral-bg); }
  /* An action, like Home Pulse's fixes: neutral, with the accent on the icon. */
  .add-row .ricon { color: var(--sp-accent); }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 20px 12px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 32px;
  }
  .empty .big { font-size: 15px; color: var(--primary-text-color); font-weight: 500; }
  .empty ha-icon { opacity: 0.5; margin-bottom: 4px; }
  .notice {
    padding: 12px;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 13px;
  }
`;

export const dialogStyles = css`
  dialog.sp-dialog {
    padding: 0;
    border: none;
    background: transparent;
    width: min(520px, calc(100vw - 32px));
    max-width: none;
    max-height: min(88vh, 820px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.sp-dialog::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.sp-dialog[open] .surface { animation: sp-pop var(--pulse-motion-normal, 200ms) cubic-bezier(0.2, 0.9, 0.3, 1.1); }
  @keyframes sp-pop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
  .surface {
    display: flex;
    flex-direction: column;
    max-height: min(88vh, 820px);
    box-sizing: border-box;
    border-radius: var(--ha-dialog-border-radius, 28px);
    background: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
    /* Frosted like HA's own dialogs when the theme asks for it (Pulse Glass); nothing otherwise. */
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  .d-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px 8px 20px;
  }
  .d-head .badge { width: 40px; height: 40px; --mdc-icon-size: 22px; }
  .d-title {
    flex: 1;
    min-width: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .d-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 20px 12px;
  }
  .d-status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  /* Family chips: neutral fill and text, the icon carries the colour. */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--sp-chip-height);
    padding: 0 12px 0 9px;
    box-sizing: border-box;
    border-radius: calc(var(--sp-chip-height) / 2);
    background: var(--sp-neutral-bg);
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    --mdc-icon-size: 16px;
  }
  .pill ha-icon { color: var(--secondary-text-color); }
  .pill.warn ha-icon { color: var(--sp-warn); }
  .pill.bad ha-icon { color: var(--sp-bad); }
  /* "Bought": the one-tap restock. Neutral like the pills, accent icon, pushed to the end of the row. */
  .bought {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 11px;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--sp-motion-normal) var(--sp-ease), transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 18px;
  }
  .bought ha-icon { color: var(--sp-accent); }
  .bought:hover { background: var(--sp-neutral-bg-hover); }
  .bought:active { transform: scale(0.96); }
  .bought .amount { color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .bought[disabled] { opacity: 0.5; cursor: default; transform: none; }
  .d-error {
    margin-top: 8px;
    color: var(--error-color, var(--sp-bad));
    font-size: 13px;
  }
  .d-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px calc(16px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--divider-color);
    flex-wrap: wrap;
  }
  .d-foot .spacer { flex: 1; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--sp-accent);
    --mdc-icon-size: 18px;
    transition: background-color var(--sp-motion-normal) var(--sp-ease);
  }
  .btn:hover { background: color-mix(in srgb, var(--sp-accent) 10%, transparent); }
  .btn.filled { background: var(--sp-accent); color: var(--sp-on-accent); }
  .btn.filled:hover { background: color-mix(in srgb, var(--sp-accent) 88%, black); }
  .btn.danger { color: var(--sp-bad); }
  .btn.danger:hover, .btn.danger.armed { background: color-mix(in srgb, var(--sp-bad) 12%, transparent); }
  .btn[disabled] { opacity: 0.5; cursor: default; }

  @media (max-width: 600px) {
    dialog.sp-dialog {
      width: 100vw;
      max-height: 92vh;
      margin: auto 0 0 0;
    }
    .surface {
      max-height: 92vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
    }
    .d-foot { flex-wrap: nowrap; }
    .d-foot .btn { padding: 0 12px; }
    /* Phones: secondary actions become icons; the close button replaces Cancel. */
    .d-foot .btn .lbl, .d-foot .btn.cancel { display: none; }
    .d-foot .btn:has(.lbl) { width: 40px; padding: 0; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog.sp-dialog[open] .surface { animation: none; }
  }
`;
