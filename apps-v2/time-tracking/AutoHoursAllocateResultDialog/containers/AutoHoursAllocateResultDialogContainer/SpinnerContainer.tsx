import React from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@commons/components/Spinner';
import { selectors } from '@commons/modules/app';

import { State } from '../../modules';

const SpinnerContainer: React.FC = () => {
  const loading = useSelector((state: State) =>
    selectors.loadingSelector(state)
  );

  return <Spinner loading={loading} />;
};

export default SpinnerContainer;
