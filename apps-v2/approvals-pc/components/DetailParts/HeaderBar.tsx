import React from 'react';

import classNames from 'classnames';

import Button from '../../../commons/components/buttons/Button';
import imgIconArrowLongRight from '../../../commons/images/iconArrowLongRight.png';
import msg from '../../../commons/languages';

import './HeaderBar.scss';

const ROOT = 'approvals-pc-tracking-detail-parts-header-bar';

type Meta = {
  label: string;
  value: string;
  show?: boolean;
};

type Props = {
  title: string;
  headingLevel?: number;
  isExpanded?: boolean;
  onTogglePane?: () => void;
  meta: Meta[];
};

export default class HeaderBar extends React.Component<Props> {
  static defaultProps = {
    headingLevel: 2,
    meta: [],
  };

  renderMeta(meta: Meta) {
    return (
      <span key={meta.label} className={`${ROOT}__meta`}>
        <span className={`${ROOT}__meta-name`}>{meta.label}</span>
        <span className={`${ROOT}__meta-content`}>{meta.value}</span>
      </span>
    );
  }

  renderExpandableButton() {
    const btnExpandImageAlt = this.props.isExpanded
      ? msg().Com_Btn_Contract
      : msg().Com_Btn_Expand;

    const btnExpandImageCssClass = classNames(`${ROOT}__btn-expand-image`, {
      [`${ROOT}__btn-expand-image--is-expand`]: this.props.isExpanded,
    });

    return this.props.onTogglePane && this.props.isExpanded !== undefined ? (
      <Button
        type="outline-default"
        className={`${ROOT}__btn-expand`}
        onClick={this.props.onTogglePane}
      >
        <img
          src={imgIconArrowLongRight}
          className={`${btnExpandImageCssClass}`}
          alt={btnExpandImageAlt}
        />
      </Button>
    ) : null;
  }

  render() {
    const Heading: any = `h${
      this.props.headingLevel !== undefined && this.props.headingLevel !== null
        ? this.props.headingLevel
        : HeaderBar.defaultProps.headingLevel
    }`;

    return (
      <header className={`${ROOT}`}>
        {this.renderExpandableButton()}

        <Heading className={`${ROOT}__body`}>{this.props.title}</Heading>

        <span
          className={classNames(`${ROOT}__meta-wrapper`, {
            [`${ROOT}__meta-wrapper--is-expand`]: this.props.isExpanded,
          })}
        >
          {this.props.meta.map(this.renderMeta)}
        </span>
      </header>
    );
  }
}
