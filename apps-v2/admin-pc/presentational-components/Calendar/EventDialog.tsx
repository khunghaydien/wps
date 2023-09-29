import React from 'react';

import configList from '../../constants/configList/calendarRecord';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import msg from '../../../commons/languages';

import { CalendarEvent } from '../../models/calendar/CalendarEvent';

import DetailItem from '../../components/MainContents/DetailPane/DetailItem';

import './EventDialog.scss';

const ROOT = 'admin-pc-calendar-event-dialog';

export type Props = {
  event: CalendarEvent | null | undefined;
  sfObjFieldValues: Record<string, unknown>;
  getOrganizationSetting: Record<string, unknown>;
  onChangeDetailItem: (arg0: any) => void;
  onSubmit: (arg0: any) => void;
  onCancel: () => void;
};

export default class EventDialog extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    // @ts-ignore
    this.props.onSubmit();
  }

  renderFooter() {
    return (
      <DialogFrame.Footer>
        <Button key="cancel" onClick={this.props.onCancel}>
          {msg().Com_Btn_Cancel}
        </Button>
        <Button key="submit" type="primary" submit>
          {msg().Com_Btn_Save}
        </Button>
      </DialogFrame.Footer>
    );
  }

  render() {
    if (!this.props.event) {
      return null;
    }

    return (
      // @ts-ignore
      <form onSubmit={this.onSubmit} action="/#">
        <DialogFrame
          className={ROOT}
          title={msg().Att_Lbl_Event}
          footer={this.renderFooter()}
          hide={this.props.onCancel}
        >
          <div className={`${ROOT}__body`}>
            <ul className={`${ROOT}__item-list`}>
              {configList.base.map((config) =>
                config.key ? (
                  <DetailItem
                    key={config.key}
                    config={config}
                    tmpEditRecord={this.props.event}
                    sfObjFieldValues={this.props.sfObjFieldValues}
                    getOrganizationSetting={this.props.getOrganizationSetting}
                    onChangeDetailItem={this.props.onChangeDetailItem}
                  />
                ) : null
              )}
            </ul>
          </div>
        </DialogFrame>
      </form>
    );
  }
}
