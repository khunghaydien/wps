import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  defaultValue as dummyObjectivelyEventLog,
  setting as sources,
} from '@attendance/domain/models/__tests__/mocks/ObjectivelyEventLog.mock';

import Component from '../index';

document.getSelection = jest.fn();

const testid = 'testid';

const defaultValue: React.ComponentProps<typeof Component> = {
  'data-testid': testid,
  readOnly: false,
  loading: false,
  sources,
  records: dummyObjectivelyEventLog,
  allowedEditLogs: false,
  allowedSetToApplied: false,
  onCheckRecord: jest.fn(),
  onClickAdd: jest.fn(),
  onClickRemove: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ContentItem', () => {
  describe('SyncCell', () => {
    it('should call onCheckRecord', async () => {
      // Arrange
      const props = {
        ...defaultValue,
        allowedSetToApplied: true,
        records: [
          {
            ...dummyObjectivelyEventLog[0],
            isApplied: false,
          },
        ],
      };
      const { getByTestId } = render(<Component {...props} />);
      const $testid = `${testid}-content-item__${props.records[0].id}-sync-cell-checkbox`;

      // Act
      await act(async () => userEvent.click(getByTestId($testid)));

      // Assert
      expect(props.onCheckRecord).toBeCalledTimes(1);
      expect(props.onCheckRecord).toBeCalledWith(
        dummyObjectivelyEventLog[0].id
      );
    });
  });
  describe('RemoveCell', () => {
    it('should call onClickRemove', async () => {
      // Arrange
      const props = {
        ...defaultValue,
        allowedEditLogs: true,
      };
      const { getByTestId } = render(<Component {...props} />);
      const $testid = `${testid}-content-item__${props.records[0].id}-remove-cell-icon-button`;

      // Act
      await act(async () => userEvent.click(getByTestId($testid)));

      // Assert
      expect(props.onClickRemove).toBeCalledTimes(1);
      expect(props.onClickRemove).toBeCalledWith(props.records[0].id);
    });

    describe('display', () => {
      it.each`
        allowedEditLogs | enabled
        ${false}        | ${false}
        ${true}         | ${true}
      `(
        'should be $enabled if [allowedEditLogs=$allowedEditLogs, readOnly=$readOnly].',
        ({ allowedEditLogs, readOnly, enabled }) => {
          const props = {
            ...defaultValue,
            allowedEditLogs,
            readOnly,
          };
          const { queryByTestId } = render(<Component {...props} />);
          const $testid = `${testid}-content-item__${props.records[0].id}-remove-cell`;
          if (enabled) {
            expect(queryByTestId($testid)).not.toBeNull();
          } else {
            expect(queryByTestId($testid)).toBeNull();
          }
        }
      );
    });
  });
});

describe('Footer', () => {
  describe('display', () => {
    it.each`
      allowedEditLogs | readOnly | enabled
      ${false}        | ${false} | ${false}
      ${false}        | ${true}  | ${false}
      ${true}         | ${false} | ${true}
      ${true}         | ${true}  | ${false}
    `(
      'should be $enabled if [allowedEditLogs=$allowedEditLogs, readOnly=$readOnly].',
      ({ allowedEditLogs, readOnly, enabled }) => {
        const props = {
          ...defaultValue,
          allowedEditLogs,
          readOnly,
        };
        const { queryByTestId } = render(<Component {...props} />);
        if (enabled) {
          expect(queryByTestId(`${testid}-footer`)).not.toBeNull();
        } else {
          expect(queryByTestId(`${testid}-footer`)).toBeNull();
        }
      }
    );
  });
});
