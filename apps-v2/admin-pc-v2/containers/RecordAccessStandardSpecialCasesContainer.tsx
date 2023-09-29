import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RecordAccessHierarchyRecord } from '@admin-pc-v2/models/recordAccess/RecordAccess';
import { Record } from '@apps/domain/models/exp/Record';
import { Department } from '@apps/domain/models/organization/Department';

import { MODE } from '@admin-pc/modules/base/detail-pane/ui';

import { setTmpEditRecordByKeyValue } from '@admin-pc/actions/editRecord';
import { searchDepartmentByQuery } from '@admin-pc-v2/action-dispatchers/employee/Detail';

import RecordAccessStandardSpecialCases from '@admin-pc-v2/components/RecordAccess/RecordAccessStandardSpecialCases';

type Props = {
  mode: string;
  tmpEditRecord: Record & {
    id: string;
    validDateFrom: string;
    companyId?: string;
    recordAccessHierarchyRecords?: Array<RecordAccessHierarchyRecord>;
  };
};
const RecordAccessStandardSpecialCasesContainer = (
  props: Props
): React.ReactElement => {
  const { mode, tmpEditRecord } = props;
  const { id, companyId, validDateFrom } = tmpEditRecord;
  const recordAccessHierarchyRecords = useMemo(
    () => tmpEditRecord.recordAccessHierarchyRecords || [],
    [tmpEditRecord.recordAccessHierarchyRecords]
  );
  const dispatch = useDispatch();

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchDepartments: searchDepartmentByQuery,
          setTmpEditRecordByKeyValue,
        },
        dispatch
      ),
    [dispatch]
  );

  const [dialogStates, setDialogStates] = useState<{
    targetDialog: boolean;
    departmentDialog: boolean;
  }>({ targetDialog: false, departmentDialog: false });

  const onCloseDeptDialog = () =>
    setDialogStates((s) => ({ ...s, departmentDialog: false }));

  const onSearchDepartment = (code: string, name: string) => {
    const param = {
      code,
      name,
      targetDate: validDateFrom,
      companyId,
      sortCondition: { field: 'code' },
    };
    return Actions.searchDepartments(param);
  };

  const onAddDepartments = (departments: Array<Department>) => {
    const arrNew = departments
      .filter(
        (d) =>
          !recordAccessHierarchyRecords.find((r) => r.departmentCode === d.code)
      )
      .map((d) => ({
        deptBaseId: d.id,
        recordAccessPtnId: id,
        departmentName: d.name,
        departmentCode: d.code,
        id: null,
        managerDisabled: false,
        parentDisabled: false,
        grantRAToDeptMgrOnly: false,
      }));
    Actions.setTmpEditRecordByKeyValue(
      'recordAccessHierarchyRecords',
      recordAccessHierarchyRecords.concat(arrNew)
    );
    onCloseDeptDialog();
  };

  const onDeleteTargets = React.useCallback(
    (deptRecordAccessPtnIds?: Array<string>) => {
      const arrUndel = recordAccessHierarchyRecords.filter(
        (d) => !deptRecordAccessPtnIds.find((r) => r === d.departmentCode)
      );
      Actions.setTmpEditRecordByKeyValue(
        'recordAccessHierarchyRecords',
        arrUndel
      );
    },
    [Actions, recordAccessHierarchyRecords]
  );

  const onOpenDeptDialog = () => {
    setDialogStates((s) => ({ ...s, departmentDialog: true }));
  };

  const changeValueOfRecordAccessHierarchyRecord = React.useCallback(
    (
      deptCode: string,
      key: string,
      e: React.ChangeEvent<HTMLInputElement>,
      recordAccessHierarchyRecords: Array<RecordAccessHierarchyRecord>
    ) => {
      const { checked } = e.target;
      const arr = recordAccessHierarchyRecords.map((record) => {
        if (deptCode === record.departmentCode) {
          return { ...record, [key]: checked };
        }
        return record;
      });
      Actions.setTmpEditRecordByKeyValue('recordAccessHierarchyRecords', arr);
    },
    [Actions]
  );

  return (
    <RecordAccessStandardSpecialCases
      tableDisabled={mode === MODE.VIEW}
      recordAccessHierarchyRecords={recordAccessHierarchyRecords}
      targetDate={validDateFrom}
      isOpenDepartmentDialog={dialogStates.departmentDialog}
      onDeleteTargets={onDeleteTargets}
      onAddDepartments={onAddDepartments}
      onOpenDeptDialog={onOpenDeptDialog}
      onSearchDepartment={onSearchDepartment}
      onCloseDeptDialog={onCloseDeptDialog}
      changeValueOfRecordAccessHierarchyRecord={
        changeValueOfRecordAccessHierarchyRecord
      }
    />
  );
};

export default RecordAccessStandardSpecialCasesContainer;
