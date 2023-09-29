import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../modules';

import LoadingScreen from '../components/LoadingScreen';

const mapStateToProps = (state: State) => ({
  active: (state.app as any).loadingDepth > 0,
});

const LoadingContainer = () => {
  const props = useSelector(mapStateToProps);

  return <LoadingScreen {...props} />;
};

export default LoadingContainer;
