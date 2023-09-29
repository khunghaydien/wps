import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import Footer from '../../../commons/components/dialogs/DialogFrame/Footer';
import Label from '../../../commons/components/fields/Label';
import SelectField from '../../../commons/components/fields/SelectField';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';
import DurationUtil from '../../../commons/utils/DurationUtil';

import './UpdateDialog.scss';

const ROOT = 'admin-pc-managed-leave-management-update-dialog';

export type Props = {
  isVisible: boolean;
  targetGrantHistoryRecordId: string | null | undefined;
  targetGrantHistoryRecordValidDateFrom: string | null | undefined;
  targetGrantHistoryRecordValidDateTo: string | null | undefined;
  targetGrantHistoryRecordDaysGranted: number | null | undefined;
  targetGrantHistoryRecordHoursGranted: number | null | undefined;
  newDaysGranted: string | null | undefined;
  onChangeNewDaysGranted: (arg0: string) => void;
  onClickExecuteButton: () => void;
  onClickCancelButton: () => void;
  onClickDeleteButton: () => void;
};

export default class UpdateDialog extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onChangeNewDaysGranted = this.onChangeNewDaysGranted.bind(this);
    this.onClickExecuteButton = this.onClickExecuteButton.bind(this);
  }

  onChangeNewDaysGranted(event: React.SyntheticEvent<HTMLSelectElement>) {
    this.props.onChangeNewDaysGranted(event.currentTarget.value);
  }

  onClickExecuteButton(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onClickExecuteButton();
  }

  render() {
    return this.props.isVisible &&
      this.props.targetGrantHistoryRecordId !== null &&
      this.props.targetGrantHistoryRecordId !== undefined ? (
      <form onSubmit={this.onClickExecuteButton}>
        <DialogFrame
          title={msg().Com_Lbl_Arrangement}
          hide={this.props.onClickCancelButton}
          footer={
            <Footer
              sub={
                this.props.targetGrantHistoryRecordHoursGranted === 0 &&
                this.props.targetGrantHistoryRecordDaysGranted >= 1 ? (
                  <Button
                    type="destructive"
                    onClick={this.props.onClickDeleteButton}
                  >
                    {msg().Com_Btn_Delete}
                  </Button>
                ) : null
              }
            >
              <Button type="default" onClick={this.props.onClickCancelButton}>
                {msg().Com_Btn_Cancel}
              </Button>
              {this.props.targetGrantHistoryRecordHoursGranted === 0 &&
              this.props.targetGrantHistoryRecordDaysGranted >= 1 ? (
                <Button
                  type="primary"
                  submit
                  disabled={
                    this.props.newDaysGranted ===
                    String(this.props.targetGrantHistoryRecordDaysGranted)
                  }
                >
                  {msg().Com_Btn_Execute}
                </Button>
              ) : (
                <Button
                  type="destructive"
                  onClick={this.props.onClickDeleteButton}
                >
                  {msg().Com_Btn_Delete}
                </Button>
              )}
            </Footer>
          }
          className={ROOT}
        >
          <div className={`${ROOT}__inner`}>
            <Label
              labelCols={4}
              childCols={8}
              text={msg().Admin_Lbl_LeaveGrantValidDateFrom}
            >
              <TextField
                type="number"
                value={DateUtil.formatYMD(
                  this.props.targetGrantHistoryRecordValidDateFrom
                )}
                readOnly
              />
            </Label>
            <Label
              labelCols={4}
              childCols={8}
              text={msg().Admin_Lbl_LeaveGrantValidDateTo}
            >
              <TextField
                type="number"
                value={DateUtil.formatYMD(
                  this.props.targetGrantHistoryRecordValidDateTo
                )}
                readOnly
              />
            </Label>
            <Label
              labelCols={4}
              childCols={4}
              text={msg().Admin_Lbl_DaysGranted}
            >
              {this.props.targetGrantHistoryRecordHoursGranted === 0 &&
              this.props.targetGrantHistoryRecordDaysGranted >= 1 ? (
                <div className="slds-grid slds-grid--vertical-align-center">
                  <div className="slds-grow">
                    <SelectField
                      options={Array.from(
                        {
                          length:
                            this.props.targetGrantHistoryRecordDaysGranted + 1,
                        },
                        (v, k) => ({
                          text: String(k),
                          value: String(k),
                        })
                      ).reverse()}
                      value={this.props.newDaysGranted}
                      className={`${ROOT}__days-granted`}
                      onChange={this.onChangeNewDaysGranted}
                    />
                  </div>
                  <div className={`slds-shrink ${ROOT}__days-granted-unit`}>
                    {msg().Com_Lbl_Day_s}
                  </div>
                </div>
              ) : (
                <div className={`${ROOT}__hours-granted-unit`}>
                  <span className={`${ROOT}__hours-granted-span`}>
                    {DurationUtil.formatDaysAndHoursWithUnit(
                      this.props.targetGrantHistoryRecordDaysGranted,
                      this.props.targetGrantHistoryRecordHoursGranted
                    )}
                  </span>
                </div>
              )}
            </Label>
          </div>
        </DialogFrame>
      </form>
    ) : null;
  }
}
