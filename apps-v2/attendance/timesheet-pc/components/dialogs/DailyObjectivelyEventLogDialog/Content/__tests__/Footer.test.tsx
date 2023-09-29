import * as React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { act as actReact, fireEvent, render } from '@testing-library/react';
import { act as actHook, renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { setting } from '@attendance/domain/models/__tests__/mocks/ObjectivelyEventLog.mock';

import Component, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
} from '../Footer';
import objectivelyEventLogEventType, {
  EVENT_TYPE as OBJECTIVELY_EVENT_LOG_EVENT_TYPE,
} from '@attendance/ui/helpers/objectivelyEventLog/eventType';

const useEditor = __get__('useEditor');

document.getSelection = jest.fn();
document.createRange = () => ({
  setStart: (): void => {},
  setEnd: (): void => {},
  // @ts-ignore
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useEditor()', () => {
  it('should be initialize.', () => {
    // Act
    const hook = renderHook(() =>
      useEditor({
        sources: setting,
        submit: jest.fn(),
      })
    );

    // Assert
    expect(hook.result.current.sourceValue).toBe(undefined);
    expect(hook.result.current.timeValue).toBe('');
    expect(hook.result.current.eventType).toBe(undefined);
    expect(hook.result.current.sourceOptions).toEqual([
      {
        id: setting[0].id,
        value: setting[0].code,
        label: setting[0].name,
      },
      {
        id: setting[1].id,
        value: setting[1].code,
        label: setting[1].name,
      },
      {
        id: setting[2].id,
        value: setting[2].code,
        label: setting[2].name,
      },
    ]);
    expect(hook.result.current.eventTypeOptions).toEqual([
      {
        id: 'ENTERING',
        value: OBJECTIVELY_EVENT_LOG_EVENT_TYPE.ENTERING,
        label: objectivelyEventLogEventType(
          OBJECTIVELY_EVENT_LOG_EVENT_TYPE.ENTERING
        ),
      },
      {
        id: 'LEAVING',
        value: OBJECTIVELY_EVENT_LOG_EVENT_TYPE.LEAVING,
        label: objectivelyEventLogEventType(
          OBJECTIVELY_EVENT_LOG_EVENT_TYPE.LEAVING
        ),
      },
    ]);
    expect(hook.result.current.allowedSubmit).toBeFalsy();
  });

  describe('canEdit', () => {
    const emptyOption = {
      id: 'noting',
      value: '',
      label: 'Noting',
    };
    const sourceOption = {
      id: setting[0].id,
      value: setting[0].code,
      label: setting[0].name,
    };
    const eventTypeOption = {
      id: 'ENTERING',
      value: OBJECTIVELY_EVENT_LOG_EVENT_TYPE.ENTERING,
      label: objectivelyEventLogEventType(
        OBJECTIVELY_EVENT_LOG_EVENT_TYPE.ENTERING
      ),
    };

    it.each`
      source          | eventType          | time       | expected
      ${emptyOption}  | ${emptyOption}     | ${''}      | ${false}
      ${emptyOption}  | ${emptyOption}     | ${'00:00'} | ${false}
      ${emptyOption}  | ${eventTypeOption} | ${''}      | ${false}
      ${emptyOption}  | ${eventTypeOption} | ${'00:00'} | ${false}
      ${sourceOption} | ${emptyOption}     | ${''}      | ${false}
      ${sourceOption} | ${emptyOption}     | ${'00:00'} | ${false}
      ${sourceOption} | ${eventTypeOption} | ${''}      | ${false}
      ${sourceOption} | ${eventTypeOption} | ${'00:00'} | ${true}
    `(
      `should be $expected if [source=$source, eventType=$eventType, time=$time]`,
      ({ source, eventType, time, expected }) => {
        // Arrange
        const hook = renderHook(() =>
          useEditor({
            sources: setting,
            submit: jest.fn(),
          })
        );

        // Act
        actHook(() => {
          hook.result.current.setSourceValue(source);
          hook.result.current.setEventTypeValue(eventType);
          hook.result.current.setTimeValue(time);
        });

        // Assert
        expect(hook.result.current.allowedSubmit).toBe(expected);
      }
    );
  });
});

describe('View', () => {
  const testid = 'testid';

  const selector = {
    selectItem: (root: string, idx: number) => `${root}__item-${idx}`,
    selectSource: `${testid}-source-select`,
    selectSourceItem: (idx: number) =>
      selector.selectItem(selector.selectSource, idx),
    selectEventType: `${testid}-event-type-select`,
    selectEventTypeItem: (idx: number) =>
      selector.selectItem(selector.selectEventType, idx),
    inputTime: `${testid}-time-input`,
    submitButton: `${testid}-submit-button`,
  };

  const defaultProps = {
    'data-testid': testid,
    sources: setting,
    readOnly: false,
    loading: false,
    submit: jest.fn(),
  };

  describe('Submit button', () => {
    describe('input', () => {
      it('should be disable if no input.', () => {
        const props = {
          ...defaultProps,
        };
        const { getByTestId } = render(<Component {...props} />);

        expect(getByTestId(selector.submitButton)).toBeDisabled();
      });

      it('should be enable if it has input.', async () => {
        // Arrange
        const props = {
          ...defaultProps,
        };

        // Act
        const { getByTestId } = render(<Component {...props} />);

        // Assert
        await actReact(() =>
          userEvent.click(getByTestId(selector.selectSource))
        );
        await actReact(() =>
          userEvent.click(getByTestId(selector.selectSourceItem(0)))
        );
        expect(getByTestId(selector.submitButton)).toBeDisabled();
        await actReact(() =>
          userEvent.click(getByTestId(selector.selectEventType))
        );
        await actReact(() =>
          userEvent.click(getByTestId(selector.selectEventTypeItem(0)))
        );
        expect(getByTestId(selector.submitButton)).toBeDisabled();
        await actReact(() =>
          userEvent.type(getByTestId(selector.inputTime), '00:00')
        );
        await actReact(() => {
          fireEvent.focusOut(getByTestId(selector.inputTime));
        });
        expect(getByTestId(selector.submitButton)).toBeEnabled();
      });
    });

    describe('disabled', () => {
      it.each`
        allowedSubmit | loading  | readOnly | disabled
        ${false}      | ${false} | ${false} | ${true}
        ${false}      | ${false} | ${true}  | ${true}
        ${false}      | ${true}  | ${false} | ${true}
        ${false}      | ${true}  | ${true}  | ${true}
        ${true}       | ${false} | ${false} | ${false}
        ${true}       | ${false} | ${true}  | ${true}
        ${true}       | ${true}  | ${false} | ${true}
        ${true}       | ${true}  | ${true}  | ${true}
      `(
        'should be $disabled if [allowedSubmit=$allowedSubmit, loading=$loading, readOnly=$readOnly].',
        ({ allowedSubmit, loading, readOnly, disabled }) => {
          // Arrange
          const props = {
            ...defaultProps,
            loading,
            readOnly,
          };
          const mockUseEditor = jest.fn(useEditor);
          __set__('useEditor', mockUseEditor);

          // Act
          const { getByTestId } = render(<Component {...props} />);
          const {
            sourceOptions,
            eventTypeOptions,
            setSourceValue,
            setEventTypeValue,
            setTimeValue,
          } = mockUseEditor.mock.results[0].value;
          if (allowedSubmit) {
            actReact(() => {
              setSourceValue(sourceOptions[0]);
              setEventTypeValue(eventTypeOptions[0]);
              setTimeValue('00:00');
            });
          }

          if (disabled) {
            expect(getByTestId(selector.submitButton)).toBeDisabled();
          } else {
            expect(getByTestId(selector.submitButton)).toBeEnabled();
          }
        }
      );
    });
  });
});
