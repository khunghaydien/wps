import schema from '../PatternRequestPageSchema';
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
      patternCode: null,
      remarks: null,
    })
  ).rejects.toMatchSnapshot();
});

it("return error when data is ''.", async () => {
  await expect(
    validate({
      startDate: '',
      endDate: '',
      patternCode: '',
      remarks: '',
    })
  ).rejects.toMatchSnapshot();
});

it('return true when data is not type.', async () => {
  await expect(
    validate({
      startDate: 0,
      endDate: 0,
      patternCode: 0,
      remarks: 0,
    })
  ).resolves.toBeTruthy();
});

it('return true.', async () => {
  await expect(
    validate({
      startDate: 'abc',
      endDate: 'abc',
      patternCode: 'abc',
      remarks: 'abc',
    })
  ).resolves.toBeTruthy();
});
