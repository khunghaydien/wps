import { bindActionCreators, Dispatch } from 'redux';

import { loadingEnd, loadingStart } from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import DailyAllowanceAll from '@attendance/repositories/AttDailyAllowanceRecordRepository';

import { User } from '../../../domain/models/User';
import { Allowances } from '../models/attDailyAllowanceAll';
import { CloseEventHandler } from '../models/events';

import { actions as DailyAllowanceActions } from '../modules/ui/dailyAllowance';

import { DailyAllowanceMergeDataUtil } from '../utils/DailyAllowanceDataUtil';

import DailyAllowanceApp from './App';

export const loadDailyAllowanceAllRecords =
  (targetDate: string, dailyAllowanceList: Allowances[], user?: User) =>
  async (dispatch: Dispatch) => {
    const DailyAllowanceeService = bindActionCreators(
      DailyAllowanceActions,
      dispatch
    );

    DailyAllowanceeService.clear();

    let empId = null;
    if (user) {
      DailyAllowanceeService.setUser(user);
      empId = user.isDelegated ? user.id : undefined;
    }

    const AppService = bindActionCreators(
      { loadingStart, loadingEnd },
      dispatch
    );

    const dailyAllowanceApp = DailyAllowanceApp(dispatch);

    AppService.loadingStart();

    try {
      dispatch(loadingStart());
      const records = await DailyAllowanceAll.searchAvailableAllowances(
        targetDate,
        empId
      );

      /**
       * Combine the selected allowance list with the selectable allowance list
       */
      const recordsData = DailyAllowanceMergeDataUtil(
        records.allowances,
        dailyAllowanceList
      );

      DailyAllowanceeService.fetchSuccess(recordsData);
      AppService.loadingEnd();
    } catch (e) {
      dailyAllowanceApp.showErrorNotification(e);
    } finally {
      AppService.loadingEnd();
    }
  };

export const saveDailyAllowanceRecord =
  (
    dailyAllowances: Allowances[],
    onClose: CloseEventHandler,
    targetDate: string,
    user?: User
  ) =>
  async (dispatch: Dispatch) => {
    const AppService = bindActionCreators(
      { loadingStart, loadingEnd },
      dispatch
    );
    const dailyAllowanceApp = DailyAllowanceApp(dispatch);

    AppService.loadingStart();
    try {
      const empId = user?.isDelegated ? user.id : undefined;

      // check selected allowance manage type is empty
      const dailyAllowancesSelected = [];
      dailyAllowances.forEach((item) => {
        if (item.isSelected === true) {
          dailyAllowancesSelected.push({
            allowanceId: item.allowanceId,
            startTime: item.startTime,
            endTime: item.endTime,
            totalTime: item.totalTime,
            quantity: item.quantity,
          });

          switch (item.managementType) {
            case 'Hours':
              if (item.totalTime === null || item.totalTime === undefined) {
                throw new Error(
                  item.allowanceName + ' ' + msg().Admin_Msg_EmptyItem
                );
              }
              break;
            case 'StartEndTime':
              if (
                item.startTime === null ||
                item.startTime === undefined ||
                item.endTime === null ||
                item.endTime === undefined
              ) {
                throw new Error(
                  item.allowanceName + ' ' + msg().Admin_Msg_EmptyItem
                );
              }
              break;
            case 'Quantity':
              if (!item.quantity) {
                throw new Error(
                  item.allowanceName + ' ' + msg().Admin_Msg_EmptyItem
                );
              }
              break;
            default:
              break;
          }
        }
      });

      await DailyAllowanceAll.saveDailyAllowances(
        dailyAllowancesSelected,
        targetDate,
        empId
      );

      onClose({
        dismissed: false,
        saved: true,
        timestamp: false,
        targetDate,
      });
    } catch (e) {
      dailyAllowanceApp.showErrorNotification(e);
    } finally {
      AppService.loadingEnd();
    }
  };
