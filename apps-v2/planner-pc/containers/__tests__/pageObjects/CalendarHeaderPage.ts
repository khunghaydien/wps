import { fireEvent, RenderResult } from '@testing-library/react';

class ViewMode {
  rendered: RenderResult;

  constructor(rendered: RenderResult) {
    this.rendered = rendered;
  }

  get month(): HTMLElement {
    return this.rendered.queryByTestId('switching-calendar__item-0');
  }

  get week(): HTMLElement {
    return this.rendered.queryByTestId('switching-calendar__item-1');
  }

  get label(): HTMLElement {
    return this.rendered.queryByTestId('switching-calendar__label');
  }

  get button(): HTMLElement {
    return this.rendered.queryByTestId('switching-calendar');
  }

  openMenu = async (): Promise<void> => {
    fireEvent.click(this.button);
  };

  selectMonth = (): void => {
    fireEvent.click(this.month);
  };

  selectWeek = (): void => {
    fireEvent.click(this.week);
  };
}

class MonthList {
  rendered: RenderResult;

  constructor(rendered: RenderResult) {
    this.rendered = rendered;
  }

  get label(): HTMLElement {
    return this.rendered.queryByTestId('navigating-month__label');
  }

  get button(): HTMLElement {
    return this.rendered.queryByTestId('navigating-month');
  }

  getItem = (index: number): HTMLElement => {
    return this.rendered.queryByTestId(`navigating-month__item-${index}`);
  };

  openMenu = async (): Promise<void> => {
    fireEvent.click(this.button);
  };

  clickItem = (index: number): void => {
    fireEvent.click(this.getItem(index));
  };
}

export default class CalendarHeaderPage {
  rendered: RenderResult;

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  get viewMode(): ViewMode {
    return new ViewMode(this.rendered);
  }

  get monthList(): MonthList {
    return new MonthList(this.rendered);
  }

  get today(): HTMLElement {
    return this.rendered.queryByTestId('navigating-today');
  }

  get next(): HTMLElement {
    return this.rendered.queryByTestId('navigating-next');
  }

  get prev(): HTMLElement {
    return this.rendered.queryByTestId('navigating-prev');
  }

  clickToday = (): void => {
    fireEvent.click(this.today);
  };

  clickNext = (): void => {
    fireEvent.click(this.next);
  };

  clickPrev = (): void => {
    fireEvent.click(this.prev);
  };
}
