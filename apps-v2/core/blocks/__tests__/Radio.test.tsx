import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import Radio from '../Radio';

const RenderedRadio = class {
  static testId = 'radio-button';
  static radioId = 'radio-button__radio';
  static labelId = 'radio-button__label';
  onChangeHandler: (event: React.SyntheticEvent<HTMLElement>) => void;
  selector: Record<string, any>;

  constructor() {
    this.onChangeHandler = jest.fn();
    this.selector = render(
      <Radio
        data-testid={RenderedRadio.testId}
        onChange={this.onChangeHandler}
        label="TEST"
      />
    );
  }

  get radio() {
    return this.selector.getByTestId(RenderedRadio.radioId);
  }

  get label() {
    return this.selector.getByTestId(RenderedRadio.labelId);
  }

  get onChange() {
    return this.onChangeHandler;
  }
};

it('should fire onChange on click radio button', () => {
  // Arrange
  const renderedRadio = new RenderedRadio();

  // Act
  fireEvent.click(renderedRadio.radio);

  // Arrange
  expect(renderedRadio.onChange).toHaveBeenCalled();
});

it('should fire onChange on click label', () => {
  // Arrange
  const renderedRadio = new RenderedRadio();

  // Act
  fireEvent.click(renderedRadio.label);

  // Arrange
  expect(renderedRadio.onChange).toHaveBeenCalled();
});
