import React from 'react';

import styled from 'styled-components';

import msg from '../../../../commons/languages';

import Input from '../../atoms/Fields/Input';
import FooterOptionsModal from './FooterOptionsModal';

type Props = {
  className?: string;
  multiple?: boolean;
  closeModal: () => void;
  handleAttachFile: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
  openReceiptLibrary: () => void;
  title?: string;
};

const S = {
  Label: styled.label`
    width: 100%;
    text-align: left;
  `,
};

const UploadOptionsModal = (props: Props) => {
  const {
    className = 'upload-options-modal',
    closeModal,
    handleAttachFile,
    openReceiptLibrary,
    multiple = false,
    title = msg().Exp_Btn_AddReceipt,
  } = props;

  const selectionModal = (
    <FooterOptionsModal
      title={title}
      menuItems={[
        {
          label: (
            <S.Label>
              <Input
                className={`${className}__input`}
                type="file"
                accept="image/*"
                capture="camera"
                onChange={(e: any) => {
                  closeModal();
                  handleAttachFile(e);
                  e.target.value = '';
                }}
                multiple={multiple}
              />
              {msg().Exp_Lbl_SelectFromDevice}
            </S.Label>
          ),
        },
        {
          label: msg().Exp_Lbl_SelectReceiptLibrary,
          action: openReceiptLibrary,
        },
      ]}
      closeModal={closeModal}
    />
  );

  return selectionModal;
};

export default UploadOptionsModal;
