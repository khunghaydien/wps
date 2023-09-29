import React from 'react';

import PersonalMenuPopoverButtonContainer from '../../commons/containers/PersonalMenuPopoverButtonContainer';
import msg from '../../commons/languages';
import { NavigationBar as Navigation, Text } from '../../core';

import IconPlanner from '../images/icons/icon_planner.svg';

const NavigationBar: React.FC = () => {
  return (
    <Navigation icon={IconPlanner}>
      <div className="ts-calendar__header">
        <div>
          <Text size="xxl" color="secondary" bold>
            {msg().Cal_Lbl_Planning}
          </Text>
        </div>
        <div className="ts-calendar__header__personal-setting-button">
          <PersonalMenuPopoverButtonContainer />
        </div>
      </div>
    </Navigation>
  );
};

export default NavigationBar;
