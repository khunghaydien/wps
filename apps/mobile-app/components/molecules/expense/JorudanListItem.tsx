import * as React from 'react';

import clickable, {
  ClickableProps,
} from '../../../../commons/concerns/clickable';
import displayName from '../../../../commons/concerns/displayName';

import { compose } from '../../../../commons/utils/FnUtil';

import Icon from '../../atoms/Icon';
import LinkListItem from '../../atoms/LinkListItem';
import JorudanStatusChips from './JorudanStatusChips';

import './JorudanListItem.scss';

const ROOT = 'mobile-app-molecules-expense-jorudan-list-item';

type Props = Readonly<
  ClickableProps & {
    amount: string;
    returnAmount: string;
    routeInfo: string;
    fast: boolean;
    cheap: boolean;
    easy: boolean;
    isIncludeEx: boolean;
    lineNames: Array<string>;
  }
>;

class JorudanListItem extends React.Component<Props> {
  render() {
    return (
      <LinkListItem className={ROOT} onClick={this.props.onClick}>
        <div className={`${ROOT}__header`}>
          <div className={`${ROOT}__amount-container`}>
            <span className={`${ROOT}__amount`}>{this.props.amount}</span>
            <p className={`${ROOT}__return-amount`}>
              {this.props.returnAmount}
            </p>
          </div>
          <div className={`${ROOT}__line-name-list`}>
            {this.props.lineNames.map((lineName, idx) => (
              <div key={idx} className={`${ROOT}__line-name-wrapper`}>
                <div className={`${ROOT}__line-name`}>{lineName}</div>
                {idx < this.props.lineNames.length - 1 && (
                  <Icon
                    className={`${ROOT}__line-name-to-icon`}
                    type="chevronright"
                    size="small"
                  />
                )}
              </div>
            ))}
          </div>
          <div className={`${ROOT}__route`}>{this.props.routeInfo}</div>
        </div>
        <JorudanStatusChips
          className={`${ROOT}__labels`}
          isCheapest={this.props.cheap}
          isEarliest={this.props.fast}
          isMinTransfer={this.props.easy}
          isIncludeEx={this.props.isIncludeEx}
        />
      </LinkListItem>
    );
  }
}

export default compose(
  displayName('JorudanListItem'),
  clickable
)(JorudanListItem) as React.ComponentType<Record<string, any>>;
