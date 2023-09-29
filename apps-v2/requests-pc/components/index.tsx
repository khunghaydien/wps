import React, { Suspense } from 'react';

import get from 'lodash/get';

import Spinner from '../../commons/components/Spinner';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import ToastContainer from '../../commons/containers/ToastContainer';
import msg, { getMsgByBrowserLang } from '../../commons/languages';
import UrlUtil from '../../commons/utils/UrlUtil';
import { NavigationBar } from '../../core';
import TextUtil from '@commons/utils/TextUtil';

import RequestsHeaderContainer from '../containers/Requests/HeaderContainer';

import iconHeaderExp from '../images/Request.svg';

const RequestsContainer = React.lazy(
  () => import('../containers/Requests/RequestsContainer')
);

type Props = {
  userSetting: {
    id: string;
    employeeId: string;
    useExpense: boolean;
  };
  initialize: (...args: any) => void;
};

const loadingHint = TextUtil.template(
  getMsgByBrowserLang().Exp_Lbl_LoadingActive,
  getMsgByBrowserLang().Exp_Lbl_RequestTarget
);

export default class App extends React.Component<Props> {
  componentDidMount() {
    const _ = undefined;
    this.props.initialize();
  }

  render() {
    const queries = UrlUtil.getUrlQuery();
    const reportId = queries && queries.id;
    const isCloned = get(queries, 'isCloned') === 'true';
    const isReadOnlyApexPage = !!reportId && !isCloned;

    return (
      <GlobalContainer>
        <NavigationBar
          icon={iconHeaderExp}
          iconAssistiveText={msg().Exp_Lbl_Request}
        >
          <RequestsHeaderContainer isReadOnlyApexPage={isReadOnlyApexPage} />
        </NavigationBar>

        <Suspense
          fallback={<Spinner loading priority="low" hintMsg={loadingHint} />}
        >
          <RequestsContainer isReadOnlyApexPage={isReadOnlyApexPage} />
        </Suspense>

        <ToastContainer />
      </GlobalContainer>
    );
  }
}
