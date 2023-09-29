import { convert } from '../Timesheet';
import { defaultValue } from './mocks/Timesheet.mock';

describe('convert', () => {
  it('should be convert', () => {
    expect(convert(defaultValue)).toMatchSnapshot();
  });
});
