import schema from '../AbsenceRequestPageSchema';
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
      reason: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      endDate: '',
      reason: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return true when data is not type.', async () => {
  await expect(
    validate({
      startDate: 100,
      endDate: 100,
      reason: 100,
    })
  ).resolves.toBeTruthy();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      endDate: 'abc',
      reason: 'abc',
    })
  ).resolves.toBeTruthy();
});
