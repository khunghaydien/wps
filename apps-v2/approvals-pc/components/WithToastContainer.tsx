import React from 'react';

import GlobalContainer from '@commons/containers/GlobalContainer';
import ToastContainer from '@commons/containers/ToastContainer';

const WithToastContainer = (WrappedComponent) => () => {
  return (
    <GlobalContainer>
      <WrappedComponent />
      <ToastContainer />
    </GlobalContainer>
  );
};

export default WithToastContainer;
