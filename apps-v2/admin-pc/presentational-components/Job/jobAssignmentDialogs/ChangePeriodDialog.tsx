import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DialogFrame from '../../../../commons/components/dialogs/DialogFrame';
import DateRangeField from '../../../../commons/components/fields/DateRangeField';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import msg from '../../../../commons/languages';

import './ChangePeriodDialog.scss';

const ROOT = 'admin-pc-job-job-assignment-dialogs-change-period-dialog';

type Props = Readonly<{
  validDateThrough: string;
  validDateFrom: string;
  minValidDateFrom: string | null | undefined;
  canSubmit: boolean;
  submit: () => void;
  cancel: () => void;
  updateValidDateThrough: (arg0: string) => void;
  updateValidDateFrom: (arg0: string) => void;
}>;

export default class ChangePeriodDialog extends React.Component<Props> {
  render() {
    return (
      <DialogFrame
        className={`${ROOT}`}
        title={msg().Admin_Lbl_ChangePeriod}
        hide={this.props.cancel}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.cancel}>
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              type="primary"
              onClick={this.props.submit}
              disabled={!this.props.canSubmit}
            >
              {msg().Com_Btn_Execute}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__body`}>
          <div className={`${ROOT}__control`}>
            <HorizontalLayout>
              <HorizontalLayout.Label>
                {msg().Admin_Lbl_Period}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>
                <DateRangeField
                  startDateFieldProps={{
                    minDate: this.props.minValidDateFrom,
                    value: this.props.validDateFrom,
                    onChange: this.props.updateValidDateFrom,
                  }}
                  endDateFieldProps={{
                    minDate: this.props.validDateFrom,
                    value: this.props.validDateThrough,
                    onChange: this.props.updateValidDateThrough,
                  }}
                  required
                />
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </div>
        </div>
      </DialogFrame>
    );
  }
}
