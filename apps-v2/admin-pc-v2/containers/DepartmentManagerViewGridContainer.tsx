import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { get, isEmpty } from 'lodash';

import {
  ASSIGNMENT_TYPE,
  DepartmentManager,
  DepartmentManager as DepartmentManagerType,
} from '../models/organization/Department';

import { DIALOG_STATE } from '@admin-pc-v2/modules/departmentManager/ui/dialog';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import { changeHistoryRecordValue } from '@admin-pc-v2/action-dispatchers/department/Detail';
import { searchDepartmentManager } from '@admin-pc-v2/actions/departmentManager';
import { searchPosition } from '@admin-pc-v2/actions/position';

import Component from '@admin-pc-v2/presentational-components/Department/DepartmentManager';

type Props = {
  mode: 'edit' | 'revision' | '';
  tmpEditRecordBase: {
    companyId: string;
  };
  tmpEditRecord: {
    baseId: string | null | undefined;
    validDateFrom: string | null | undefined;
    managers: DepartmentManager[] | null;
  };
};

const Actions = {
  searchDepartmentManager,
  searchPosition,
  replaceManagers: (managers: DepartmentManager[]) =>
    changeHistoryRecordValue('managers', managers),
};

const isPosition = (x: DepartmentManagerType) =>
  x.assignmentType === ASSIGNMENT_TYPE.POSITION;

const DepartmentManagerViewGridContainer: React.FC<Props> = ({
  mode,
  tmpEditRecordBase,
  tmpEditRecord,
}) => {
  const companyId = get(tmpEditRecordBase, 'companyId');
  const deptBaseId = get(tmpEditRecord, 'baseId');
  const targetDate = get(tmpEditRecord, 'validDateFrom');
  const hierarchyPatternId = get(tmpEditRecord, 'hierarchyPatternId');
  const managers = get(tmpEditRecord, 'managers');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [dialog, setDialog] = useState<
    typeof DIALOG_STATE[keyof typeof DIALOG_STATE]
  >(DIALOG_STATE.NONE);

  const filteredManagers = useMemo(
    () =>
      (managers || []).filter(
        (i) => i.hierarchyPatternId === hierarchyPatternId
      ),
    [hierarchyPatternId, managers]
  );

  const dispatch = useDispatch() as AppDispatch;

  const {
    searchDepartmentManager,
    searchPosition: searchPositionAction,
    replaceManagers,
  } = useMemo(() => bindActionCreators(Actions, dispatch), [dispatch]);

  const [openSelectEmployeesDialog, openSelectPositionsDialog, closeDialog] =
    useMemo(
      () => [
        () => setDialog(DIALOG_STATE.EMPLOYEE),
        () => setDialog(DIALOG_STATE.POSITION),
        () => setDialog(DIALOG_STATE.NONE),
      ],
      []
    );

  const fetchManagers = useCallback(async () => {
    if (isEmpty(hierarchyPatternId) || isEmpty(deptBaseId)) {
      return;
    }
    const managers = (await searchDepartmentManager({
      deptBaseIds: [deptBaseId],
      targetDate,
      hierarchyPatternIds: [hierarchyPatternId],
    })) as unknown as DepartmentManager[];
    replaceManagers(managers);
  }, [
    searchDepartmentManager,
    deptBaseId,
    targetDate,
    hierarchyPatternId,
    replaceManagers,
  ]);

  const addManagers = useCallback(
    (assignmentType: typeof ASSIGNMENT_TYPE[keyof typeof ASSIGNMENT_TYPE]) =>
      (rows) => {
        replaceManagers([
          ...managers,
          ...rows.map((row) => {
            const additionalInfo =
              assignmentType === ASSIGNMENT_TYPE.EMPLOYEE
                ? {
                    employee: { name: row.name, code: row.code },
                    empBaseId: row.id,
                  }
                : {
                    position: { name: row.name, code: row.code },
                    positionId: row.id,
                  };

            return {
              ...row,
              assignmentType,
              hierarchyPatternId,
              ...additionalInfo,
            };
          }),
        ]);
        closeDialog();
      },
    [replaceManagers, managers, hierarchyPatternId, closeDialog]
  );

  const deleteManagers = useCallback(() => {
    replaceManagers(managers.filter(({ id }) => !selectedIds.includes(id)));
    setSelectedIds([]);
  }, [replaceManagers, managers, selectedIds, setSelectedIds]);

  const onPrimaryManagerChanged = React.useCallback(
    (
      id: string,
      e: React.ChangeEvent<HTMLInputElement>,
      managers: DepartmentManagerType[]
    ) => {
      const { checked } = e.target;
      replaceManagers(
        managers.map((manager) => {
          if (isPosition(manager)) {
            return manager;
          }

          if (manager.id === id) {
            return { ...manager, primary: checked };
          }
          if (checked && manager.primary) {
            return { ...manager, primary: false };
          }
          return manager;
        })
      );
    },
    [replaceManagers]
  );

  const searchPosition = useCallback(
    (code: string, name: string) =>
      searchPositionAction({
        companyId,
        code,
        name,
        active: true,
      }),
    [companyId, searchPositionAction]
  );

  // FIXME 変更をキャンセルした場合に内容を復元するためmodeを監視しているが、不要なリクエストを誘発しているので最適化できると良い
  useEffect(() => {
    fetchManagers();
  }, [fetchManagers, mode]);

  return (
    <Component
      {...{
        mode,
        managers: filteredManagers,
        selectedIds,
        setSelectedIds,
        addManagers,
        deleteManagers,
        dialog,
        openSelectEmployeesDialog,
        openSelectPositionsDialog,
        searchPosition,
        closeDialog,
        onPrimaryManagerChanged,
      }}
    />
  );
};

export default DepartmentManagerViewGridContainer;
