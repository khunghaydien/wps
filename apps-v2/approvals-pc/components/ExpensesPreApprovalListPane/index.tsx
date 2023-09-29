import React from 'react';

import DetailContainer from '../../containers/ExpensesPreApprovalListPane/DetailContainer';
import ListContainer from '../../containers/ExpensesPreApprovalListPane/ListContainer';

import PaneWrapper from '../PaneWrapper';

type Props = {
  isShowSidePanel: boolean;
};

export default class ExpensesPreApprovalListPane extends React.Component<Props> {
  render() {
    return (
      <PaneWrapper
        list={<ListContainer />}
        detail={<DetailContainer />}
        isShowSidePanel={this.props.isShowSidePanel}
      />
    );
  }
}
