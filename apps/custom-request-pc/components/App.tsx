import React from 'react';

import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';

import DetailContainer from '../containers/DetailContainer';
import ListContainer from '../containers/ListContainer';
import DialogContainer from '@custom-request-pc/containers/Dialogs/DialogContainer';

import { pageView } from '../consts';

type Props = {
  pageView: string;
};

// TODO: Add transition
const getContainer = (curView) => {
  switch (curView) {
    case pageView.Detail:
      return <DetailContainer />;
    default:
      return <ListContainer />;
  }
};
const App = (props: Props) => {
  return (
    <GlobalContainer>
      {getContainer(props.pageView)}
      <DialogContainer />
      <ToastContainer />
    </GlobalContainer>
  );
};

export default App;
