import React, { useEffect } from 'react';

import isEmpty from 'lodash/isEmpty';

import {
  CompanyCountOption,
  CompanySwitch,
} from '../../commons/components/exp/CompanySwitch';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import ToastContainer from '../../commons/containers/ToastContainer';
import msg from '../../commons/languages';
import { NavigationBar, Text } from '../../core';
import Tab from '@commons/components/Tab';

import { Tab as TabType, TABS } from '../modules/ui/FinanceApproval/tabs';

import FinanceApproval from '../containers/FinanceApproval/FinanceApprovalContainer';

import iconHeaderFinanceApproval from '../../approvals-pc/images/Approval.svg';
import imgIconExpenses from '@apps/expenses-pc/images/menuIconExpenseRequestBigger.png';

import './index.scss';

const ROOT = 'ts-finance-approval';

const ICON_WIDTH = 20;

type Props = {
  companyCount: number;
  companyCountOption: Array<CompanyCountOption>;
  overlap: { report: boolean };
  selectedCompanyId: string;
  selectedTab: TabType;
  userSetting: {
    id: string;
    allowApproveExpInDiffCompany: boolean;
    employeeId: string;
    useExpense: boolean;
    useExpenseRequest: boolean;
  };
  fetchCompanyList: () => void;
  initialize: () => void;
  onChangeCompany: (arg0: string) => void;
  selectTab: (tab: TabType) => void;
};

const App = (props: Props) => {
  const {
    userSetting,
    overlap,
    selectedCompanyId,
    selectedTab,
    companyCountOption,
    onChangeCompany,
    fetchCompanyList,
    companyCount,
    selectTab,
  } = props;

  // Don't move to container yet. There are bugs at Redux compose
  useEffect(() => {
    props.initialize();
  }, []);

  // TODO: Move this part inside companySwitch component once search company API call moves to commons
  useEffect(() => {
    if (isEmpty(companyCountOption)) {
      fetchCompanyList();
    }
  }, []);

  if (!userSetting.id) {
    return null;
  }

  const renderHeaderTabs = (
    tab: TabType,
    isUsed: boolean,
    iconSrc: string,
    iconWidth: number,
    label: string
  ) => {
    if (!isUsed) return null;
    return (
      <Tab
        label={label}
        icon={iconSrc}
        iconWidth={iconWidth.toString()}
        selected={selectedTab === tab}
        onSelect={() => selectTab(tab)}
      />
    );
  };

  return (
    <GlobalContainer>
      <NavigationBar
        icon={iconHeaderFinanceApproval}
        iconAssistiveText={msg().Com_Lbl_FinanceApproval}
      >
        <div className={`${ROOT}__header`}>
          {overlap.report ? (
            <Text color="secondary" size="xxl">
              {msg().Com_Lbl_FinanceApproval}
            </Text>
          ) : (
            [
              renderHeaderTabs(
                TABS.EXPENSES,
                userSetting.useExpense,
                imgIconExpenses,
                ICON_WIDTH,
                msg().Appr_Btn_ExpensesRequest
              ),
              renderHeaderTabs(
                TABS.REQUESTS,
                userSetting.useExpenseRequest,
                imgIconExpenses,
                ICON_WIDTH,
                msg().Appr_Btn_ExpensesPreApproval
              ),
            ]
          )}

          <div className={`${ROOT}__header-company`}>
            {userSetting.allowApproveExpInDiffCompany &&
              !overlap.report &&
              companyCount > 1 && (
                <CompanySwitch
                  withoutCount
                  value={selectedCompanyId}
                  isLoading={false}
                  options={companyCountOption}
                  onChange={onChangeCompany}
                />
              )}
          </div>
        </div>
      </NavigationBar>
      <FinanceApproval />
      <ToastContainer />
    </GlobalContainer>
  );
};

export default App;
