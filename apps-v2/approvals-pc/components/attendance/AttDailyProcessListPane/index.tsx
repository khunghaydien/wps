import React from 'react';

import DetailContainer from '../../../containers/AttDailyProcessListPane/DetailContainer';
import ListContainer from '../../../containers/AttDailyProcessListPane/ListContainer';

import PaneExpandWrapper from '../../PaneExpandWrapper';

type Props = {
  isExpanded: boolean;
};

export default class AttDailyProcessListPane extends React.Component<Props> {
  render() {
    return (
      <PaneExpandWrapper
        list={<ListContainer />}
        detail={<DetailContainer />}
        detailExpanded={this.props.isExpanded}
      />
    );
  }
}
