import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import * as attLegalAgreementGroup from '../actions/attLegalAgreementGroup';

import AttLegalAgreementGroup from '../presentational-components/AttLegalAgreementGroup';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchLegalAgreementGroup: state.searchLegalAgreementGroup,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: attLegalAgreementGroup.createLegalAgreementGroup,
    update: attLegalAgreementGroup.updateLegalAgreementGroup,
    delete: attLegalAgreementGroup.deleteLegalAgreementGroup,
    search: attLegalAgreementGroup.searchLegalAgreementGroup,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, attLegalAgreementGroup), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttLegalAgreementGroup);
