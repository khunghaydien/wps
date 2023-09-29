// @ts-nocheck
import React from 'react';

import DetailPaneContainer from '../../containers/CalendarContainer/DetailPaneContainer';
import EventDialogContainer from '../../containers/CalendarContainer/EventDialogContainer';
import ListPaneContainer from '../../containers/CalendarContainer/ListPaneContainer';

import MainContentFrame from '../../components/Common/MainContentFrame';

export type Props = {
  companyId: string;
  onInitialize: () => void;
  isDetailVisible: boolean;
};

export default class Calendar extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.onInitialize();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.companyId !== nextProps.companyId) {
      nextProps.onInitialize();
    }
  }

  render() {
    return (
      <MainContentFrame
        ListPane={<ListPaneContainer />}
        DetailPane={<DetailPaneContainer />}
        Dialogs={[<EventDialogContainer />]}
        isDetailVisible={this.props.isDetailVisible}
      />
    );
  }
}
