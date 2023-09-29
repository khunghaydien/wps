import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../../modules';

import CardHeader from '../../../components/TrackSummary/RequestCompact/CardHeader';

type OwnProps = {
  /**
   * Toggle open/closed state of card
   */
  readonly onToggle: () => void;
  /**
   * Indicates open/closed state of card
   */
  readonly isOpen: boolean;
};

const CardHeaderContainer = (ownProps: OwnProps) => {
  const useRequest = useSelector(
    (state: State) => state.entities.summary.content.useRequest
  );

  return <CardHeader useRequest={useRequest} {...ownProps} />;
};

export default CardHeaderContainer;
