import cloneDeep from 'lodash/cloneDeep';

import { ACTIONS_FOR_FIX } from '@attendance/domain/models/FixDailyRequest';

import * as actions from '../actions';

import * as methods from '../HeaderContainer';
import * as helpers from '../helpers';

jest.mock('../actions', () => ({
  __esModules: true,
  saveAndSubmitFixDailyRequest: jest.fn(),
  submitRequest: jest.fn(),
  cancelApproval: jest.fn(),
  cancelRequest: jest.fn(),
}));

jest.mock('../helpers', () => {
  const helpers = jest.requireActual('../helpers');
  return {
    __esModules: true,
    ...helpers,
    isChange: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('methods', () => {
  describe('submitRequest', () => {
    // Arrange
    const base = {
      fixDailyRequest: {
        id: 'id',
      },
      dailyAttTime: {
        recordId: 'recordId',
        recordDate: 'recordDate',
        startTime: 'startTime',
        endTime: 'endTime',
        restTimes: [
          {
            startTime: 'startTime',
            endTime: 'endTime',
            restReason: 'restReason',
          },
        ],
        restHours: 'restHours',
        otherRestReason: 'otherRestReason',
        commuteCount: 'commuteCount',
        dailyObjectivelyEventLog: 'dailyObjectivelyEventLog',
        remarks: 'remarks',
      },
      attRecord: {
        remarks: '',
      },
      dailyObjectivelyEventLog: 'dailyObjectivelyEventLog',
      employeeId: 'employeeId',
      dailyRequestSummary: 'dailyRequestSummary',
    } as unknown as Parameters<typeof methods['submitRequest']>[0];

    describe('allowedEditDailyRecord', () => {
      describe.each([true, false])(
        'allowedEditDailyRecord is %s',
        (allowedEditDailyRecord) => {
          // Arrange
          const input = {
            ...base,
            allowedEditDailyRecord,
          } as unknown as Parameters<typeof methods['submitRequest']>[0];

          it(`should execute when [performableActionForFix=${ACTIONS_FOR_FIX.None}] `, async () => {
            // Arrange
            const $input = cloneDeep(input);
            $input.fixDailyRequest.performableActionForFix =
              ACTIONS_FOR_FIX.None;

            // Act
            const result = await methods.submitRequest($input);

            // Assert
            expect(result).toBe(undefined);
            expect(actions.saveAndSubmitFixDailyRequest).toBeCalledTimes(0);
            expect(actions.submitRequest).toBeCalledTimes(0);
            expect(actions.cancelApproval).toBeCalledTimes(0);
            expect(actions.cancelRequest).toBeCalledTimes(0);
          });

          it(`should execute when [performableActionForFix=${ACTIONS_FOR_FIX.Submit}] `, async () => {
            // Arrange
            const $input = cloneDeep(input);
            $input.fixDailyRequest.performableActionForFix =
              ACTIONS_FOR_FIX.Submit;
            (helpers.isChange as unknown as jest.Mock).mockReturnValue(true);

            // Act
            const result = await methods.submitRequest($input);

            // Assert
            expect(result).toBe(undefined);
            if (allowedEditDailyRecord) {
              expect(actions.saveAndSubmitFixDailyRequest).toBeCalledTimes(1);
              expect(actions.submitRequest).toBeCalledTimes(0);
              expect(actions.saveAndSubmitFixDailyRequest).toBeCalledWith({
                dailyRecord: {
                  employeeId: 'employeeId',
                  endTime: 'endTime',
                  otherRestReason: 'otherRestReason',
                  objectivelyEventLog: 'dailyObjectivelyEventLog',
                  recordDate: 'recordDate',
                  recordId: 'recordId',
                  restHours: 'restHours',
                  restTimes: [
                    {
                      startTime: 'startTime',
                      endTime: 'endTime',
                      restReason: 'restReason',
                    },
                  ],
                  commuteCount: 'commuteCount',
                  remarks: 'remarks',
                  startTime: 'startTime',
                },
                dailyRequestSummary: 'dailyRequestSummary',
              });
            } else {
              expect(actions.saveAndSubmitFixDailyRequest).toBeCalledTimes(0);
              expect(actions.submitRequest).toBeCalledTimes(1);
              expect(actions.submitRequest).toBeCalledWith({
                id: 'recordId',
                dailyRequestSummary: 'dailyRequestSummary',
              });
            }
          });

          it.each([
            [ACTIONS_FOR_FIX.CancelApproval, actions.cancelApproval],
            [ACTIONS_FOR_FIX.CancelRequest, actions.cancelRequest],
          ])(
            'should execute when [performableActionForFix=%s] ',
            async (performableActionForFix, actionMethod) => {
              // Arrange
              const $input = cloneDeep(input);
              $input.fixDailyRequest.performableActionForFix =
                performableActionForFix;

              // Act
              const result = await methods.submitRequest($input);

              // Assert
              expect(result).toBe(undefined);
              expect(actionMethod).toBeCalledTimes(1);
              expect(actionMethod).toBeCalledWith('id');
            }
          );
        }
      );
    });

    describe('isChange', () => {
      it('should execute saveAndSubmitFixDailyRequest when changing', async () => {
        // Arrange
        const $input = cloneDeep(base);
        $input.allowedEditDailyRecord = true;
        $input.fixDailyRequest.performableActionForFix = ACTIONS_FOR_FIX.Submit;
        (helpers.isChange as unknown as jest.Mock).mockReturnValue(true);

        // Act
        const result = await methods.submitRequest($input);

        // Assert
        expect(result).toBe(undefined);
        expect(actions.saveAndSubmitFixDailyRequest).toBeCalledTimes(1);
        expect(actions.saveAndSubmitFixDailyRequest).toBeCalledWith({
          dailyRecord: {
            employeeId: 'employeeId',
            endTime: 'endTime',
            otherRestReason: 'otherRestReason',
            objectivelyEventLog: 'dailyObjectivelyEventLog',
            recordDate: 'recordDate',
            recordId: 'recordId',
            restHours: 'restHours',
            restTimes: [
              {
                startTime: 'startTime',
                endTime: 'endTime',
                restReason: 'restReason',
              },
            ],
            commuteCount: 'commuteCount',
            remarks: 'remarks',
            startTime: 'startTime',
          },
          dailyRequestSummary: 'dailyRequestSummary',
        });
      });
      it('should execute submit when not changing', async () => {
        // Arrange
        const $input = cloneDeep(base);
        $input.allowedEditDailyRecord = true;
        $input.fixDailyRequest.performableActionForFix = ACTIONS_FOR_FIX.Submit;
        (helpers.isChange as unknown as jest.Mock).mockReturnValue(false);

        // Act
        const result = await methods.submitRequest($input);

        // Assert
        expect(result).toBe(undefined);
        expect(actions.submitRequest).toBeCalledTimes(1);
        expect(actions.submitRequest).toBeCalledWith({
          id: 'recordId',
          dailyRequestSummary: 'dailyRequestSummary',
        });
      });
    });
  });
});
