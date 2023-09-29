import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import DateField from '../../../../commons/components/fields/DateField';
import Label from '../../../../commons/components/fields/Label';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import HorizontalLayoutBody from '../../../../commons/components/fields/layouts/HorizontalLayout/Body';
import HorizontalLayoutLabel from '../../../../commons/components/fields/layouts/HorizontalLayout/Label';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';

import './NewGrantForm.scss';

const ROOT = 'admin-pc-annual-paid-leave-management-new-grant-form';

export type Props = {
  daysGranted: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
  onChangeDaysGranted: (arg0: string) => void;
  onChangeValidDateFrom: (arg0: string) => void;
  onChangeValidDateTo: (arg0: string) => void;
  onChangeComment: (arg0: string) => void;
  onSubmitNewGrantForm: (arg0: void) => void;
};

export default class NewGrantForm extends React.Component<Props> {
  constructor() {
    // @ts-ignore
    super();
    this.onChangeDaysGranted = this.onChangeDaysGranted.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmitNewGrantForm = this.onSubmitNewGrantForm.bind(this);
  }

  onChangeDaysGranted(
    originalEvent: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) {
    this.props.onChangeDaysGranted(value);
  }

  onChangeComment(
    originalEvent: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) {
    this.props.onChangeComment(value);
  }

  onSubmitNewGrantForm(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onSubmitNewGrantForm();
  }

  render() {
    return (
      <div className={ROOT}>
        <h3 className={`${ROOT}__title`}>{msg().Com_Lbl_Grant}</h3>

        <form className={`${ROOT}__form`} onSubmit={this.onSubmitNewGrantForm}>
          <HorizontalLayout>
            <HorizontalLayoutLabel cols={2} required>
              {msg().Admin_Lbl_DaysGranted}
            </HorizontalLayoutLabel>
            <HorizontalLayoutBody cols={2}>
              <div className="slds-grid slds-grid--vertical-align-center">
                <div className="slds-grow">
                  <TextField
                    id="days_granted"
                    type="number"
                    value={this.props.daysGranted}
                    isRequired
                    min="1"
                    step="1"
                    autoFocus
                    onChange={this.onChangeDaysGranted}
                  />
                </div>
                <div className={`slds-shrink ${ROOT}__granted-days-unit`}>
                  {msg().Com_Lbl_Day_s}
                </div>
              </div>
            </HorizontalLayoutBody>
          </HorizontalLayout>
          <Label
            id="valid_date_from"
            labelCols={2}
            childCols={3}
            text={msg().Admin_Lbl_LeaveGrantValidDateFrom}
          >
            <DateField
              value={this.props.validDateFrom}
              required
              className="slds-input"
              onChange={this.props.onChangeValidDateFrom}
            />
          </Label>
          <Label
            id="valid_date_to"
            labelCols={2}
            childCols={3}
            text={msg().Admin_Lbl_LeaveGrantValidDateTo}
          >
            <DateField
              value={this.props.validDateTo}
              required
              className="slds-input"
              onChange={this.props.onChangeValidDateTo}
            />
          </Label>
          <Label labelCols={2} childCols={5} text={msg().Admin_Lbl_Comment}>
            <TextField
              id="comment"
              type="text"
              value={this.props.comment}
              onChange={this.onChangeComment}
            />
          </Label>

          <div className="slds-grid">
            {/* empty element to align button */}
            <div className="slds-size--2-of-12 slds-grow-none slds-shrink-none" />
            <div className="slds-size--4-of-12 slds-grow-none slds-shrink-none">
              <Button type="primary" submit className={`${ROOT}__button`}>
                {msg().Com_Btn_Execute}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
