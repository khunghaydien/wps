import React from 'react';

import TextUtil from '@commons/utils/TextUtil';

import BaseWSPError from '../errors/BaseWSPError';
import iconAuthority from '../images/icon_Authority.png';
import iconErrorLarge from '../images/iconErrorLarge.png';
import msg from '../languages';

import './ErrorPage.scss';

const ROOT = 'commons-error-page';

type Props = {
  error: BaseWSPError;
};
export default class ErrorPage extends React.Component<Props> {
  render() {
    const { error } = this.props;

    const solution = error.isFunctionCantUseError
      ? msg().Exp_Msg_Inquire
      : error.solution;

    const solutionArea = solution ? (
      <div className={`${ROOT}__solution`}>
        <p>{solution}</p>
      </div>
    ) : null;

    const icon = error.isFunctionCantUseError ? iconAuthority : iconErrorLarge;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__problem`}>
          <div className={`${ROOT}__icon`}>
            <img src={icon} alt="" />
          </div>
          <p>{TextUtil.nl2br(error.problem)}</p>
        </div>
        {solutionArea}
      </div>
    );
  }
}
