import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import Component from '../Header';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Remove cell', () => {
  it.each`
    allowedEditLogs | readOnly | expected
    ${false}        | ${false} | ${'hidden'}
    ${false}        | ${true}  | ${'hidden'}
    ${true}         | ${false} | ${'display'}
    ${true}         | ${true}  | ${'hidden'}
  `(
    'should be $expected if [canEdit=$allowedEditLogs, readOnly=$readOnly].',
    ({ allowedEditLogs, readOnly, expected }) => {
      const props = {
        'data-testid': 'testid',
        allowedEditLogs,
        readOnly,
      };
      const { queryByTestId } = render(<Component {...props} />);
      if (expected === 'display') {
        expect(queryByTestId('testid-remove')).not.toBeNull();
      } else {
        expect(queryByTestId('testid-remove')).toBeNull();
      }
    }
  );
});
