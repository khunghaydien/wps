import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import RecordAccessBatchExecutionSetting from '@apps/admin-pc-v2/components/RecordAccess/RecordAccessBatchExecutionSetting';

const { FIELD_HIDDEN, FIELD_CUSTOM } = fieldType;

const base: ConfigList = [
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'recordAccessBatchExecutionSetting',
    props: 'tmpEditRecord',
    noLabel: true,
    type: FIELD_CUSTOM,
    Component: RecordAccessBatchExecutionSetting,
    enableMode: [''],
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
