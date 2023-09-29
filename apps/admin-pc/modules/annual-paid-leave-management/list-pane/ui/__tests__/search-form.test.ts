import tabType from '../../../../../../commons/constants/tabType';

import { SELECT_TAB } from '../../../../../../commons/actions/tab';

import {
  CHANGE_COMPANY,
  SELECT_MENU_ITEM,
} from '../../../../base/menu-pane/ui';
import reducer, {
  CLEAR,
  initialState,
  updateDepartmentNameQuery,
  updateEmployeeCodeQuery,
  updateEmployeeNameQuery,
  updateWorkingTypeNameQuery,
} from '../search-form';

describe('admin-pc/annual-paid-leave-management/modules/ui/search-form', () => {
  describe('reducer', () => {
    const state = {
      employeeCodeQuery: '',
      employeeNameQuery: '',
      departmentNameQuery: '',
      workingTypeNameQuery: '',
      targetDateQuery: '',
    };

    describe('UPDATE_EMPLOYEE_CODE_QUERY', () => {
      test('should update state when query given', () => {
        expect(
          reducer(state, updateEmployeeCodeQuery('000002')).employeeCodeQuery
        ).toBe('000002');
      });
    });

    describe('UPDATE_EMPLOYEE_NAME_QUERY', () => {
      test('should update state when query given', () => {
        expect(
          reducer(state, updateEmployeeNameQuery('Suzuki Niko'))
            .employeeNameQuery
        ).toBe('Suzuki Niko');
      });
    });

    describe('UPDATE_DEPARTMENT_CODE_QUERY', () => {
      test('should update state when query given', () => {
        expect(
          reducer(state, updateDepartmentNameQuery('テスト部署'))
            .departmentNameQuery
        ).toBe('テスト部署');
      });
    });

    describe('UPDATE_WORKING_TYPE_NAME_QUERY', () => {
      test('should update state when query given', () => {
        expect(
          reducer(state, updateWorkingTypeNameQuery('Test Fix'))
            .workingTypeNameQuery
        ).toBe('Test Fix');
      });
    });

    describe('CLEAR', () => {
      const nextState = reducer(
        {
          employeeCodeQuery: '000002',
          employeeNameQuery: 'Suzuki Niko',
          departmentNameQuery: 'テスト部署',
          workingTypeNameQuery: 'Test Fix',
          targetDateQuery: '',
        },
        {
          type: CLEAR,
        }
      );

      test('should clear state', () => {
        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_MENU_ITEM', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            employeeCodeQuery: '000002',
            employeeNameQuery: 'Suzuki Niko',
            departmentNameQuery: 'テスト部署',
            workingTypeNameQuery: 'Test Fix',
            targetDateQuery: '',
          },
          {
            type: SELECT_MENU_ITEM,
            payload: 'Organization',
          }
        );

        expect(nextState).toEqual(initialState);
      });
    });
    describe('CHANGE_COMPANY', () => {
      const nextState = reducer(
        {
          employeeCodeQuery: '000002',
          employeeNameQuery: 'Suzuki Niko',
          departmentNameQuery: 'テスト部署',
          workingTypeNameQuery: 'Test Fix',
          targetDateQuery: '',
        },
        {
          type: CHANGE_COMPANY,
        }
      );

      test('should clear state', () => {
        expect(nextState).toEqual(initialState);
      });
    });
    describe('SELECT_TAB', () => {
      test('should clear state', () => {
        const nextState = reducer(
          {
            employeeCodeQuery: '000002',
            employeeNameQuery: 'Suzuki Niko',
            departmentNameQuery: 'テスト部署',
            workingTypeNameQuery: 'Test Fix',
            targetDateQuery: '',
          },
          {
            type: SELECT_TAB,
            payload: tabType.ADMIN_ORGANIZATION_REQUEST,
          }
        );

        expect(nextState).toEqual(initialState);
      });
    });
  });
});
