import {
  DailyObjectivelyEventLogDeviationReasons,
  DeviationReason,
} from '@attendance/domain/models/DailyObjectivelyEventLogDeviationReason';

const reasonList: DeviationReason[] = [
  {
    label: '地震',
    value: '100',
  },
  {
    label: '台風',
    value: '200',
  },
  {
    label: '晴雨',
    value: '300',
  },
];

const dailyDeviatedReasons: DailyObjectivelyEventLogDeviationReasons = {
  id: '002564ui89465',
  deviationReasons: new Map(reasonList?.map((value) => [value.value, value])),
};

export default dailyDeviatedReasons;
