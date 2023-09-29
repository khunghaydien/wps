import React from 'react';
import SyntheticEvent from 'react-dom';

import Button from '../../../commons/components/buttons/Button';
import PopupWindowNavbar from '../../../commons/components/PopupWindowNavbar';
import PopupWindowPage from '../../../commons/components/PopupWindowPage';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import msg from '../../../commons/languages';

import DetailList, { Props as DetailListProps } from './DetailList';
import Header, { Props as HeaderProps } from './Header';

// Use union type
export type Props = HeaderProps &
  DetailListProps & {
    // Use SyntheticEvent to express React events
    onClickPrintButton: (arg0: React.SyntheticEvent) => void;
  };

export default class App extends React.Component<Props> {
  render() {
    return (
      <GlobalContainer>
        <PopupWindowNavbar title={msg().Att_Lbl_RestReasonDetails}>
          <Button type="text" onClick={this.props.onClickPrintButton}>
            {msg().Com_Btn_Print}
          </Button>
        </PopupWindowNavbar>
        <PopupWindowPage>
          <Header
            period={this.props.period}
            ownerInfos={this.props.ownerInfos}
          />
          {this.props.dailyRestList ? (
            <DetailList dailyRestList={this.props.dailyRestList} />
          ) : null}
        </PopupWindowPage>
      </GlobalContainer>
    );
  }
}
