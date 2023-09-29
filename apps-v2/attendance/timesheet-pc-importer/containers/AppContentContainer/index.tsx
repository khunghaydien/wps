import React from 'react';
import { useSelector } from 'react-redux';

import Component from '@attendance/timesheet-pc-importer/components/AppContent';

import ContentContainer from './ContentContainer';
import HeaderContainer from './HeaderContainer';
import { AppState } from '@attendance/timesheet-pc-importer/store/AppStore';

const AppContentContainer: React.FC = () => {
  const id = useSelector((state: AppState) => state.timesheet.id);
  return (
    <Component
      // 新規で入力する際に再描画を促すために key を入れている
      key={id}
      HeaderContainer={HeaderContainer}
      ContentContainer={ContentContainer}
    />
  );
};

export default AppContentContainer;
