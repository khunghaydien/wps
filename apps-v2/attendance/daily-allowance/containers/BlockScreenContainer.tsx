import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../modules';

import BlockScreen from '../components/BlockScreen';

const mapStateToProps = (state: State) => ({
  active: state.ui.blocking.enabled,
});

const BlockScreenContainer = () => {
  const props = useSelector(mapStateToProps);

  return <BlockScreen {...props} />;
};

export default BlockScreenContainer;
