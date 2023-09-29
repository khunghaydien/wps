import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import { ACTIONS_FOR_FIX } from '@attendance/domain/models/AttFixSummaryRequest';

import Component, { ROOT } from '../Footer';

describe('default()', () => {
  it('should be null.', () => {
    // Act
    const { container } = render(
      <Component
        comment={'Comment'}
        performableActionForFix={ACTIONS_FOR_FIX.None}
        onChangeComment={() => {}}
        onClickSendAttendanceRequest={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toBe(null);
  });

  it('should be Submit button.', () => {
    // Act
    const { container } = render(
      <Component
        comment={'Comment'}
        performableActionForFix={ACTIONS_FOR_FIX.Submit}
        onChangeComment={() => {}}
        onClickSendAttendanceRequest={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should be CancelRequest button.', () => {
    // Act
    const { container } = render(
      <Component
        comment={'Comment'}
        performableActionForFix={ACTIONS_FOR_FIX.CancelRequest}
        onChangeComment={() => {}}
        onClickSendAttendanceRequest={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should be CancelApproval button.', () => {
    // Act
    const { container } = render(
      <Component
        comment={'Comment'}
        performableActionForFix={ACTIONS_FOR_FIX.CancelApproval}
        onChangeComment={() => {}}
        onClickSendAttendanceRequest={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should change rows when focus.', () => {
    // Act
    const { getByTestId } = render(
      <Component
        comment={'Comment'}
        performableActionForFix={ACTIONS_FOR_FIX.Submit}
        onChangeComment={() => {}}
        onClickSendAttendanceRequest={() => {}}
      />
    );

    // Assert
    const commentElement = getByTestId(`${ROOT}_comment`);
    expect(commentElement).toHaveAttribute('rows', '1');
    fireEvent.focusIn(commentElement);
    expect(commentElement).toHaveAttribute('rows', '2');
    fireEvent.focusOut(commentElement);
    expect(commentElement).toHaveAttribute('rows', '1');
  });
});
