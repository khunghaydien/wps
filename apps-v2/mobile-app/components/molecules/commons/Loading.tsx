import * as React from 'react';

import Modal from '../../atoms/Modal';
import Spinner from '../../atoms/Spinner';

import './Loading.scss';
import colors from '../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-molecules-commons-loading';

type Props = {
  theme: 'light' | 'dark';
  text?: string;
};

export default class Loading extends React.PureComponent<Props> {
  render() {
    const spinnerColor = {
      light: colors.blue300,
      dark: colors.blue400,
    };

    return (
      <Modal persistent className={ROOT} theme={this.props.theme}>
        <Spinner color={spinnerColor[this.props.theme]} />
        <div className={`${ROOT}__text`}>{this.props.text}</div>
      </Modal>
    );
  }
}
