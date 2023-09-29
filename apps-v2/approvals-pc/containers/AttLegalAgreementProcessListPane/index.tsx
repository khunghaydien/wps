import React from 'react';
import { connect } from 'react-redux';

import { State } from '../../modules';

import PaneExpandWrapper from '../../components/PaneExpandWrapper';

import DetailContainer from './DetailContainer';
import ListContainer from './ListContainer';

type Props = {
  isExpanded: boolean;
};

class AttLegalAgreementProcessListPane extends React.Component<Props> {
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

const mapStateToProps = (state: State) => {
  return {
    isExpanded: state.ui.attLegalAgreement.isExpanded,
  };
};

export default connect(mapStateToProps)(AttLegalAgreementProcessListPane);
