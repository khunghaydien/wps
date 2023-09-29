import { format } from 'date-fns';

import { fireEvent, RenderResult } from '@testing-library/react';

export default class MonthlyViewPage {
  rendered: RenderResult;

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  getDateCell = (date: Date): HTMLElement => {
    return this.rendered.getByTestId(format(date, 'YYYYMMDD'));
  };

  openDailySummary = (date: Date): void => {
    const elm = this.getDateCell(date);
    fireEvent.click(elm);
  };

  get dailySummary(): HTMLElement {
    return this.rendered.queryByTestId('daily-summary');
  }
}
