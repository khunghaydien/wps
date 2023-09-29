import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import LabelWithHint from '@apps/commons/components/fields/LabelWithHint';
import msg from '@apps/commons/languages';

import { Vendor } from '@apps/domain/models/exp/Vendor';
import { OrganizationSetting } from '@apps/domain/models/UserSetting';

import Skeleton from '../../../../Skeleton';
import VendorForm, { Errors } from './VendorForm';

type FormikProps = {
  dirty: boolean;
  errors: Errors;
  useJctRegistrationNumber: boolean;
  values: Vendor;
  handleSubmit: () => void;
  resetForm: () => void;
  setFieldValue: (field: string, value: any, shouldValidate: boolean) => void;
};

export type Props = {
  currencyCodeList: Array<{ label: string; value: string }>;
  hintMsg?: string;
  isCreate?: boolean;
  isFinanceApproval: boolean;
  isLoading: boolean;
  organizationSetting: OrganizationSetting;
  vendorInfo: Vendor;
  hideDialog: () => void;
  save: (vendor: Vendor) => void;
  update: (vendor: Vendor) => void;
} & FormikProps;

const S = {
  Dialog: styled(DialogFrame)`
    width: 800px;
    height: 600px;
  `,
  Content: styled.div`
    height: 100%;
    overflow: auto;
  `,
  Label: styled(LabelWithHint)`
    margin-left: ${({ isRequired }) => (isRequired ? 0 : '10px')};
    margin-top: 6px;
    height: 37px;
    display: flex;
    align-items: center;
    & > p {
      margin-bottom: 0;
    }
  `,
  SkeletonWithPadding: styled(Skeleton)`
    padding-top: 20px;
  `,
};

const PersonalVendorDialog = (props: Props) => {
  const saveModeLabels = [msg().Com_Btn_Cancel, msg().Com_Btn_Save];
  const editModeLabels = [msg().Com_Btn_Close, msg().Com_Btn_Edit];

  const [disable, setDisable] = useState(false);
  const [actionLabels, setActionLabels] = useState(saveModeLabels);

  useEffect(() => {
    if (!props.isCreate) {
      setDisable(true);
      setActionLabels(editModeLabels);
    }
  }, []);

  const onClickSave = () => {
    if (props.dirty) {
      props.handleSubmit();
    }
  };

  const onClickEdit = (): void => {
    setDisable(false);
    setActionLabels(saveModeLabels);
  };

  const onClickCancel = () => {
    props.resetForm();
    setActionLabels(editModeLabels);
    setDisable(true);
  };

  const onClickClose = () => {
    props.hideDialog();
  };

  const { isCreate, hintMsg, dirty, isFinanceApproval, hideDialog } = props;
  const vendorInfo = props.values;
  const title = isCreate
    ? msg().Exp_Lbl_CreateNewPersonalVendor
    : msg().Exp_Lbl_VendorDetail;
  const actionType = isCreate ? 'primary' : 'default';
  const handleAction =
    actionLabels[1] === msg().Com_Btn_Save ? onClickSave : onClickEdit;
  const handleCancel =
    actionLabels[0] === msg().Com_Btn_Close || isCreate
      ? onClickClose
      : onClickCancel;

  return (
    <S.Dialog
      title={title}
      hide={hideDialog}
      footer={
        <DialogFrame.Footer
          sub={
            <S.Label
              text={(hintMsg && msg().Exp_Lbl_Hint) || ''}
              hintMsg={hintMsg}
              infoAlign="left"
            />
          }
        >
          <Button type="default" onClick={handleCancel}>
            {actionLabels[0]}
          </Button>
          {!isFinanceApproval && (
            <Button
              type={actionType}
              disabled={isCreate && !dirty}
              onClick={handleAction}
            >
              {actionLabels[1]}
            </Button>
          )}
        </DialogFrame.Footer>
      }
    >
      <S.Content>
        {props.isLoading ? (
          <S.SkeletonWithPadding
            noOfRow={8}
            colWidth="100%"
            rowHeight="25px"
            margin="30px"
          />
        ) : (
          <VendorForm
            currencyCodeList={props.currencyCodeList}
            disable={disable}
            errors={props.errors}
            organizationSetting={props.organizationSetting}
            vendorInfo={vendorInfo}
            setFieldValue={props.setFieldValue}
            useJctRegistrationNumber={props.useJctRegistrationNumber}
          />
        )}
      </S.Content>
    </S.Dialog>
  );
};

export default PersonalVendorDialog;
