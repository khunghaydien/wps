import React, { useCallback, useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { $Values } from 'utility-types';

import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import msg from '@commons/languages';
import GlobalFooter from '@mobile/components/organisms/commons/GlobalFooter';

export const EXPENSE_TABS = {
  report: 'report',
  record: 'record',
} as const;

export const PAGE = {
  expenseApproval: 'expenseApproval',
};

const PATH = {
  approvalExpense: '/approval/expenses/list/',
  approvalRequest: '/approval/requests/list/',
};

type Props = {
  page: $Values<typeof PAGE>;
  history: RouteComponentProps['history'];
  activeTab: $Values<typeof EXPENSE_TABS & typeof EXPENSE_APPROVAL_REQUEST>;
  handleTabChange?: (string) => void;
};

const GlobalFooterContainer = (ownProps: Props) => {
  const onClickTab = useCallback(
    (url: string, tab?: string) => () => {
      if (ownProps.handleTabChange) {
        ownProps.handleTabChange(tab);
      }
      ownProps.history.replace(url);
    },
    [ownProps.history]
  );

  const tabs = useMemo(() => {
    let tabs;
    switch (ownProps.page) {
      case PAGE.expenseApproval:
        tabs = [
          {
            label: msg().Appr_Clbl_ExpensesRequest,
            handleOnClick: onClickTab(
              PATH.approvalExpense,
              EXPENSE_APPROVAL_REQUEST.expense
            ),
            key: EXPENSE_APPROVAL_REQUEST.expense,
          },
          {
            label: msg().Appr_Clbl_ExpensesPreApproval,
            handleOnClick: onClickTab(
              PATH.approvalRequest,
              EXPENSE_APPROVAL_REQUEST.request
            ),
            key: EXPENSE_APPROVAL_REQUEST.request,
          },
        ];
        break;
      default:
        tabs = [];
    }
    return tabs;
  }, [module]);

  return <GlobalFooter tabs={tabs} activeTab={ownProps.activeTab} />;
};

export default GlobalFooterContainer;
