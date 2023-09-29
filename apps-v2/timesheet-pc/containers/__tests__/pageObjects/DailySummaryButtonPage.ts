import { fireEvent, RenderResult } from '@testing-library/react';

export default class DailySummaryButtonPage {
  rendered: RenderResult;

  static alertClass =
    'timesheet-pc-main-content-timesheet-daily-summary-button--alert';

  static okClass =
    'timesheet-pc-main-content-timesheet-daily-summary-button--ok';

  static buttonClass =
    'timesheet-pc-main-content-timesheet-daily-summary-button__plus-button';

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  get alert() {
    // @ts-ignore
    return this.rendered.queryByTestId(
      'timesheet-pc__daily-summary-button__alert-mark'
    );
  }

  get plusButton() {
    // @ts-ignore
    return this.rendered.queryByTestId(
      'timesheet-pc__daily-summary-button__plus-button'
    );
  }

  get taskTime() {
    // @ts-ignore
    return this.rendered.queryByTestId(
      'timesheet-pc__daily-summary-button__task-time'
    );
  }

  get message() {
    // @ts-ignore
    return this.rendered.container.querySelector('.slds-popover__body');
  }

  click = () => {
    // @ts-ignore
    const root = this.rendered.getByTestId(
      'timesheet-pc__daily-summary-button'
    );
    fireEvent.click(root);
  };
}
