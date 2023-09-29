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

import FinanceApproval from '../containers/FinanceApproval/FinanceApprovalContainer';

import iconHeaderFinanceApproval from '../../approvals-pc/images/Approval.svg';

import './index.scss';

const ROOT = 'ts-finance-approval';
type Props = {
  companyCount: number;
  companyCountOption: Array<CompanyCountOption>;
  overlap: { report: boolean };
  selectedCompanyId: string;
  userSetting: {
    id: string;
    allowApproveExpInDiffCompany: boolean;
    employeeId: string;
    useExpense: boolean;
  };
  fetchCompanyList: () => void;
  initialize: () => void;
  onChangeCompany: (arg0: string) => void;
};

const App = (props: Props) => {
  const {
    userSetting,
    overlap,
    selectedCompanyId,
    companyCountOption,
    onChangeCompany,
    fetchCompanyList,
    companyCount,
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

  return (
    <GlobalContainer>
      <NavigationBar
        icon={iconHeaderFinanceApproval}
        iconAssistiveText={msg().Com_Lbl_FinanceApproval}
      >
        <div className={`${ROOT}__header`}>
          <Text color="secondary" size="xxl">
            {msg().Com_Lbl_FinanceApproval}
          </Text>
        </div>
        <div>
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
      </NavigationBar>
      <FinanceApproval />
      <ToastContainer />
    </GlobalContainer>
  );
};

export default App;
