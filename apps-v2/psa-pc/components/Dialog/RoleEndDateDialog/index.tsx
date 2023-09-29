import React, { useState } from 'react';

import { FormikErrors, FormikTouched } from 'formik';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import FormField from '@apps/commons/components/psa/FormField';
import InfoIcon from '@apps/commons/images/icons/info.svg';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import './index.scss';

const ROOT = 'ts-psa__end-date-role-dialog';

type FormikProps = {
  errors: FormikErrors<{
    endDate: string;
  }>;
  touched: FormikTouched<{
    endDate: boolean;
  }>;
  setFieldValue: (key: string, value: string) => void;
  values: {
    comments: string;
    endDate: string;
  };
};

type Props = {
  dateLabel: string;
  handleSubmit: () => void;
  hideDialog: () => void;
  isRescheduled: boolean;
  title: string;
} & FormikProps;

const EndDateRoleDialog = (props: Props) => {
  const { values, title, dateLabel, isRescheduled } = props;
  const infoTextClass = isRescheduled ? `${ROOT}--is-rescheduled` : '';
  const [textAreaLength, setTextAreaLength] = useState(0);

  const onChangeTextArea = (e: any) => {
    const text = e.target.value;
    props.setFieldValue('comments', text.substring(0, 1000));
    setTextAreaLength(text.length > 1000 ? 1000 : text.length);
  };

  return (
    <DialogFrame
      title={title}
      // @ts-ignore
      hide={() => {}}
      withoutCloseButton
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            onClick={props.hideDialog}
            data-testid={`${ROOT}__btn--cancel`}
          >
            {msg().Psa_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            onClick={props.handleSubmit}
            data-testid={`${ROOT}__btn--save`}
          >
            {msg().Com_Btn_Save}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__inner`}>
        <div className={`${ROOT}`}>
          <FormField
            title={dateLabel}
            testId={`${ROOT}__end-date`}
            error={props.errors.endDate}
            isTouched={props.touched.endDate}
            isRequired
          >
            <PsaDateField
              className="ts-text-field slds-input"
              placeholder={msg().Psa_Lbl_SelectEndDate}
              value={DateUtil.format(values.endDate, 'YYYY-MM-DD')}
              onChange={(endDate) => {
                props.setFieldValue('endDate', endDate);
              }}
            />
          </FormField>

          {!isRescheduled && (
            <FormField
              title={msg().Admin_Lbl_Comment}
              className={`${ROOT}__comment`}
              testId={`${ROOT}__comment`}
            >
              <TextAreaField
                placeholder={msg().Psa_Lbl_RoleCommentPlaceholder}
                onChange={onChangeTextArea}
                value={values.comments}
                resize="none"
              />
              <span className={`${ROOT}__textarea-countdown`}>
                {`${textAreaLength}/1000`}
              </span>
            </FormField>
          )}

          <div className={`${ROOT}__info`}>
            <InfoIcon className={`${ROOT}__info-icon`} />
            <div className={`${ROOT}__info-text ${infoTextClass}`}>
              {isRescheduled ? (
                <React.Fragment>
                  <p>{TextUtil.nl2br(msg().Psa_Lbl_RescheduleWarning)}</p>
                </React.Fragment>
              ) : (
                <p>{msg().Psa_Lbl_MarkAsCompletedWarning}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogFrame>
  );
};

export default EndDateRoleDialog;
