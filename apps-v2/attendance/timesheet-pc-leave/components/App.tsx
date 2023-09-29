import React from 'react';
import SyntheticEvent from 'react-dom';

import Button from '../../../commons/components/buttons/Button';
import PopupWindowNavbar from '../../../commons/components/PopupWindowNavbar';
import PopupWindowPage from '../../../commons/components/PopupWindowPage';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import msg from '../../../commons/languages';

import { DaysManagedLeave } from '../models/types';

import DaysManagedSection from './DaysManagedSection';
import DetailList, { Props as DetailListProps } from './DetailList';
import Header, { Props as HeaderProps } from './Header';

// Use union type
export type Props = HeaderProps &
  DetailListProps & {
    annualLeave: DaysManagedLeave;
    paidManagedLeave: DaysManagedLeave[];
    unpaidManagedLeave: DaysManagedLeave[];
    compensatoryLeave: DaysManagedLeave[];

    // Use SyntheticEvent to express React events
    onClickPrintButton: (arg0: React.SyntheticEvent) => void;
  };

export default class App extends React.Component<Props> {
  render() {
    return (
      <GlobalContainer>
        <PopupWindowNavbar title={msg().Att_Lbl_LeaveDetails}>
          <Button type="text" onClick={this.props.onClickPrintButton}>
            {msg().Com_Btn_Print}
          </Button>
        </PopupWindowNavbar>
        <PopupWindowPage>
          <Header
            period={this.props.period}
            ownerInfos={this.props.ownerInfos}
          />
          <DaysManagedSection
            annualLeave={this.props.annualLeave}
            paidManagedLeave={this.props.paidManagedLeave}
            unpaidManagedLeave={this.props.unpaidManagedLeave}
            compensatoryLeave={this.props.compensatoryLeave}
          />
          <DetailList leaveDetails={this.props.leaveDetails} />
        </PopupWindowPage>
      </GlobalContainer>
    );
  }
}
