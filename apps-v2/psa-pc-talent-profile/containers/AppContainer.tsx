import React from 'react';

import GlobalContainer from '../../commons/containers/GlobalContainer';
import ToastContainer from '../../commons/containers/ToastContainer';

import '../modules';

import TalentProfileContainer from './TalentProfileContainer';

const AppContainer = () => {
  return (
    <GlobalContainer>
      <ToastContainer />
      <TalentProfileContainer />
    </GlobalContainer>
  );
};

export default AppContainer;
