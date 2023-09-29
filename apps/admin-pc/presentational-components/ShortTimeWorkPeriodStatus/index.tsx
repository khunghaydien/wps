// @ts-nocheck
import React from 'react';

import DetailPaneContainer from '../../containers/ShortTimeWorkPeriodStatusContainer/DetailPaneContainer';
import ListPaneContainer from '../../containers/ShortTimeWorkPeriodStatusContainer/ListPaneContainer';
import UpdatePeriodStatusDialogContainer from '../../containers/ShortTimeWorkPeriodStatusContainer/UpdatePeriodStatusDialogContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  isDetailVisible: boolean;
};

export default class ShortTimeWorkPeriodStatus extends React.Component<Props> {
  render() {
    return (
      <MainContentFrame
        ListPane={<ListPaneContainer />}
        DetailPane={<DetailPaneContainer />}
        Dialogs={[<UpdatePeriodStatusDialogContainer key="updateDialog" />]}
        isDetailVisible={this.props.isDetailVisible}
      />
    );
  }
}
