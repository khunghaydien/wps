import { RenderResult } from '@testing-library/react';

class ConfirmDialog {
  rendered: RenderResult;

  constructor(rendered: RenderResult) {
    this.rendered = rendered;
  }

  get ok(): HTMLElement {
    return this.rendered.queryByTestId(
      'commons-dialogs-confirm-dialog__ok-button'
    );
  }

  get cancel(): HTMLElement {
    return this.rendered.queryByTestId(
      'commons-dialogs-confirm-dialog__cancel-button'
    );
  }

  get content(): HTMLElement {
    return this.rendered.queryByTestId(
      'commons-dialogs-confirm-dialog__content'
    );
  }
}

class DateTime {
  prefix: string;
  rendered: RenderResult;

  constructor(parentTestId: string, rendered: RenderResult) {
    this.prefix = parentTestId;
    this.rendered = rendered;
  }

  get date(): HTMLElement {
    return this.rendered.queryByTestId(`${this.prefix}__date`);
  }

  get time(): HTMLElement {
    return this.rendered.queryByTestId(`${this.prefix}__time`);
  }
}

export default class EventEditPopupPage {
  rendered: RenderResult;

  constructor(renderer: () => RenderResult) {
    this.rendered = renderer();
  }

  get title(): HTMLElement {
    return this.rendered.queryByTestId('event-edit-popup__title');
  }

  get allDay(): HTMLElement {
    return this.rendered.queryByTestId('event-edit-popup__all-day');
  }

  get description(): HTMLElement {
    return this.rendered.queryByTestId('event-edit-popup__description');
  }

  get start(): DateTime {
    return new DateTime('event-edit-popup__start', this.rendered);
  }

  get end(): DateTime {
    return new DateTime('event-edit-popup__end', this.rendered);
  }

  get submit(): HTMLElement {
    return this.rendered.getByTestId('event-edit-popup__submit');
  }

  get cancel(): HTMLElement {
    return this.rendered.getByTestId('event-edit-popup__cancel');
  }

  get delete(): HTMLElement {
    return this.rendered.getByTestId('event-edit-popup__delete');
  }

  get outOfContent(): HTMLElement {
    return this.rendered.getByTestId('event-edit-popup__overlay');
  }

  get jobSelect(): HTMLElement {
    return this.rendered.queryByTestId('event-edit-popup__job-select');
  }

  get workCategorySelect(): HTMLElement {
    return this.rendered.queryByTestId(
      'event-edit-popup__work-category-select'
    );
  }

  get confirmDialog(): ConfirmDialog {
    return new ConfirmDialog(this.rendered);
  }

  get calculateCapacityCheckbox() {
    return this.rendered.queryByTestId('event-edit-popup__calculate-capcity');
  }
}
