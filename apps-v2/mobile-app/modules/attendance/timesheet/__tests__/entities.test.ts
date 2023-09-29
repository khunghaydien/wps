import snapshotDiff from 'snapshot-diff';

import { convert as createFromRemote } from '@attendance/repositories/models/Timesheet';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';
import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';
import { LEAVE_TYPE } from '@attendance/domain/models/LeaveType';

import reducer, {
  // @ts-ignore
  // eslint-disable-next-line  import/named
  __get__,
  ROW_TYPE,
} from '../entities';
import timesheetFromRemote from './mocks/timesheet';

const determineRowType = __get__('determineRowType');
const initialState = __get__('initialState');
const ACTION_TYPES = __get__('ACTION_TYPES');

describe('mobile-app/modules/attendance/timesheet/entities', () => {
  describe('reducer()', () => {
    test('@@INIT', () => {
      // @ts-ignore
      const next = reducer(undefined, { type: '@@INIT' });
      expect(snapshotDiff({}, next)).toMatchSnapshot();
    });
    test(ACTION_TYPES.FETCH_SUCCESS, () => {
      // Arrange
      const fetchResult = createFromRemote(timesheetFromRemote);
      const prev = initialState;
      // Execute
      const next = reducer(undefined, {
        type: ACTION_TYPES.FETCH_SUCCESS,
        payload: fetchResult,
      });
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    test(ACTION_TYPES.CLEAR, () => {
      // Arrange
      const prev = initialState;
      // Execute
      const next = reducer(undefined, { type: ACTION_TYPES.CLEAR });
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });
  describe('determineRowType()', () => {
    test('休職休業', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: true,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_UNPAID_LEAVE);
    });
    test('休職休業中の就業', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: true,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      const requests = [
        {
          requestTypeCode: CODE.Pattern,
          status: STATUS.APPROVED,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests,
        requests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.WORKDAY);
    });
    test('法定休日', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.LegalHoliday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.LEGAL_HOLIDAY);
    });
    test('所定休日', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Holiday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.HOLIDAY);
    });
    test('優先法定休日', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.PreferredLegalHoliday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.HOLIDAY);
    });
    test('法定休日自動判定', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Holiday,
        isLeaveOfAbsence: false,
        isHolLegalHoliday: true,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.LEGAL_HOLIDAY);
    });
    test('欠勤(休暇なし)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = true;
      const leaveRequests = [];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_UNPAID_LEAVE);
    });
    test('欠勤+午後有給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = true;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE);
    });
    test('欠勤+午前有給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = true;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.AM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE);
    });
    test('欠勤+無給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = true;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.AM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_UNPAID_LEAVE);
    });
    test('年次有給休暇(終日)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Annual,
          leaveRange: LEAVE_RANGE.Day,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_PAID_LEAVE);
    });
    test('代休(終日)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Compensatory,
          leaveRange: LEAVE_RANGE.Day,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_PAID_LEAVE);
    });
    test('有給休暇(終日)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Day,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_PAID_LEAVE);
    });
    test('無給休暇(終日)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Day,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_UNPAID_LEAVE);
    });
    test('午前有給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.AM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('午後有給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.PM_PAID_LEAVE);
    });
    test('午前無給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.AM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_UNPAID_LEAVE);
    });
    test('午後無給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.PM_UNPAID_LEAVE);
    });
    test('午前有給休暇+午後無給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.AM,
        },
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE_PM_UNPAID_LEAVE);
    });
    test('午前無給休暇+午後有給休暇', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.AM,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_UNPAID_LEAVE_PM_PAID_LEAVE);
    });
    test('半日休x1', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Half,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('半日休x2(有給・無給が同じ)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Half,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Half,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_PAID_LEAVE);
    });
    test('半日休x2(有給・無給が異なる)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Half,
        },
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Half,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.ALL_DAY_PAID_LEAVE); // 休暇1の種別に従う
    });
    test('有給の時間単位休', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Time,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('無給の時間単位休', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Time,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_UNPAID_LEAVE);
    });
    test('午前半休+時間単位休', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Time,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.AM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('午後半休+時間単位休', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Time,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.PM,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.PM_PAID_LEAVE);
    });
    test('半日休+時間単位休', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Time,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Half,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('時間単位休(有給・無給が同じ)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Time,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Time,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_PAID_LEAVE);
    });
    test('時間単位休(有給・無給が異なる)', () => {
      // Arrange
      const record = {
        dayType: DAY_TYPE.Workday,
        isLeaveOfAbsence: false,
      };
      const hasAbsenceRequest = false;
      const leaveRequests = [
        {
          leaveType: LEAVE_TYPE.Unpaid,
          leaveRange: LEAVE_RANGE.Time,
        },
        {
          leaveType: LEAVE_TYPE.Paid,
          leaveRange: LEAVE_RANGE.Time,
        },
      ];
      // Execute
      const rowType = determineRowType(
        record,
        hasAbsenceRequest,
        leaveRequests
      );
      // Assert
      expect(rowType).toBe(ROW_TYPE.AM_UNPAID_LEAVE);
    });
  });
});
