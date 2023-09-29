import React from 'react';

import classNames from 'classnames';

import './Button.scss';

type Props = {
  type:
    | 'outline-default'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'text';

  iconSrc?: string;
  iconSrcType?: 'svg' | 'png';
  iconAlt?: string;
  iconAlign?: 'left' | 'right';
  className?: string;
  onClick?: (arg0) => void;
  children?: React.ReactNode;
  submit?: boolean;
  value?: string;
  disabled?: boolean;
  'data-testid'?: string;
  // TODO remove unused id for all places using Button
  id?: string;
};

/**
 * ボタン - 共通コンポーネント
 */
const ROOT = 'ts-button';
export default class Button extends React.Component<Props> {
  static get defaultProps() {
    return {
      type: 'default',
      iconAlign: 'left',
      submit: false,
      value: '',
      disabled: false,
    };
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  }

  renderIcon() {
    const { iconSrc, iconSrcType, iconAlt, iconAlign } = this.props;

    if (iconSrcType === 'svg') {
      const Icon = iconSrc;
      return <Icon />;
    }

    const iconClass = classNames(`${ROOT}__icon`, {
      [`${ROOT}__icon--right`]: iconAlign === 'right',
    });

    return <img className={iconClass} src={iconSrc} alt={iconAlt} />;
  }

  render() {
    const { className, children, type, iconSrc, iconAlign, submit, ...props } =
      this.props;

    // button elementに渡すとwarningとなる
    delete props.iconAlt;

    const btnClassNames = classNames(
      className,
      ROOT,
      type ? `${ROOT}--${type}` : ''
    );

    const buttonType = submit ? 'submit' : 'button';

    return (
      <button
        data-testid={props['data-testid']}
        type={buttonType}
        className={btnClassNames}
        onClick={this.onClick}
        {...props}
        value={this.props.value}
        disabled={this.props.disabled}
      >
        <div className={`${ROOT}__contents`}>
          {iconSrc && iconAlign === 'left' ? this.renderIcon() : null}
          <span className={`${ROOT}__text`}>{children}</span>
          {iconSrc && iconAlign === 'right' ? this.renderIcon() : null}
        </div>
      </button>
    );
  }
}
