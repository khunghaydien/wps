import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import ExternalCalenderAccess from '../../presentational-components/PlannerSetting/ExternalCalenderAccess';

import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_CUSTOM } = fieldType;

const base: ConfigList = [
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    section: 'CalendarAccess',
    msgkey: 'Admin_Lbl_CalendarAccess',
    descriptionKey: 'Admin_Msg_CalendarAccessExplanation',
    isExpandable: true,
    configList: [
      {
        key: 'externalCalenderAccessMap',
        noLabel: true,
        type: FIELD_CUSTOM,
        Component: ExternalCalenderAccess,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
