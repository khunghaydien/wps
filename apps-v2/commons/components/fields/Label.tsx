import React from 'react';

import ObjectUtil from '../../utils/ObjectUtil';

import HorizontalLayout from './layouts/HorizontalLayout';

type Props = {
  id?: string;
  text: string;
  children: React.ReactNode;
  className?: string;
  // Lightning Design SystemのGridを参照
  // https://www.lightningdesignsystem.com/components/utilities/grid/
  helpMsg?: string;
  labelCols: number | string;
  childCols: number | string;
};
/**
 * Label - 共通コンポーネント
 */
export default class Label extends React.Component<Props> {
  static get defaultProps() {
    return {
      labelCols: 3,
      childCols: 9,
    };
  }

  render() {
    const childProps = ObjectUtil.getOrDefault(
      this.props.children,
      'props',
      {}
    );

    return (
      <HorizontalLayout className={this.props.className}>
        <HorizontalLayout.Label
          cols={this.props.labelCols}
          required={childProps.required || childProps.isRequired}
          helpMsg={this.props.helpMsg}
        >
          <label htmlFor={childProps.id} title={this.props.text}>
            {this.props.text}
          </label>
        </HorizontalLayout.Label>
        <HorizontalLayout.Body cols={this.props.childCols}>
          {this.props.children}
        </HorizontalLayout.Body>
      </HorizontalLayout>
    );
  }
}
