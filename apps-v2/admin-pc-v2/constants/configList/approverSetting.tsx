import React from 'react';

import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';

import TextField from '@commons/components/fields/TextField';
import msg from '@commons/languages';

import {
  APPROVER_OPTION_LABELS,
  REQUEST_TYPE_LABELS,
} from '@admin-pc-v2/models/approverSetting';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

const { FIELD_CUSTOM, FIELD_HIDDEN, FIELD_SELECT } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

export const ROOT = 'approver-setting';

const approverOptions = Object.keys(APPROVER_OPTION_LABELS).map((key) => ({
  msgkey: APPROVER_OPTION_LABELS[key],
  value: key,
}));

const base: ConfigList = [
  {
    key: 'id',
    type: FIELD_HIDDEN,
  },
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'requestTypeLabel',
    msgkey: 'Appr_Lbl_RequestType',
    display: DISPLAY_LIST,
  },
  {
    key: 'requestType',
    msgkey: 'Appr_Lbl_RequestType',
    type: FIELD_CUSTOM,
    display: DISPLAY_DETAIL,
    Component: ({ baseValueGetter }) => (
      <TextField
        disabled
        value={msg()[REQUEST_TYPE_LABELS[baseValueGetter('requestType')]]}
      />
    ),
  },
  {
    section: 'ApproverMapping',
    msgkey: 'Admin_Lbl_ApproverMapping',
    configList: [
      {
        key: 'labels',
        msgkey: 'Admin_Lbl_RequestField',
        type: FIELD_CUSTOM,
        display: DISPLAY_DETAIL,
        class: `${ROOT}__request-field`,
        Component: () => (
          <span className={`${ROOT}__mapping-source`}>
            {msg().Admin_Lbl_MappingSource}
          </span>
        ),
      },
      {
        key: 'approver01',
        msgkey: 'Admin_Lbl_Approver01Name',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        options: approverOptions,
      },
      {
        key: 'approver02',
        msgkey: 'Admin_Lbl_Approver02Name',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        options: approverOptions,
      },
      {
        key: 'approver03',
        msgkey: 'Admin_Lbl_Approver03Name',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        options: approverOptions,
      },
      {
        key: 'approver04',
        msgkey: 'Admin_Lbl_Approver04Name',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        options: approverOptions,
      },
      {
        key: 'approver05',
        msgkey: 'Admin_Lbl_Approver05Name',
        type: FIELD_SELECT,
        display: DISPLAY_DETAIL,
        options: approverOptions,
      },
    ],
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
