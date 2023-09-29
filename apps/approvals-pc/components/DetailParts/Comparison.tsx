import * as React from 'react';

import zipWith from 'lodash/zipWith';

import msg from '../../../commons/languages';
import { compose } from '../../../commons/utils/FnUtil';

import './Comparison.scss';

const ROOT = 'approvals-pc-detail-parts-comparison';

type Props = {
  new: null | string; // eslint-disable-line react/no-unused-prop-types,
  old: null | string; // eslint-disable-line react/no-unused-prop-types,
  type: 'date' | 'datetime' | 'text' | 'longtext'; // eslint-disable-line react/no-unused-prop-types
};

type Token = {
  new: null | string;
  old: null | string;
  changed: boolean;
};

type State = {
  // false positive
  // eslint-disable-next-line react/no-unused-prop-types
  tokens: Token[];
};

type PresentationProp = State & Props;

const withDefaultValue = (WrappedComponent: React.ComponentType<unknown>) => {
  return class extends React.PureComponent<Props> {
    render() {
      return (
        // @ts-ignore
        <WrappedComponent
          {...this.props}
          // @ts-ignore
          new={this.props.new || msg().Appr_Lbl_ComparisonNone}
          old={this.props.old || msg().Appr_Lbl_ComparisonNone}
        />
      );
    }
  };
};

const withComparable = (WrappedComponent: React.ComponentType<unknown>) => {
  return class ComparableContainer extends React.PureComponent<Props, State> {
    static getTokens(
      newValue: string,
      oldValue: string,
      type: Props['type']
    ): Token[] {
      const pattern: RegExp = ComparableContainer.delminators[type];
      const newValueTokens = newValue.split(pattern);
      const oldValueTokens = oldValue.split(pattern);
      return zipWith(newValueTokens, oldValueTokens, (left, right) => ({
        new: left,
        old: right,
        changed: left !== right,
      }));
    }

    static getDerivedStateFromProps(props: Props, _state: State): State {
      return {
        tokens: ComparableContainer.getTokens(
          props.new || msg().Appr_Lbl_ComparisonNone,
          props.old || msg().Appr_Lbl_ComparisonNone,
          props.type
        ),
      };
    }

    constructor(props: Props) {
      super(props);

      this.state = ComparableContainer.getDerivedStateFromProps(
        props,
        this.state
      );
    }

    static delminators: {
      [K in Props['type']]: RegExp;
    } = {
      date: /([,\-–/\s])/g,
      datetime: /([,\-–/\s])/g,
      text: /(.+)/g,
      longtext: /(.+)/g,
    };

    render() {
      // @ts-ignore
      return <WrappedComponent {...this.props} tokens={this.state.tokens} />;
    }
  };
};

const ComparisonPresentation = (props: PresentationProp) => {
  const renderTokens = (tokens: Token[], type: 'new' | 'old') => {
    return tokens.reduce((acc, token) => {
      return token.changed ? (
        <React.Fragment>
          {acc}
          <span className={`${ROOT}__changed`}>{token[type]}</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {acc}
          {token[type]}
        </React.Fragment>
      );
    }, <React.Fragment />);
  };

  const renderComparison = () => (
    <React.Fragment>
      <div className={`${ROOT}__new`}>
        <span className={`${ROOT}__user-input`}>
          {renderTokens(props.tokens, 'new')}
        </span>
        <span className={`${ROOT}__info`}>{msg().Appr_Lbl_Changes}</span>
      </div>
      <div className={`${ROOT}__old`}>
        (<span className={`${ROOT}__user-input`}>{props.old}</span>
        <span className={`${ROOT}__info`}>
          {msg().Appr_Lbl_PreviousApplication}
        </span>
        )
      </div>
    </React.Fragment>
  );

  const renderComparisonLongtext = () => (
    <React.Fragment>
      <div className={`${ROOT}__new ${ROOT}__longtext-new`}>
        <span className={`${ROOT}__longtext-info`}>
          {msg().Appr_Lbl_Changes}:
        </span>
        <p className={`${ROOT}__user-input ${ROOT}__changed`}>{props.new}</p>
      </div>
      <div
        className={`${ROOT}__old ${ROOT}__longtext-old
        `}
      >
        {msg().Appr_Lbl_PreviousApplication}:
        <p className={`${ROOT}__user-input`}>{props.old}</p>
      </div>
    </React.Fragment>
  );

  const renderComparisonBody =
    props.type === 'longtext' ? renderComparisonLongtext : renderComparison;

  return (
    <div className={ROOT}>
      {props.new !== props.old ? (
        renderComparisonBody()
      ) : (
        <span className={`${ROOT}__user-input`}>{props.new}</span>
      )}
    </div>
  );
};

const Component = compose(
  withDefaultValue,
  withComparable
  // @ts-ignore
)(ComparisonPresentation) as React.ComponentType<Props>;
Component.displayName = 'Comparison';

export default Component;
