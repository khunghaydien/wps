import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as country from '../actions/country';

import { Props as OwnProps } from '../components/Admin/ContentsSelector';
import Country, { Props } from '../presentational-components/Country';

const mapStateToProps = (state) => {
  return {
    searchCountry: state.searchCountry,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: country.createCountry,
    update: country.updateCountry,
    delete: country.deleteCountry,
    search: country.searchCountry,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, country), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Country) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
