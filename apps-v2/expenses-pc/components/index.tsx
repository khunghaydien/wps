import React, { FC, Suspense, useEffect } from 'react';

import Spinner from '../../commons/components/Spinner';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import ToastContainer from '../../commons/containers/ToastContainer';
import msg, { getMsgByBrowserLang } from '../../commons/languages';
import { NavigationBar } from '../../core';
import TextUtil from '@commons/utils/TextUtil';

import ExpensesHeaderContainer from '../containers/Expenses/HeaderContainer';

import IconHeaderExp from '../images/Expense.svg';

import './index.scss';

const ExpensesContainer = React.lazy(
  () => import('../containers/Expenses/ExpensesContainer')
);

type Props = {
  initialize: (...arg: any) => void;
};

const loadingHint = TextUtil.template(
  getMsgByBrowserLang().Exp_Lbl_LoadingActive,
  getMsgByBrowserLang().Exp_Lbl_Report
);

const App: FC<Props> = ({ initialize }) => {
  useEffect(() => {
    initialize();
  }, []);

  return (
    <GlobalContainer>
      <NavigationBar
        icon={IconHeaderExp}
        iconAssistiveText={msg().Appr_Lbl_Expense}
      >
        <ExpensesHeaderContainer />
      </NavigationBar>

      <Suspense
        fallback={<Spinner loading priority="low" hintMsg={loadingHint} />}
      >
        <ExpensesContainer />
      </Suspense>

      <ToastContainer />
    </GlobalContainer>
  );
};

export default App;
