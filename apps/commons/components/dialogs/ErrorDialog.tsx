import React from 'react';

import TextUtil from '../../utils/TextUtil';

import BaseWSPError from '../../errors/BaseWSPError';
import iconError from '../../images/iconError.png';
import msg from '../../languages';
import Button from '../buttons/Button';
import DialogFrame from './DialogFrame';

import './ErrorDialog.scss';

const ROOT = 'commons-dialogs-error-dialog';

type Props = {
  error: BaseWSPError;
  handleClose: (event?: React.SyntheticEvent<any>) => void;
};

export default class ErrorDialog extends React.Component<Props> {
  render() {
    const { error, handleClose } = this.props;

    const solution = error.solution ? (
      <div className={`${ROOT}__solution`}>
        <p>{TextUtil.nl2br(error.solution)}</p>
      </div>
    ) : null;

    return (
      <DialogFrame
        title={msg().Com_Lbl_Error}
        className={ROOT}
        zIndex={5999999}
        hide={handleClose}
        footer={
          <DialogFrame.Footer>
            <Button
              id={`${ROOT}__ok-button`}
              type="primary"
              onClick={handleClose}
            >
              OK
            </Button>
          </DialogFrame.Footer>
        }
        initialFocus={`${ROOT}__ok-button`}
      >
        <div className={`${ROOT}__problem`}>
          <div className={`${ROOT}__icon`}>
            <img src={iconError} alt="" />
          </div>
          <div className={`${ROOT}__content`}>
            <p>{TextUtil.nl2br(error.problem || '')}</p>
          </div>
        </div>

        {solution}
      </DialogFrame>
    );
  }
}
