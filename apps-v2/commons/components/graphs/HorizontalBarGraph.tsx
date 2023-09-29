import React, { CSSProperties } from 'react';

import classNames from 'classnames';

import './HorizontalBarGraph.scss';

type Props = {
  data: Array<any>;
  className?: string;
  onClick?: (e: React.MouseEvent, target: EventTarget) => void;
  style: CSSProperties;
};

/**
 * 水平グラフ - 共通コンポーネント
 * サイズ情報を持たないため、必ずclassNameを付与してサイズを決めてください。
 * ex. .some-class { height: 10px; width: 70% }
 * FIXME 多くのデモで既に使用中だが未レビュー title属性を付与してスクリーンリーダー対応したい
 */
export default class HorizontalBarGraph extends React.Component<Props> {
  static get defaultProps() {
    return {
      data: [],
      style: {},
    };
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e: React.MouseEvent) {
    if (this.props.onClick) {
      this.props.onClick(e, e.target);
    }
  }

  calcSum() {
    let sum = this.props.data.reduce((prev, item) => {
      return prev + item.value;
    }, 0);

    if (!sum) {
      sum = 0;
    }

    return sum;
  }

  renderGrahpItem() {
    const sum = this.calcSum();
    const items = [];
    let posX = 0;

    this.props.data.map((item, i) => {
      let width = (item.value / sum) * 100;
      // 0 / 0でNaNとなる可能性がある
      width = isNaN(width) ? 0 : width;

      items.push(
        <rect
          x={`${posX}%`}
          y="0"
          width={`${width}%`}
          height="100%"
          fill={item.color}
          key={i}
        />
      );

      posX += width;

      return true;
    });

    return items;
  }

  render() {
    const barClass = classNames(
      'ts-horizontal-bar-graph',
      this.props.className
    );

    return (
      <svg style={this.props.style} onClick={this.onClick} className={barClass}>
         {this.renderGrahpItem()}
      </svg>
    );
  }
}
