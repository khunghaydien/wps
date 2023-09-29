import React from 'react';

import HorizontalBarGraph from '../../../commons/components/graphs/HorizontalBarGraph';
import ImgArrowNarrowUnderBlue from '../../../commons/images/arrowNarrowUnderBlue.png';
import ImgArrowNarrowUnderRed from '../../../commons/images/arrowNarrowUnderRed.png';

import './AttendanceGraphNarrow.scss';

type Props = Readonly<{
  data?: Array<{
    value: number;
    color: string;
  }>;
}>;

export default class AttendanceGraphNarrow extends React.Component<Props> {
  static get defaultProps() {
    return {
      // dummy
      data: [
        { value: 10, color: '#4b9ee4' },
        { value: 2, color: '#1a69ab' },
        { value: 10, color: '#4b9ee4' },
        { value: 2, color: '#1a69ab' },
        { value: 10, color: '#e28e1c' },
      ],
    };
  }

  render() {
    return (
      <div className="attendance-graph-narrow">
        <div className="attendance-graph-narrow__markers">
          <div className="attendance-graph-narrow__marker attendance-graph-narrow__marker--start">
            <time className="attendance-graph-narrow__marker-time">10:00</time>
            <img
              className="attendance-graph-narrow__marker-img"
              src={ImgArrowNarrowUnderRed}
            />
          </div>

          <div className="attendance-graph-narrow__marker attendance-graph-narrow__marker--end">
            <time className="attendance-graph-narrow__marker-time">19:00</time>
            <img
              className="attendance-graph-narrow__marker-img"
              src={ImgArrowNarrowUnderBlue}
            />
          </div>
        </div>

        <div className="attendance-graph-narrow__body">
          <HorizontalBarGraph
            className="attendance-graph-narrow__body-graph"
            data={this.props.data}
          />
        </div>
      </div>
    );
  }
}
