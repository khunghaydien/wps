import React from 'react';

import DetailContainer from '../../containers/ExpensesRequestListPane/DetailContainer';
import ListContainer from '../../containers/ExpensesRequestListPane/ListContainer';

import PaneWrapper from '../PaneWrapper';

type Props = {
  isShowSidePanel: boolean;
};
export default class ExpensesRequestListPane extends React.Component<Props> {
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
