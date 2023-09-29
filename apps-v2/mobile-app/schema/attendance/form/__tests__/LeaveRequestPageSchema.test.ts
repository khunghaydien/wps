import { LEAVE_RANGE } from '@attendance/domain/models/LeaveRange';

import schema from '../LeaveRequestPageSchema';
import { create } from './helpers/errors';

const validate = create(schema);

it('return error when data is empty.', async () => {
  await expect(validate({})).rejects.toMatchSnapshot();
});

it('return error when data is null.', async () => {
  await expect(
    validate({
      leaveCode: null,
      leaveRange: null,
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      remarks: null,
      requireReason: false,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      leaveCode: '',
      leaveRange: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      remarks: '',
      requireReason: false,
    })
  ).rejects.toMatchSnapshot();
});

describe('[requireReason=true]', () => {
  it('return error when reason is null.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Day,
        startDate: 'abc',
        endDate: 'abc',
        reason: null,
        requireReason: true,
      })
    ).rejects.toMatchSnapshot();
  });

  it('return true when reason is edited.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Day,
        startDate: 'abc',
        endDate: 'abc',
        reason: 'abc',
        requireReason: true,
      })
    ).resolves.toBeTruthy();
  });
});

describe('[leaveRange=Day]', () => {
  it('return error when endDate is null.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Day,
        startDate: 'abc',
        endDate: null,
        remarks: null,
        requireReason: false,
      })
    ).rejects.toMatchSnapshot();
  });
  it('return true.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Day,
        startDate: 'abc',
        endDate: 'abc',
        remarks: 'abc',
        requireReason: false,
      })
    ).resolves.toBeTruthy();
  });
});

describe('[LeaveRange=Time]', () => {
  it('return error when startTime is null.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Time,
        startDate: 'abc',
        startTime: 0,
        endTime: null,
        remarks: null,
        requireReason: false,
      })
    ).rejects.toMatchSnapshot();
  });
  it('return error when endTime is null.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Time,
        startDate: 'abc',
        startTime: null,
        endTime: 0,
        remarks: null,
        requireReason: false,
      })
    ).rejects.toMatchSnapshot();
  });
  it('return true.', async () => {
    await expect(
      validate({
        leaveCode: 'abc',
        leaveRange: LEAVE_RANGE.Time,
        startDate: 'abc',
        endDate: 'abc',
        startTime: 0,
        endTime: 0,
        remarks: 'abc',
        requireReason: false,
      })
    ).resolves.toBeTruthy();
  });
});

it('return true if leaveRange is AM and have not startTime and endTime.', async () => {
  await expect(
    validate({
      leaveCode: 'abc',
      leaveRange: LEAVE_RANGE.AM,
      startDate: 'abc',
      remarks: 'abc',
      requireReason: false,
    })
  ).resolves.toBeTruthy();
});

it('return true if leaveRange is PM and have not startTime and endTime.', async () => {
  await expect(
    validate({
      leaveCode: 'abc',
      leaveRange: LEAVE_RANGE.PM,
      startDate: 'abc',
      remarks: 'abc',
      requireReason: false,
    })
  ).resolves.toBeTruthy();
});

it('return true if leaveRange is Half and have not startTime and endTime.', async () => {
  await expect(
    validate({
      leaveCode: 'abc',
      leaveRange: LEAVE_RANGE.Half,
      startDate: 'abc',
      remarks: 'abc',
      requireReason: false,
    })
  ).resolves.toBeTruthy();
});
