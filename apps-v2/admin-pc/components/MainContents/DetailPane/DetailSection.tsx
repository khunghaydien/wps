import React from 'react';

import DetailSectionHeader from './DetailSectionHeader';

import './DetailSection.scss';

const ROOT = 'admin-pc-main-contents-detail-pane-detail-section';

type Props = {
  sectionKey: string;
  title: string;
  isClosed: boolean;
  children: any;
  isExpandable?: boolean;
  description?: string;
  onClickToggleButton?: any;
};

export default class DetailSection extends React.Component<Props> {
  static defaultProps = {
    isExpandable: false,
    description: null,
    onClickToggleButton: () => {},
  };

  render() {
    const description = this.props.description ? (
      <div key="description" className={`${ROOT}__description`}>
        {this.props.description}
      </div>
    ) : null;

    return (
      <li key={this.props.sectionKey} className={ROOT}>
        <DetailSectionHeader
          isExpandable={this.props.isExpandable}
          isClosed={this.props.isClosed}
          onClickToggleButton={this.props.onClickToggleButton}
        >
          {this.props.title}
        </DetailSectionHeader>
        {this.props.isExpandable && this.props.isClosed
          ? null
          : [description, this.props.children]}
      </li>
    );
  }
}
