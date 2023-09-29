import React from 'react';

import classNames from 'classnames';

import './CommentNarrowField.scss';

const ROOT = 'common-fields-comment-field-narrow';

type Props = {
  icon: string;
  className: string;
  value: string;
  maxLength: number;
  onChange: Function;
};
/**
 * テキスト項目 - 共通コンポーネント
 */
export default class CommentNarrowField extends React.Component<Props> {
  static defaultProps = {
    className: '',
    value: '',
    maxLength: null,
    onChange: null,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value, e);
    }
  }

  render() {
    const cssClass = classNames(ROOT, this.props.className);

    return (
      <div className={cssClass}>
        <div className={`${ROOT}__icon`}>
          <img
            className={`${ROOT}__icon-img`}
            src={this.props.icon}
            alt=""
            aria-hidden="true"
          />
        </div>

        <div className={`${ROOT}__bubble`}>
          <textarea
            className={`${ROOT}__textarea slds-textarea`}
            onChange={this.onChange}
            value={this.props.value}
            maxLength={this.props.maxLength}
          />
        </div>
      </div>
    );
  }
}
