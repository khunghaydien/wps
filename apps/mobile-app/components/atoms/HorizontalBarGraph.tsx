import * as React from 'react';

import classNames from 'classnames';
import { $ReadOnly, $Shape } from 'utility-types';

import './HorizontalBarGraph.scss';

const ROOT = 'mobile-app-atoms-horizontal-bar-graph';

type Props = $ReadOnly<{
  data: Array<
    $Shape<{
      color: string;
      value: number;
      label?: string;
      labelAlign?: 'left' | 'right';
      labelColor?: string;
    }>
  >;
  className?: string;
  onClick?: (arg0: React.SyntheticEvent<Element>) => void;
}>;

/**
 * FIXME Add title attribute for accesibility
 */
export default class HorizontalBarGraph extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.renderGraphItem = this.renderGraphItem.bind(this);
  }

  renderGraphItem() {
    const sum = this.props.data.reduce((acc, datum) => acc + datum.value, 0);
    const items = [];
    let posX = 0;

    this.props.data.map((item, i) => {
      let width = (item.value / sum) * 100;
      // 0 / 0でNaNとなる可能性がある
      width = isNaN(width) ? 0 : width;

      const labelAlign = item.labelAlign || 'left';
      const weight = 3.2; // tweak spaces for mobile viewport
      const textPosition =
        item.label && labelAlign === 'right'
          ? posX + width - weight * item.label.length
          : posX + 1;

      items.push(
        <React.Fragment key={i}>
          <rect
            x={`${posX}%`}
            y="0"
            width={`${width}%`}
            height="100%"
            fill={item.color}
          />
          {item.label ? (
            <text
              x={`${textPosition}%`}
              y={22}
              fill={item.labelColor || 'white'}
            >
              {item.label}
            </text>
          ) : null}
        </React.Fragment>
      );

      posX += width;

      return true;
    });

    return items;
  }

  render() {
    const className = classNames(ROOT, this.props.className);

    return (
      <div className={className}>
        <svg onClick={this.props.onClick}>{this.renderGraphItem()}</svg>
      </div>
    );
  }
}
