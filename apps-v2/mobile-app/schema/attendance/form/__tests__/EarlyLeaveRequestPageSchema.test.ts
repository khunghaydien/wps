import schema from '../EarlyLeaveRequestPageSchema';
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
      reason: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      startTime: '',
      endTime: '',
      reason: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return error when data is not type.', async () => {
  await expect(
    validate({
      startDate: 0,
      startTime: 'abc',
      endTime: 'abc',
      reason: 0,
    })
  ).rejects.toMatchSnapshot();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      startTime: 0,
      endTime: 0,
      reason: 'abc',
    })
  ).resolves.toBeTruthy();
});
