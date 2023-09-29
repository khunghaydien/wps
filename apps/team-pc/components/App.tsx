import React from 'react';

import GlobalHeader from '../../commons/components/GlobalHeader';
import GlobalContainer from '../../commons/containers/GlobalContainer';
import msg from '../../commons/languages';

import AttRequestStatusContainer from '../containers/AttRequestStatusContainer';

import imgIconHeader from '../images/Team.svg';

type Props = Readonly<Record<string, unknown>>;

export default class App extends React.Component<Props> {
  render() {
    return (
      <GlobalContainer>
        <GlobalHeader
          iconSrc={imgIconHeader}
          iconSrcType="svg"
          iconAssistiveText={msg().Att_Lbl_TimeAttendance}
          showPersonalMenuPopoverButton={false}
          showProxyIndicator={false}
        />
        <AttRequestStatusContainer />
      </GlobalContainer>
    );
  }
}
