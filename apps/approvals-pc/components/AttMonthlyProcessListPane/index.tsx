import React from 'react';

import DetailContainer from '../../containers/AttMonthlyProcessListPane/DetailContainer';
import ListContainer from '../../containers/AttMonthlyProcessListPane/ListContainer';

import PaneExpandWrapper from '../PaneExpandWrapper';

type Props = {
  isExpanded: boolean;
};

export default class AttMonthlyProcessListPane extends React.Component<Props> {
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
