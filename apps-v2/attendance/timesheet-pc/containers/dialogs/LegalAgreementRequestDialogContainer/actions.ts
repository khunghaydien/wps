import { bindActionCreators } from 'redux';

import { showDialog } from '@apps/commons/action-dispatchers/ApproverEmployeeSetting';
import { DialogType } from '@apps/commons/modules/approverEmployeeSearch/ui/dialog';

import { ApproverEmployee } from '@apps/domain/models/approval/ApproverEmployee';
import {
  createFromDefaultValue,
  DISABLE_ACTION,
  DisableAction,
  EDIT_ACTION,
  EditAction,
  LegalAgreementRequest,
} from '@attendance/domain/models/LegalAgreementRequest';
import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

import { open } from '../../../modules/ui/approvalHistory/actions';
import { actions as editingActions } from '../../../modules/ui/legalAgreementRequest/editing';
import { actions as pageActions } from '../../../modules/ui/legalAgreementRequest/page';
import {
  actions as monthlyRequestActions,
  Keys as MonthlyKeys,
  Values as MonthlyValues,
} from '../../../modules/ui/legalAgreementRequest/requests/monthlyRequest';
import {
  actions as yearlyRequestActions,
  Keys as YearlyKeys,
  Values as YearlyValues,
} from '../../../modules/ui/legalAgreementRequest/requests/yearlyRequest';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import UseCases from '@attendance/timesheet-pc/UseCases';

interface LegalAgreementRequestService {
  openRequest: () => void;
  closeRequest: () => void;
  showRequestDetailPane: (target: LegalAgreementRequest) => void;
  showEntryRequestPane: (requestType: Code) => void;
  startEditing: (target: LegalAgreementRequest) => void;
  cancelEditing: (target: LegalAgreementRequest) => void;
  submit: (
    editingRequest: LegalAgreementRequest & { summaryId: string },
    editAction: EditAction
  ) => Promise<void>;
  disable: (action: DisableAction, requestId: string) => Promise<void>;
  openApprovalHistoryDialog: (requestId: string) => void;
  openApproverEmployeeSettingDialog: (
    setting: ApproverEmployee,
    targetDate: string,
    isReadOnly: boolean,
    dialogType: DialogType
  ) => void;
  onUpdateValueMonthly: (key: MonthlyKeys, value: MonthlyValues) => void;
  onUpdateValueYearly: (key: YearlyKeys, value: YearlyValues) => void;
}

export default (dispatch: AppDispatch): LegalAgreementRequestService => {
  const monthlyRequestService = bindActionCreators(
    monthlyRequestActions,
    dispatch
  );
  const yearlyRequestService = bindActionCreators(
    yearlyRequestActions,
    dispatch
  );
  const editingService = bindActionCreators(editingActions, dispatch);
  const pageService = bindActionCreators(pageActions, dispatch);
  const initializeRequest = (target: LegalAgreementRequest) => {
    switch (target?.requestType) {
      case CODE.MONTHLY:
        monthlyRequestService.initialize(target);
        break;
      case CODE.YEARLY:
        yearlyRequestService.initialize(target);
        break;
      default:
        monthlyRequestService.initialize(target);
        break;
    }
  };
  const initCurrentRequest = (
    target: LegalAgreementRequest,
    isEditing?: boolean
  ) => {
    initializeRequest(target);
    if (isEditing) {
      editingService.initialize(target, true);
    } else {
      editingService.initialize(target);
    }
  };

  const clear = () => {
    editingService.clear();
    monthlyRequestService.clear();
  };

  return {
    openRequest: () => {
      pageService.openRequest();
    },
    closeRequest: () => {
      pageService.closeRequest();
      clear();
    },
    showRequestDetailPane: (target) => {
      initCurrentRequest(target);
    },
    showEntryRequestPane: (requestType) => {
      const target = createFromDefaultValue(requestType);
      switch (requestType) {
        case CODE.MONTHLY:
        case CODE.YEARLY:
          initCurrentRequest(target);
          break;
        default:
      }
    },
    startEditing: (target) => {
      switch (target?.requestType) {
        case CODE.MONTHLY:
        case CODE.YEARLY:
          initCurrentRequest(target, true);
          break;
        default:
          initCurrentRequest(target, true);
      }
    },
    cancelEditing: (target) => {
      initCurrentRequest(target);
    },
    submit: async (request, editAction) => {
      const { id, changedOvertimeHoursLimit, reason, measure, isForReapply } =
        request;
      const commonParam = {
        requestId: id,
        changedOvertimeHoursLimit,
        reason,
        measures: measure,
      };
      if (
        editAction === EDIT_ACTION.CREATE ||
        (editAction === EDIT_ACTION.MODIFY && !isForReapply)
      ) {
        const { summaryId, requestType } = request;
        await UseCases().submitLegalAgreementRequest({
          ...commonParam,
          summaryId,
          requestType,
        });
      } else if (
        editAction === EDIT_ACTION.REAPPLY ||
        (editAction === EDIT_ACTION.MODIFY && isForReapply)
      ) {
        const param = {
          requestId: null,
          originalRequestId: null,
        };
        if (editAction === EDIT_ACTION.REAPPLY) {
          // Reapply.
          param.originalRequestId = request.id;
        } else {
          // Reapply request again.
          param.requestId = request.id;
          param.originalRequestId = request.originalRequestId;
        }
        await UseCases().reapplyLegalAgreementRequest({
          ...commonParam,
          ...param,
        });
      }
    },
    disable: async (action, requestId) => {
      switch (action) {
        case DISABLE_ACTION.CANCEL_REQUEST:
          await UseCases().cancelRequestLegalAgreementRequest({
            requestId,
          });
          break;
        case DISABLE_ACTION.CANCEL_APPROVAL:
          await UseCases().cancelApprovalLegalAgreementRequest({
            requestId,
          });
          break;
        case DISABLE_ACTION.REMOVE:
          const result = await UseCases().removeLegalAgreementRequest({
            requestId,
          });
          if (result) {
            clear();
          }
          break;
        default:
      }
    },
    openApprovalHistoryDialog: (requestId) => {
      dispatch(open(requestId));
    },
    openApproverEmployeeSettingDialog: (
      setting,
      targetDate,
      isReadOnly,
      dialogTyp
    ) => {
      dispatch(showDialog(setting, targetDate, isReadOnly, dialogTyp));
    },
    onUpdateValueMonthly: (key, value) => {
      monthlyRequestService.update(key, value);
    },
    onUpdateValueYearly: (key, value) => {
      yearlyRequestService.update(key, value);
    },
  };
};
