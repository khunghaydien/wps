import classnames from 'classnames';

import styled from 'styled-components';

import '../../../../commons/styles/wsp.scss';

type Props = Readonly<{
  default?: boolean;
  primary?: boolean;
  secondary?: boolean;
  error?: boolean;
  text?: boolean;
  icon?: boolean;
}>;

const Button = styled.button.attrs<Props>((props) => ({
  className: classnames('wsp-button', {
    '': props.default,
    'wsp-button--primary': props.primary,
    'wsp-button--secondary': props.secondary,
    'wsp-button--error': props.error,
    'wsp-button--text': props.text,
    'wsp-button--icon': props.icon,
  }) as any,
}))<Props>``;

export default Button;
