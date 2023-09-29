import React from 'react';

import _ from 'lodash';

import suggestionStatus from '../../constants/suggestionStatus';

import { RouteInfo } from '../../../domain/models/exp/Record';

import ObjectUtil from '../../utils/ObjectUtil';

import RouteForm from './RouteForm';
import RouteMap from './RouteMap';

import './index.scss';

type Props = {
  expRecordId: string;
  empId: string;
  getStationHistory: (empId: string) => void;
  onChangeInput: () => void;
  cancelConfirm: () => void;
  onClickRouteFinderButton: () => void;
  searchStation: (arg0: string, arg1: { searchString: string }) => void;
  setSuggestionItem: (arg0: string, arg1: Record<string, any>) => void;
  setSuggestInput: (routeInfo: RouteInfo) => void;
  searchRoute: (param: Partial<RouteInfo>) => void;
  stationHistoryList: Array<any>;
  routeInfo: RouteInfo;
  suggestInput: any;
};

type State = {
  isEditing: boolean;
  isFuzzySearch: boolean;
};
/**
 * 経路選択が必要な費目が選ばれた際に選択中の経路を出力する
 * 日本語専用のコンポーネントで他の言語では利用しない
 * NOTE: 日本語の直打ちの部分について日本語以外に対応する予定がないためこのままとする
 */
export default class Route extends React.Component<Props, State> {
  static get defaultProps() {
    return {
      routeInfo: {},
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditing: _.isEmpty(props.routeInfo),
      isFuzzySearch: false,
    };

    this.onClickSearchStationButton =
      this.onClickSearchStationButton.bind(this);
    this.onClickEditRouteButton = this.onClickEditRouteButton.bind(this);
    this.onClickSuggestionItem = this.onClickSuggestionItem.bind(this);
    this.onClickRouteFinderButton = this.onClickRouteFinderButton.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.getStationHistory(this.props.empId);
    if (!_.isEmpty(this.props.routeInfo)) {
      this.props.setSuggestInput(this.props.routeInfo);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.expRecordId !== nextProps.expRecordId) {
      this.props.setSuggestInput(nextProps.routeInfo);
    }

    // NOTE: 経路が設定されていない（新規、または途中保存）
    if (
      _.isEmpty(nextProps.routeInfo) ||
      _.isEmpty(nextProps.routeInfo.selectedRoute)
    ) {
      this.setState({ isEditing: true });
      // NOTE: 経路が設定されており、なおかつ経路情報が更新された場合
    } else if (!_.isEqual(this.props.routeInfo, nextProps.routeInfo)) {
      this.setState({ isEditing: false });
    }

    if (this.state.isFuzzySearch) {
      const suggestInput = nextProps.suggestInput;
      // NOTE: 駅名検索はできているおり、未選択状態の場合先頭の要素を選択状態とする
      if (
        suggestInput.origin.status === suggestionStatus.SEARCH_STATION_SUCCESS
      ) {
        this.onClickSuggestionItem(
          'origin',
          suggestInput.origin.suggestions[0].suggestions[0]
        );
      }
      if (
        suggestInput.arrival.status === suggestionStatus.SEARCH_STATION_SUCCESS
      ) {
        this.onClickSuggestionItem(
          'arrival',
          suggestInput.arrival.suggestions[0].suggestions[0]
        );
      }
      // 検索結果０件、もしくは空の入力エリアがある場合は処理を中断する
      if (
        suggestInput.origin.status === suggestionStatus.EMPTY_SEARCH_STRING ||
        suggestInput.arrival.status === suggestionStatus.EMPTY_SEARCH_STRING ||
        suggestInput.origin.status ===
          suggestionStatus.SEARCH_STATION_NO_RESULT ||
        suggestInput.arrival.status ===
          suggestionStatus.SEARCH_STATION_NO_RESULT
      ) {
        this.setState({ isFuzzySearch: false });
      }
    }
  }

  componentDidUpdate() {
    if (this.state.isFuzzySearch) {
      const suggestInput = this.props.suggestInput;
      if (
        suggestInput.origin.status ===
          suggestionStatus.SELECTED_SUGGESTION_ITEM &&
        suggestInput.arrival.status ===
          suggestionStatus.SELECTED_SUGGESTION_ITEM
      ) {
        this.onClickRouteFinderButton();
      }
    }
  }

  onClickSearchStationButton(inputType, searchString) {
    const param = { searchString };
    this.props.searchStation(inputType, param);
  }

  onClickEditRouteButton() {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  }

  onClickRouteFinderButton() {
    const suggestInput = this.props.suggestInput;
    // NOTE: 最低でも出発駅、到着駅が確定している場合のみ検索を実行する
    // 出発駅到着駅が確定していない状態で検索ボタンが押下された場合は現在入力中の文字列から
    // 駅名検索の先頭の候補を検索用のキーワードとし検索を実行する。
    if (
      !suggestInput.origin.selectSuggestion.name ||
      !suggestInput.arrival.selectSuggestion.name
    ) {
      this.confirmSearchStation('origin');
      this.confirmSearchStation('arrival');
      this.setState({ isFuzzySearch: true });
      return;
    } else {
      this.setState({ isFuzzySearch: false });
    }

    // 経路検索条件の組み立て
    // TODO: その他のパラメータをここで設定する
    const param = {
      origin: {
        name: suggestInput.origin.selectSuggestion.name,
        company: suggestInput.origin.selectSuggestion.company,
        category: suggestInput.origin.selectSuggestion.category,
      },
      arrival: {
        name: suggestInput.arrival.selectSuggestion.name,
        company: suggestInput.arrival.selectSuggestion.company,
        category: suggestInput.arrival.selectSuggestion.category,
      },
    };

    // FIXME: via が最大 4 件というのがマジックナンバーになっているので定数化する
    const viaList = [];
    for (let i = 0; i < 4; i++) {
      const via = suggestInput[`via${i + 1}`];
      if (via.status === suggestionStatus.INITIAL) {
        break;
      }
      viaList.push({ name: via.selectSuggestion.name });
    }
    (param as RouteInfo).viaList = viaList;

    this.props.searchRoute(param);
    this.props.onClickRouteFinderButton();
  }

  onClickSuggestionItem(inputType, suggestionItem) {
    this.props.setSuggestionItem(inputType, suggestionItem);
  }

  // 駅名検索の状況を確認する
  confirmSearchStation(inputType) {
    const suggestInput = this.props.suggestInput;
    if (!suggestInput[inputType].selectSuggestion.name) {
      this.props.searchStation(inputType, {
        searchString: suggestInput[inputType].value,
      });
    }
  }

  render() {
    const selectedRoute = ObjectUtil.getOrDefault(
      this.props.routeInfo,
      'selectedRoute',
      {}
    );
    return (
      <div className="ts-route">
        <RouteForm
          routeInfo={this.props.routeInfo}
          suggestInput={this.props.suggestInput}
          onChangeInput={this.props.onChangeInput}
          cancelConfirm={this.props.cancelConfirm}
          onClickEditRouteButton={this.onClickEditRouteButton}
          onClickRouteFinderButton={this.onClickRouteFinderButton}
          onClickSearchStationButton={this.onClickSearchStationButton}
          onClickSuggestionItem={this.onClickSuggestionItem}
          stationHistoryList={this.props.stationHistoryList}
          isEditing={this.state.isEditing}
        />

        <RouteMap
          selectedRoute={selectedRoute}
          isEditing={this.state.isEditing}
        />
      </div>
    );
  }
}
