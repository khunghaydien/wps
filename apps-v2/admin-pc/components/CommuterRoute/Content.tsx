import React from 'react';

import Button from '../../../commons/components/buttons/Button';
// common components
import msg from '../../../commons/languages';

// prop types
import { Route, RouteItem } from '../../../domain/models/exp/jorudan/Route';

// reusable components
import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';

const ROOT = 'commuter-route__content';
const ROUTE_CLASS = 'ts-expenses-modal-route';
type Props = {
  route: Route;

  /* eslint-disable react/no-unused-prop-types */
  onClickRouteSelectListItem: (arg0: RouteItem) => void;
  /* eslint-enable react/no-unused-prop-types */
};

type State = {
  isSearched: boolean;
};
export default class CommuterRouteContent extends React.Component<
  Props,
  State
> {
  state = {
    isSearched: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const hasRoutesChanges = this.props.route !== nextProps.route;

    if (hasRoutesChanges) {
      this.setState({
        isSearched: true,
      });
    }
  }

  renderRouteList() {
    const { routeList } = this.props.route.commuter;
    const normalRouteList = this.props.route.route.routeList;
    const hasRoutes = routeList.length > 0;

    if (!hasRoutes) {
      return this.state.isSearched ? (
        <div className={`${ROOT}__no-result`}>
          {msg().Admin_Lbl_CommuterNoSearchResult}
        </div>
      ) : null;
    }

    return (
      <table className={`${ROUTE_CLASS}-contents-route-list`}>
        <tbody>
          {routeList.map((item) => {
            const routeKey = item.key - 1;
            return (
              <tr key={item.key}>
                <td>
                  <RecordHeader item={item} />
                </td>
                <td>
                  <RecordBody item={normalRouteList[routeKey]} />
                </td>
                <td className={`${ROUTE_CLASS}-contents-route-list-btn-area`}>
                  <Button
                    type="primary"
                    onClick={() => this.props.onClickRouteSelectListItem(item)}
                  >
                    {msg().Com_Btn_Select}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.props.route) {
      return null;
    }

    return (
      <div className={ROOT}>
        <div className={`${ROOT}-header`}>{msg().Exp_Lbl_SearchResult}</div>
        {this.renderRouteList()}
      </div>
    );
  }
}
