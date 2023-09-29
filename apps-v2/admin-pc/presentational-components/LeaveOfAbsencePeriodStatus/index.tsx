// @ts-nocheck
import React from 'react';

import DetailPaneContainer from '../../containers/LeaveOfAbsencePeriodStatusContainer/DetailPaneContainer';
import ListPaneContainer from '../../containers/LeaveOfAbsencePeriodStatusContainer/ListPaneContainer';
import UpdatePeriodStatusDialogContainer from '../../containers/LeaveOfAbsencePeriodStatusContainer/UpdatePeriodStatusDialogContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  isDetailVisible: boolean;
};

export default class LeaveOfAbsencePeriodStatus extends React.Component<Props> {
  render() {
    return (
      <MainContentFrame
        ListPane={<ListPaneContainer />}
        DetailPane={<DetailPaneContainer />}
        Dialogs={[
          <UpdatePeriodStatusDialogContainer key="UpdatePeriodStatusDialogContainer" />,
        ]}
        isDetailVisible={this.props.isDetailVisible}
      />
    );
  }
}
