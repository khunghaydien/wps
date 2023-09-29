import schema from '../DirectRequestPageSchema';
import { create } from './helpers/errors';

const validate = create(schema);

it('return error when data is empty.', async () => {
  await expect(validate({})).rejects.toMatchSnapshot();
});

it('return error when data is null.', async () => {
  await expect(
    validate({
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      remarks: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return error when data is not type.', async () => {
  await expect(
    validate({
      startDate: 100,
      endDate: 100,
      startTime: 'abc',
      endTime: 'abc',
      remarks: 100,
    })
  ).rejects.toMatchSnapshot();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      endDate: 'abc',
      startTime: 0,
      endTime: 0,
      remarks: '',
    })
  ).resolves.toBeTruthy();
});
