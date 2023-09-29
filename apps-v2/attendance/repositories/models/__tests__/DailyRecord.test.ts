import * as DailyRecord from '../DailyRecord';
import { defaultValue } from './mocks/Timesheet.mock';
import * as DailyRecordService from '@attendance/domain/services/DailyRecordService';

jest.mock('@attendance/domain/services/DailyRecordService', () => ({
  isRequiredInput: jest.fn(),
  isEditable: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('convert', () => {
  it('should be convert', () => {
    (
      DailyRecordService.isRequiredInput as unknown as jest.Mock
    ).mockReturnValue(false);
    (DailyRecordService.isEditable as unknown as jest.Mock).mockReturnValue(
      false
    );
    expect(
      DailyRecord.convert(defaultValue.records[0], defaultValue, {})
    ).toMatchSnapshot();
  });
});

describe('isRequiredInput', () => {
  it('should be false if record is not found.', () => {
    expect(
      DailyRecord.isRequiredInput('2022-02-01', {
        records: [],
      } as unknown as Parameters<typeof DailyRecord['isRequiredInput']>[1])
    ).toBe(false);
  });
  it('should do DomainDailyRecordService.isRequestedInput() if record is found', () => {
    (
      DailyRecordService.isRequiredInput as unknown as jest.Mock
    ).mockReturnValue('return');

    const result = DailyRecord.isRequiredInput('2022-02-01', {
      records: [
        {
          recordDate: '2022-02-01',
          dayType: DailyRecord.DAY_TYPE.Workday,
          isLeaveOfAbsence: false,
          requestIds: ['requestId'],
        },
      ],
      requests: {
        requestId: 'record',
      },
    } as unknown as Parameters<typeof DailyRecord['isRequiredInput']>[1]);

    expect(result).toBe('return');
    expect(DailyRecordService.isRequiredInput).toBeCalledTimes(1);
    expect(DailyRecordService.isRequiredInput).toBeCalledWith({
      recordDate: '2022-02-01',
      dayType: DailyRecord.DAY_TYPE.Workday,
      isLeaveOfAbsence: false,
      requests: ['record'],
    });
  });
});

describe('isEditable', () => {
  it('should be false if record is not found.', () => {
    expect(
      DailyRecord.isEditable(
        '2022-02-01',
        {
          records: [],
        } as unknown as Parameters<typeof DailyRecord['isEditable']>[1],
        true
      )
    ).toBe(false);
  });
  it('should be true if record is found', () => {
    (DailyRecordService.isEditable as unknown as jest.Mock).mockReturnValue(
      'return'
    );
    const result = DailyRecord.isEditable(
      '2022-02-01',
      {
        records: [
          {
            recordDate: '2022-02-01',
            startTime: 1,
            endTime: 2,
            isLocked: 'lockedDailyRecord',
          },
        ],
        workingTypeList: [
          {
            startDate: '2022-02-01',
            endDate: '2022-02-28',
            useFixDailyRequest: true,
          },
        ],
        isLocked: 'lockedTimesheet',
      } as unknown as Parameters<typeof DailyRecord['isEditable']>[1],
      'requiredInput' as unknown as boolean
    );
    expect(result).toBe('return');
    expect(DailyRecordService.isEditable).toBeCalledTimes(1);
    expect(DailyRecordService.isEditable).toBeCalledWith({
      lockedTimesheet: 'lockedTimesheet',
      lockedDailyRecord: 'lockedDailyRecord',
      startTime: 1,
      endTime: 2,
      requiredInput: 'requiredInput',
    });
  });
});
