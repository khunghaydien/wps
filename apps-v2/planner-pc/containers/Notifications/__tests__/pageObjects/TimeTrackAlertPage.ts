import { RenderResult } from '@testing-library/react';

export default class PlannerPage {
  rendered: RenderResult;

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  get icon(): HTMLElement {
    return this.rendered.queryByTestId('planner-pc__time-track-alert');
  }
}
