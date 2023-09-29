import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import configList, { ROOT } from '../constants/configList/approverSetting';
import fieldType from '@apps/admin-pc/constants/fieldType';

import msg from '@commons/languages';

import {
  COMPONENT_KEY,
  DISABLE_REQUEST_TYPE_APPROVER01,
  ENABLE_COST_CENTER_MANAGER_OPTION,
  KEY_ENABLE_COST_CENTER_MANAGER_OPTION,
} from '../models/approverSetting';

import {
  search,
  update,
  UpdateParam,
} from '@admin-pc-v2/actions/approverSetting';

import { State } from '@admin-pc-v2/reducers';

import { Config } from '@apps/admin-pc/utils/ConfigUtil';

import '../presentational-components/ApproverSetting/index.scss';
import { Props } from '@admin-pc/components/Admin/ContentsSelector';
import MainContents from '@admin-pc/components/MainContents';

const ApproverSettingContainer: FC<Props> = (props) => {
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const tmpEditRecord: Record<string, any> = useSelector(
    (state: State) => state.tmpEditRecord
  );
  const approverSetting = useSelector((state: State) => state.approverSetting);

  const dispatch = useDispatch();
  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          search,
          update,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    actions.search({ companyId });
  }, [actions, companyId]);

  const onClickUpdateButton = async () => {
    const { id } = tmpEditRecord;

    const omitFields = ['requestTypeLabel'];
    if (!id) omitFields.push('id'); // id is empty for the first time as approver mapping does not exists
    const editRecord = omit(tmpEditRecord, omitFields);

    const params = id ? editRecord : { ...editRecord, companyId };
    await actions.update(params as UpdateParam);
  };

  let newConfigList = configList;
  const hideCCManager = !ENABLE_COST_CENTER_MANAGER_OPTION.includes(
    tmpEditRecord.requestType
  );
  const disableApprover01 = DISABLE_REQUEST_TYPE_APPROVER01.includes(
    tmpEditRecord.requestType
  );

  if (hideCCManager || disableApprover01) {
    const clonedConfigList = cloneDeep(configList);
    const base = clonedConfigList.base;
    const sectionIndex = base.findIndex((config) => config.section);

    base[sectionIndex].configList.forEach((config: Config) => {
      if (disableApprover01 && config.key === 'approver01')
        config.enableMode = '';
      else if (hideCCManager && config.type === fieldType.FIELD_SELECT) {
        config.options = config.options.filter(
          (option: { msgkey: string; value: unknown }) =>
            option.value !== KEY_ENABLE_COST_CENTER_MANAGER_OPTION
        );
      }
    });
    newConfigList = clonedConfigList;
  }

  return (
    <MainContents
      actions={actions}
      className={ROOT}
      componentKey={COMPONENT_KEY}
      configList={newConfigList}
      detailTitle={msg().Admin_Lbl_Details}
      hideDeleteDetailButton
      hideNewButton
      itemList={approverSetting}
      onClickUpdateButton={onClickUpdateButton}
      {...props}
    />
  );
};

export default ApproverSettingContainer;
