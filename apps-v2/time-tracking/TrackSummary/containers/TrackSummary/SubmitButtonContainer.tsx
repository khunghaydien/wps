import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../modules';

import SubmitButton from '../../components/TrackSummary/SubmitButton';

import useRequest from '../hooks/useRequest';

const mapStateToProps = (state: State) => ({
  disabled: false,
  status: state.entities.summary.content.request.status,
});

const SubmitButtonContainer = () => {
  const props = useSelector(mapStateToProps);
  const Request = useRequest();

  // @ts-ignore
  const onClick = useCallback(() => {
    Request.open();
  });

  return <SubmitButton {...props} onClick={onClick} />;
};

export default SubmitButtonContainer;
