import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import ArrowLeft from '../../assets/icons/arrow-left.svg';
import IconButton from '../IconButton';

describe('IconButton', () => {
  const testId = 'icon-button';
  const props = {
    icon: ArrowLeft,
    onClick: jest.fn(),
    'data-testid': testId,
  };
  it('should fire only once when the Icon is clicked', () => {
    // Arrange
    const { getByTestId } = render(<IconButton {...props} />);

    // Act
    const target = getByTestId(`${testId}__icon`);
    fireEvent.click(target);

    // Assert
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
