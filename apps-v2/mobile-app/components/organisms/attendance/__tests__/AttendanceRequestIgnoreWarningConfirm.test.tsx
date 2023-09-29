import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Component from '../AttendanceRequestIgnoreWarningConfirm';

jest.mock('@mobile/components/molecules/commons/Dialog', () => ({
  __esModule: true,
  default: ({
    content,
    leftButtonLabel,
    rightButtonLabel,
    onClickLeftButton,
    onClickRightButton,
    onClickCloseButton,
  }) => {
    return (
      <div>
        <div data-testid="content">{content}</div>
        <button
          type="button"
          onClick={onClickLeftButton}
          data-testid="left-button"
        >
          {leftButtonLabel}
        </button>
        <button
          type="button"
          onClick={onClickRightButton}
          data-testid="right-button"
        >
          {rightButtonLabel}
        </button>
        <button
          type="button"
          onClick={onClickCloseButton}
          data-testid="close-button"
        />
      </div>
    );
  },
}));

describe('default()', () => {
  it('should be null if messages are null.', () => {
    // Act
    const { container } = render(
      <Component messages={null} callback={() => {}} />
    );

    // Assert
    expect(container.firstChild).toBe(null);
  });

  it("should be null if messages don't have length.", () => {
    // Act
    const { container } = render(
      <Component messages={[]} callback={() => {}} />
    );

    // Assert
    expect(container.firstChild).toBe(null);
  });

  it('should open Dialog if messages have length.', () => {
    // Act
    const { container } = render(
      <Component
        messages={['Message 1', 'Message 2', 'Message 3']}
        callback={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should return false if close button is clicked.', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { getByTestId } = render(
      <Component
        messages={['Message 1', 'Message 2', 'Message 3']}
        callback={callback}
      />
    );

    // Assert
    fireEvent.click(getByTestId('close-button'));
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(false);
  });

  it('should return false if left button is clicked.', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { getByTestId } = render(
      <Component
        messages={['Message 1', 'Message 2', 'Message 3']}
        callback={callback}
      />
    );

    // Assert
    fireEvent.click(getByTestId('left-button'));
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(false);
  });

  it('should return right if right button is clicked.', () => {
    // Arrange
    const callback = jest.fn();

    // Act
    const { getByTestId } = render(
      <Component
        messages={['Message 1', 'Message 2', 'Message 3']}
        callback={callback}
      />
    );

    // Assert
    fireEvent.click(getByTestId('right-button'));
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);
  });
});
