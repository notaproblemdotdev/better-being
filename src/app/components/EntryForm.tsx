import type { JSX } from "solid-js";

export function EntryForm(props: {
  visible: boolean;
  label: string;
  saveLabel: string;
  value: string;
  onValueInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
}): JSX.Element {
  return (
    <section id="entry-view" class={`view${props.visible ? "" : " hidden"}`}>
      <form id="rating-form" class="card card-eval" autocomplete="off" onSubmit={props.onSubmit}>
        <label id="rating-label" for="rating" class="label">
          {props.label}
        </label>

        <div class="slider-row">
          <input id="rating" name="rating" type="range" min="1" max="10" step="1" value={props.value} onInput={props.onValueInput} />
          <output id="rating-value" for="rating" class="rating-pill" aria-live="polite">
            {props.value}/10
          </output>
        </div>
        <button id="save-rating" class="btn btn-primary" type="submit">
          {props.saveLabel}
        </button>
      </form>
    </section>
  );
}
