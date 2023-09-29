import React from 'react';
import ReactDOM from 'react-dom';

import SelectField from '@apps/commons/components/fields/SelectField';

import { RATING_TYPE } from '@apps/domain/models/psa/Skillset';

type Props = {
  onValueChange: (arg1, arg2) => void;
};
// Note: This is an example taken from react-data-grid. As this is part of the react-data-grid library code, I did not add any flow types.
class CustomEditor extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.state = { ratingNumber: props.value };
  }

  getValue() {
    // @ts-ignore
    return { rating: this.state.ratingNumber };
  }

  getInputNode() {
    // eslint-disable-next-line react/no-find-dom-node
    const domNode = ReactDOM.findDOMNode(this);
    // @ts-ignore
    if (domNode.tagName === 'INPUT') {
      return domNode;
    }
    // @ts-ignore
    return domNode.querySelector('input:not([type=hidden])') || domNode;
  }

  handleValueChange(value) {
    this.setState({ ratingNumber: value });
    // @ts-ignore
    this.props.onValueChange(this.props.rowData, value);
  }

  render() {
    // @ts-ignore
    const { rowData } = this.props;
    const isGradeRatingType = rowData.ratingType === RATING_TYPE.Grade;

    const customEditor = isGradeRatingType ? (
      <SelectField
        options={rowData.grades.map((grade, i) => ({
          value: i,
          text: grade,
        }))}
        onChange={(e) => this.handleValueChange(e.target.value)}
        // @ts-ignore
        value={this.state.ratingNumber}
      />
    ) : (
      <input
        type="number"
        // @ts-ignore
        value={this.state.ratingNumber}
        onChange={(e) => {
          if (e.target.value.match(/^\d*(\.\d{0,5})?$/)) {
            this.handleValueChange(e.target.value);
          }
        }}
      />
    );

    return customEditor;
  }
}

export default CustomEditor;
