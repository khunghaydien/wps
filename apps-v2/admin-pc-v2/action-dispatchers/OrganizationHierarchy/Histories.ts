import { bindActionCreators } from 'redux';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '@commons/actions/app';
import msg from '@commons/languages';

import Repository from '@apps/repositories/organization/organizationHierarchy/OrganizationHierarchyRepository';

import {
  detectDefaultHistory,
  OrganizationHierarchyHistory,
  sortHistoriesInASC,
} from '@apps/domain/models/organization/OrganizationHierarchy';

import { actions as EntitiesActions } from '../../modules/organizationHierarchy/entities/histories';
import { actions as RevisionDialogActions } from '../../modules/organizationHierarchy/ui/revisionDialog';
import { actions as SelectedUiActions } from '../../modules/organizationHierarchy/ui/selectedHistory';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';

const CommonActions = {
  loadingStart,
  loadingEnd,
  catchApiError,
  confirm,
};

export default (dispatch: AppDispatch) => {
  const { loadingStart, loadingEnd, catchApiError, confirm } =
    bindActionCreators(CommonActions, dispatch);
  const entities = bindActionCreators(EntitiesActions, dispatch);
  const selectedUi = bindActionCreators(SelectedUiActions, dispatch);
  const revisionDialog = bindActionCreators(RevisionDialogActions, dispatch);

  const clear = () => {
    entities.clear();
    selectedUi.clear();
    revisionDialog.close();
  };

  const fetchHistories = async (
    param: Parameters<typeof Repository.fetchHistories>[0],
    options?: { targetHistoryId?: string }
  ) => {
    const histories = await Repository.fetchHistories(param);
    entities.set(histories);

    const selectedHistory = options?.targetHistoryId
      ? histories.find((r) => r.id === options.targetHistoryId)
      : detectDefaultHistory(histories);
    selectedUi.set(selectedHistory);

    return histories;
  };

  return {
    clear,

    initialize: async (param: Parameters<typeof fetchHistories>[0]) => {
      clear();
      loadingStart();
      try {
        const histories = await fetchHistories(param);

        if (histories.length === 0) {
          revisionDialog.open();
        }
      } catch (err) {
        catchApiError(err);
      } finally {
        loadingEnd();
      }
    },

    switchCurrentHistory: (
      histories: OrganizationHierarchyHistory[],
      id: string
    ) =>
      // When selectedHistory is changed, the TreeView's useEffect re-fetches the content
      selectedUi.set(histories.find((h) => h.id === id)),

    openRevisionDialog: revisionDialog.open,
    closeRevisionDialog: revisionDialog.close,
    reviseHistory: async (
      param: Parameters<typeof Repository.createHistory>[0]
    ) => {
      loadingStart();
      try {
        const result = await Repository.createHistory(param);
        await fetchHistories(param, { targetHistoryId: result.id });
        revisionDialog.close();
      } catch (err) {
        catchApiError(err);
      } finally {
        loadingEnd();
      }
    },
    deleteHistory: async (
      id: string,
      reFetchParam: Parameters<typeof fetchHistories>[0],
      histories: OrganizationHierarchyHistory[]
    ) => {
      if (!(await confirm(msg().Admin_Msg_ConfirmDelete))) {
        return;
      }

      const sortedHistories = sortHistoriesInASC(histories);
      const prevHistoryIdForNextTarget =
        sortedHistories[sortedHistories.findIndex((h) => h.id === id) - 1]?.id;

      loadingStart();
      try {
        await Repository.deleteHistory({ id });
        await fetchHistories(reFetchParam, {
          targetHistoryId: prevHistoryIdForNextTarget,
        });
      } catch (err) {
        catchApiError(err);
      } finally {
        loadingEnd();
      }
    },
  };
};
