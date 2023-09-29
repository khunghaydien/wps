import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import Component from '../VariableRowsTextArea';

describe('default()', () => {
  it('should change rows when focus.', () => {
    // Act
    const { getByTestId } = render(<Component testId="text-area" />);

    // Assert
    const commentElement = getByTestId(`text-area`);
    expect(commentElement).toHaveAttribute('rows', '1');
    fireEvent.focusIn(commentElement);
    expect(commentElement).toHaveAttribute('rows', '2');
    fireEvent.focusOut(commentElement);
    expect(commentElement).toHaveAttribute('rows', '1');
  });

  it('should change specified rows when focus.', () => {
    // Act
    const { getByTestId } = render(
      <Component testId="text-area" rows={2} variableRows={3} />
    );

    // Assert
    const commentElement = getByTestId(`text-area`);
    expect(commentElement).toHaveAttribute('rows', '2');
    fireEvent.focusIn(commentElement);
    expect(commentElement).toHaveAttribute('rows', '3');
    fireEvent.focusOut(commentElement);
    expect(commentElement).toHaveAttribute('rows', '2');
  });
});
