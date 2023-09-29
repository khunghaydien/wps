import React from 'react';

import DetailContainer from '../../../containers/AttMonthlyFixProcessListPane/DetailContainer';
import ListContainer from '../../../containers/AttMonthlyFixProcessListPane/ListContainer';

import PaneExpandWrapper from '../../PaneExpandWrapper';

type Props = {
  isExpanded: boolean;
};

export default class AttMonthlyFixProcessListPane extends React.Component<Props> {
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
