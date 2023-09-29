import React from 'react';

import classNames from 'classnames';

import './IconButton.scss';

/**
 * アイコンボタン - 共通コンポーネント
 */
type Props = {
  src: string;
  alt?: string;
  className?: string;
  srcType?: 'default' | 'svg';
  children?: React.ReactNode;
  testId?: string;
  onClick?: (arg0: React.SyntheticEvent<HTMLButtonElement>) => void;
  fillColor?: string;
  disabled?: boolean;
};

const ROOT = 'ts-icon-button';

export default class IconButton extends React.Component<Props> {
  static defaultProps = {
    alt: '',
    fillColor: '',
  };

  onClick(e: React.SyntheticEvent<HTMLButtonElement>) {
    const { onClick } = this.props;

    if (onClick) {
      onClick(e);
    }
  }

  render() {
    const { className, src, srcType, fillColor, alt, children, ...props } =
      this.props;

    const btnClassNames = classNames(className, ROOT);
    const SvgIcon = srcType === 'svg' ? src : '';

    return (
      <button
        type="button"
        className={btnClassNames}
        onClick={this.onClick}
        {...props}
      >
        {srcType === 'svg' ? (
          <SvgIcon
            /*   
            // @ts-ignore */
            style={{ fill: fillColor }}
            aria-hidden="true"
          />
        ) : (
          <img className={`${ROOT}__image`} src={src} alt={alt} />
        )}
        {children}
      </button>
    );
  }
}
