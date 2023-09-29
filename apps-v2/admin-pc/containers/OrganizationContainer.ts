import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as organization from '../actions/organization';

import Organization from '../presentational-components/Organization';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: organization.getOrganizationSetting,
    update: organization.updateOrganizationSetting,
  };

  const actions = bindActionCreators(alias, dispatch);
  return { actions };
};

// const mergeProps = (stateProps, dispatchProps, ownProps) => {
//   console.log("aaaaaaa")
//   console.log(stateProps);
//   console.log(dispatchProps);
//   console.log(ownProps);
//  const actions = Object.assign(ownProps.action, dispatchProps,
// //   return Object.assign({}, ownProps, {
// //     todos: stateProps.todos[ownProps.userId],
// //     addTodo: (text) => dispatchProps.addTodo(ownProps.userId, text)
// //   })
// }

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
