import React from 'react';

import GlobalContainer from '@commons/containers/GlobalContainer';
import ToastContainer from '@commons/containers/ToastContainer';

import FormContainer from './FormContainer';

const ReportDetailContainer = () => {
  return (
    <GlobalContainer>
      <FormContainer />
      <ToastContainer />
    </GlobalContainer>
  );
};

export default ReportDetailContainer;
