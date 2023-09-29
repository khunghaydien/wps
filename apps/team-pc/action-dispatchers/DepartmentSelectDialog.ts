import isNil from 'lodash/isNil';

import { withLoading } from '../../commons/actions/app';
import msg from '../../commons/languages';

import Repository from '../../repositories/DepartmentRepository';

import {
  defaultValue as emptyDepartment,
  Department,
} from '../../domain/models/organization/Department';

import {
  actions,
  Item,
  ItemList,
} from '../modules/ui/attRequestStatus/departmentSelectDialog';

import { AppDispatch } from './AppThunk';

const search = (
  targetDate: string,
  companyId: string,
  parent: null | Item
): Promise<Department[]> =>
  Repository.search({
    targetDate,
    companyId,
    parentId: parent !== null ? parent.id : undefined,
  });

export const initialize =
  (targetDate: string, companyId: string) => (dispatch: AppDispatch) => {
    dispatch(
      withLoading(() =>
        search(targetDate, companyId, null).then((records) => {
          if (records.length > 0) {
            const departments = records
              .filter((record) => isNil(record.parentId))
              .map((record) => ({
                ...record,
                isGroup: false,
              }));
            dispatch(
              actions.searchSuccess([
                [
                  ...departments,
                  {
                    ...emptyDepartment,
                    isGroup: false,
                    name: msg().Team_Lbl_EmptyDepartment,
                  },
                ],
              ])
            );
          }
        })
      )
    );
  };

export const openDialog =
  (targetDate: string, companyId: string) => (dispatch: AppDispatch) => {
    dispatch(initialize(targetDate, companyId));
    dispatch(actions.openDialog());
  };

/**
 * Retrieve departments and build list item for select dialog
 */
export const searchDepartmentItemLists =
  (
    targetDate: string,
    companyId: string,
    parent: null | Item,
    ancestors: ItemList[] = []
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(
      withLoading(() =>
        search(targetDate, companyId, parent).then((records) => {
          if (records.length > 0) {
            const parentId = parent !== null ? parent.id : null;
            const children = records
              .filter((record) => record.parentId === parentId)
              .map((record) => ({
                ...record,
                isGroup: false,
              }));
            const departments = [...ancestors, [...children]];

            dispatch(actions.searchSuccess(departments));
          }
        })
      )
    );
  };
