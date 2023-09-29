import { connect } from 'react-redux';

import { $PropertyType } from 'utility-types';

import Component from '../../../components/organisms/commons/LoadingPage';
import { isShowing } from '../../../modules/commons/loading';

import { State } from '../../../modules';

type Props = $PropertyType<Component, 'props'>;

const mapStateToProps = (state: State, ownProps): Props => ({
  ...ownProps,
  isShowing: isShowing(state.mobileCommons.loading),
});

export default connect(mapStateToProps)(
  Component as React.ComponentType<Props>
);
