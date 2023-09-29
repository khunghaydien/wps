import cloneDeep from 'lodash/cloneDeep';

import {
  convert,
  DailyObjectivelyEventLogRecord,
} from '../DailyObjectivelyEventLog';
import { defaultValue } from './mocks/DailyObjectivelyEventLog.mock';

describe('convert', () => {
  it('should do', async () => {
    const $defaultValue: DailyObjectivelyEventLogRecord[] =
      cloneDeep(defaultValue);
    // Overwrite boolean values because it can't be checked that converting is correct.
    $defaultValue[0].attRecord.attSummary.workingType.requireDeviationReason1 =
      'requireDeviationReason1' as unknown as boolean;
    $defaultValue[0].attRecord.attSummary.workingType.requireDeviationReason2 =
      'requireDeviationReason2' as unknown as boolean;
    $defaultValue[0].attRecord.attSummary.workingType.requireDeviationReason3 =
      'requireDeviationReason3' as unknown as boolean;
    expect(convert($defaultValue)).toMatchSnapshot();
  });
});
