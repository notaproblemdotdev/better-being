import { For, Show, type JSX } from "solid-js";

export type ToastItem = {
  id: number;
  text: string;
  isError: boolean;
};

export function ToastViewport(props: { toasts: ToastItem[] }): JSX.Element {
  return (
    <div class="toast-viewport" aria-live="polite" aria-atomic="true">
      <For each={props.toasts}>
        {(toast) => (
          <div class={`toast${toast.isError ? " toast-error" : ""}`} role={toast.isError ? "alert" : "status"}>
            <Show when={toast.isError}>
              <span class="toast-dot" aria-hidden="true" />
            </Show>
            <span>{toast.text}</span>
          </div>
        )}
      </For>
    </div>
  );
}
