import { RenderResult } from '@testing-library/react';

export default class PlannerPage {
  rendered: RenderResult;

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  get trackSummary(): HTMLElement {
    return this.rendered.queryByTestId('planner-pc__track-summary-request');
  }

  get monthlyCalendar(): HTMLElement {
    return this.rendered.queryByTestId('planner-pc__monthly-calendar');
  }

  get weeklyCalendar(): HTMLElement {
    return this.rendered.queryByTestId('planner-pc__weekly-calendar');
  }
}
