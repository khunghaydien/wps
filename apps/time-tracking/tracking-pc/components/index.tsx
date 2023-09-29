import React from 'react';

import GlobalContainer from '../../../commons/containers/GlobalContainer';

import ListContainer from '../containers/ListContainer';
import PeriodNavigation from '../containers/PeriodNavigationContainer';

import NavigationBar from './NavigationBar';

import './index.scss';

const ROOT = 'tracking-pc';

export default class Tracking extends React.Component {
  render() {
    return (
      <GlobalContainer>
        <NavigationBar />
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__nav`}>
            <PeriodNavigation />
          </div>
          <ListContainer />
        </div>
      </GlobalContainer>
    );
  }
}
