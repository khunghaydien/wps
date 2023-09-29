import { Store } from 'redux';

import UseCases from '@attendance/timesheet-pc/UseCases';

export default (_: Store) => async (): Promise<void> => {
  await UseCases().fetchTimesheet();
};
