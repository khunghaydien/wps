import React from 'react';

import msg from '../../../commons/languages';
import { NavigationBar as Navigation, Text } from '../../../core';

import Icon from '../images/Track.svg';

const NavigationBar = () => {
  return (
    <Navigation icon={Icon}>
      <Text size="xxl" color="secondary" bold>
        {msg().Trac_Lbl_TimeTrack}
      </Text>
    </Navigation>
  );
};

export default NavigationBar;
