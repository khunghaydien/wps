import * as React from 'react';

import msg from '../../../../commons/languages';
import RefreshButton from '../commons/Buttons/RefreshButton';
import DailyHeader from '../commons/Headers/DailyHeader';

import TextButton from '../../atoms/TextButton';

import './DailyTaskNavigation.scss';

const ROOT = 'mobile-app-molecules-tracking-daily-task-navigation';

type Props = Readonly<{
  today: string;
  listEditing: boolean;
  onClickMonthlySummary: () => void;
  onClickPrevDate: () => void;
  onClickNextDate: () => void;
  onChangeDate: (date: string) => void;
  onToggleEditing: () => void;
  onClickRefresh: () => void;
}>;

export default class DailyTaskNavigation extends React.Component<Props> {
  render() {
    const { listEditing } = this.props;
    const headerProps = listEditing
      ? {}
      : {
          onChangeDate: this.props.onChangeDate,
          onClickPrevDate: this.props.onClickPrevDate,
          onClickNextDate: this.props.onClickNextDate,
        };

    return (
      <DailyHeader
        title={msg().Trac_Lbl_DailyTimeTrack}
        currentDate={this.props.today}
        actions={[
          <TextButton onClick={this.props.onToggleEditing}>
            {listEditing ? msg().Com_Btn_Discard : msg().Com_Btn_Edit}
          </TextButton>,
          <RefreshButton
            className={`${ROOT}__refresh`}
            onClick={this.props.onClickRefresh}
            disabled={listEditing}
          />,
        ]}
        disabledNextDate={listEditing}
        disabledPrevDate={listEditing}
        {...headerProps}
      />
    );
  }
}
