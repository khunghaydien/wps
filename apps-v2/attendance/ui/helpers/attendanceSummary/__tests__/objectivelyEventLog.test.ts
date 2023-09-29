import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import { label } from '../objectivelyEventLog';

describe('objectivelyEventLog', () => {
  const settingName = 'IN/OUT';
  it.each`
    record                                          | allowingDeviationTime | expected
    ${{}}                                           | ${null}               | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: null }}                                 | ${null}               | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: '' }}                                   | ${null}               | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: 'abc', deviatedTime: 10, time: 540 }}   | ${null}               | ${`${settingName} 09:00`}
    ${{ id: 'abc', deviatedTime: -10, time: 540 }}  | ${null}               | ${`${settingName} 09:00`}
    ${{ id: 'abc', deviatedTime: 0, time: 540 }}    | ${null}               | ${`${settingName} 09:00`}
    ${{ id: 'abc', deviatedTime: null, time: 540 }} | ${null}               | ${`${settingName} 09:00`}
    ${{ id: 'abc', time: 540 }}                     | ${null}               | ${`${settingName} 09:00`}
    ${{}}                                           | ${5}                  | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: null }}                                 | ${5}                  | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: '' }}                                   | ${5}                  | ${TextUtil.template(msg().Att_Lbl_NoDeviatedData, settingName)}
    ${{ id: 'abc', deviatedTime: 10, time: 540 }}   | ${5}                  | ${TextUtil.template(msg().Att_Lbl_DeviatedTime, settingName, '09:00', '10')}
    ${{ id: 'abc', deviatedTime: -10, time: 540 }}  | ${5}                  | ${TextUtil.template(msg().Att_Lbl_DeviatedTime, settingName, '09:00', '10')}
    ${{ id: 'abc', deviatedTime: 0, time: 540 }}    | ${5}                  | ${`${settingName} 09:00`}
    ${{ id: 'abc', deviatedTime: null, time: 540 }} | ${5}                  | ${`${settingName} 09:00`}
    ${{ id: 'abc', time: 540 }}                     | ${5}                  | ${`${settingName} 09:00`}
  `(
    'should be return "$expected"',
    ({ record, allowingDeviationTime, expected }) => {
      expect(
        label(
          settingName,
          record as unknown as Parameters<typeof label>[1],
          allowingDeviationTime
        )
      ).toBe(expected);
    }
  );
});
