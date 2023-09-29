import { SUBSTITUTE_LEAVE_TYPE } from '@apps/domain/models/attendance/SubstituteLeaveType';

import schema from '../HolidayWorkRequestPageSchema';
import { create } from './helpers/errors';

const validate = create(schema);

it('return error when data is empty.', async () => {
  await expect(validate({})).rejects.toMatchSnapshot();
});

it('return error when data is null.', async () => {
  await expect(
    validate({
      startDate: null,
      startTime: null,
      endTime: null,
      substituteLeaveType: null,
      substituteDate: null,
      remarks: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      startTime: '',
      endTime: '',
      substituteLeaveType: '',
      substituteDate: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return error when substituteDate is null.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      startTime: 0,
      endTime: 0,
      substituteLeaveType: SUBSTITUTE_LEAVE_TYPE.Substitute,
      substituteDate: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return true when data is not type.', async () => {
  await expect(
    validate({
      startDate: 0,
      startTime: 'abc',
      endTime: 'abc',
      substituteLeaveType: 0,
      substituteDate: 0,
      remarks: 0,
    })
  ).resolves.toBeTruthy();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      startTime: 0,
      endTime: 0,
      substituteLeaveType: 'abc',
      substituteDate: 'abc',
      remarks: 'abc',
    })
  ).resolves.toBeTruthy();
});
