import { connect } from 'react-redux';
import { compose } from 'redux';

import lifecycle from '../../../concerns/lifecycle';

import { AppDispatch } from '../../../action-dispatchers/AppThunk';

import SampleaPage from '../../../components/pages/sample/SamplePage';

const mapStateToProps = (_state, ownProps) => ({ ...ownProps });

const mapDispatchToProps = (_dispatch: AppDispatch) => ({});

const mergeProps = (_stateProps, _dispatchProps, ownProps) => ({ ...ownProps });

export default compose(
  lifecycle({
    componentDidMount: (_dispatch, props: { color: 'string' }) => {
      console.log(props);
      window.alert('Hello!');
    },
    componentWillUnmount: () => window.alert('By!'),
  }),
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(SampleaPage) as React.ComponentType<{
  [key: string]: any;
}>;
