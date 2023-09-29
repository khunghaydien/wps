import * as React from 'react';

import classNames from 'classnames';
import _ from 'lodash';
import { $Values } from 'utility-types';

import ArrowRight from '../../images/arrowRight.svg';
import IconBackground from '../../images/background.png';
import ImgBtnCloseDialog from '../../images/btnCloseDialog.png';
import ImgIconArrowGrey from '../../images/iconArrowGrey.png';
import ImgIconInfo from '../../images/iconInfo2.png';
import StarEmpty from '../../images/icons/starEmpty.svg';
import msg from '../../languages';
import Button from '../buttons/Button';
import ButtonGroups from '../buttons/ButtonGroups';
import Icon from '../exp/Icon';
import LabelWithHint from '../fields/LabelWithHint';
import TextField from '../fields/TextField';
import FixedHeaderTable, { BodyCell, BodyRow } from '../FixedHeaderTable';
import MessageBoard from '../MessageBoard';
import ProgressBar, { ProgressBarStep } from '../ProgressBar';
import Skeleton from '../Skeleton';
import Tooltip from '../Tooltip';
import VirtualizedList from '../VirtualizedList';

import './MultiColumnFinder.scss';

const ROOT = 'ts-multi-column-finder';
const MAX_SEARCH_RESULT_NUM = 100;

export const tabTypes = {
  DIRECTORY: 'directory',
  SEARCH: 'search',
  FAVORITE: 'favorite',
};

export type Mode = $Values<typeof tabTypes>;

type Props = {
  showRecentlyUsed?: boolean;
  items: Array<any>;
  typeName: string;
  hintMsg?: string;
  parentSelectable?: boolean;
  onClickItem: (arg0: any, arg1?: any[]) => void | Promise<void>;
  onClickCloseButton: (event: React.MouseEvent<HTMLInputElement>) => void;
  tabs?: Array<Mode>;
  searchResult: any[];
  recentItems: any[];
  favoriteItems?: any[];
  isLoading?: boolean;
  onClickSearch: (arg0: string) => void;
  getFavorites: () => Promise<any>;
  onClickSelectByCategory: () => void;
  onClickEmptyStar: (arg0: any) => Promise<any>;
  onClickFullStar: (arg0: any) => Promise<any>;
  showStar?: boolean;
  IconInfo?: any;
  progressBar?: Array<ProgressBarStep>;
  onClickBackButton?: () => void;
  hasMoreSearchResult?: boolean;
  // For VRT only
  initialState?: {
    mode: Mode;
    tempFavoriteItems: any[];
  };
  onClickGroupItem?: (arg0: any, arg1: any, arg2: any) => void;
  placeholder?: string;
};

type State = {
  mode: Mode;
  nest: string[];
  keyword: string;
  searchViewLabel: string;
  tempFavoriteItems?: any[];
};

const withTooltip =
  (tooltipContent: React.ReactNode, align?: string) =>
  (element: React.ReactElement<any>) =>
    (
      <Tooltip
        id={ROOT}
        align={align || 'top'}
        content={tooltipContent}
        className="slds-col slds-align-middle slds-size--10-of-12"
      >
        {element}
      </Tooltip>
    );

/**
 * マルチカラムファインダーダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export default class MultiColumnFinder extends React.Component<Props, State> {
  tsExpenseTypeContents: HTMLDivElement | null;
  state: State;

  static get defaultProps() {
    return {
      tabs: null,
      searchResult: [],
      recentItems: [],
      progressBar: [],
      setProgressBar: () => {},
      onClickSearch: () => {},
      getFavorites: () => Promise.resolve(),
      onClickSelectByCategory: () => {},
      onClickEmptyStar: () => Promise.resolve(),
      onClickFullStar: () => Promise.resolve(),
      onClickBackButton: () => {},
    };
  }

  constructor(props: Props) {
    super(props);
    const { initialState = {} as State } = this.props;

    this.state = {
      mode:
        initialState.mode ||
        (_.includes(this.props.tabs, tabTypes.SEARCH) ? 'search' : 'directory'),
      // 各階層で選ばれているItemのID, 添え字がそのままに階層を示す
      // [ 0: 'id-1', 1: 'id-2' ... ]
      nest: [],
      keyword: '',
      tempFavoriteItems: initialState.tempFavoriteItems || null,
      searchViewLabel: this.props.showRecentlyUsed
        ? msg().Exp_Lbl_RecentlyUsedItems
        : '',
    };

    this.onClickGroupItem = this.onClickGroupItem.bind(this);
  }

  /**
   *  選択タイプ変更
   */
  onChangeMode(mode: Mode) {
    // TODO: 該当モードに対応するデータの取得
    this.setState({
      mode,
    });
  }

  /**
   * グループが選択された場合、選択されたIDと階層の深さを記憶してイベントハンドラを呼ぶ
   */
  onClickGroupItem(selectedNest: any, item: any, items: any[]) {
    this.setState((prevState) => {
      let nest = _.cloneDeep(prevState.nest);
      // クリックされた階層以降の選択状態はいらないのでクリア
      // @ts-ignore
      if (nest === 0) {
        nest = [];
      } else {
        nest = nest.slice(0, selectedNest);
      }

      // 選択されたグループを記憶
      nest.push(item.id);

      return {
        nest,
      };
    });

    this.props.onClickItem(item, items);
  }

  onPressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.onClickSearch(e.currentTarget.value);
      this.setState({ searchViewLabel: msg().Exp_Lbl_SearchResult });
    }
  }

  onClickStar = _.throttle((item: any) => {
    if (item.isFavorite) {
      this.toggleStarIcon(item, false);
      this.props.onClickFullStar(item).catch(() => {
        this.toggleStarIcon(item, true);
      });
    } else {
      this.toggleStarIcon(item, true);
      this.props.onClickEmptyStar(item).catch(() => {
        this.toggleStarIcon(item, false);
      });
    }
  }, 1000);

  onClickArrowButton(item: any, columnIndex: number) {
    const items = this.props.items.slice(0, columnIndex + 1);
    this.onClickGroupItem(columnIndex, item, items);
  }

  onClickGroupRow(item: any, columnIndex: number, isSelectable: boolean) {
    if (isSelectable) {
      this.props.onClickItem(item);
    } else {
      this.onClickArrowButton(item, columnIndex);
    }
  }

  // keep the item in favorite list but toggle the star icon
  toggleStarIcon = (item: any, isFavorite: boolean) => {
    this.setState((preState) => {
      const itemsCopy = _.cloneDeep(preState.tempFavoriteItems);
      const itemCopy = _.find(itemsCopy, { id: item.id });
      if (itemCopy) {
        itemCopy.isFavorite = isFavorite;
      }
      return { tempFavoriteItems: itemsCopy };
    });
  };

  styleActive(mode: Mode): 'active' | '' {
    return this.state.mode === mode ? 'active' : '';
  }

  getHierarchyDisplay(levels: string[]) {
    const rowClass = `${ROOT}__parent-row`;
    const displayArr = [];
    const tooltipArr = [];
    const lastIdx = levels.length - 1;
    const rightIcon = (
      <img
        src={ImgIconArrowGrey}
        className={`${ROOT}__parent-row-icon-next slds-icon`}
      />
    );
    if (lastIdx < 3) {
      levels.forEach((x) => {
        displayArr.push(x, rightIcon);
      });
    } else {
      displayArr.push(
        levels[0],
        rightIcon,
        '...',
        rightIcon,
        levels[lastIdx],
        rightIcon
      );
      levels.forEach((x) => {
        tooltipArr.push(x, ' > ');
      });
    }
    displayArr.pop();
    tooltipArr.pop();
    let innerClass = '';
    const renderStr = displayArr.reverse().map((item, idx) => {
      innerClass =
        idx % 2 || item === '...' ? `${rowClass}-seperator` : `${rowClass}-col`;
      return <span className={innerClass}>{item}</span>;
    });
    return tooltipArr.length ? (
      withTooltip(
        <div>{tooltipArr.reverse().join('')}</div>,
        'bottom'
      )(<div className={rowClass}>{renderStr}</div>)
    ) : (
      <div className={rowClass}>{renderStr}</div>
    );
  }

  getSkeleton = (rowNo, className) => {
    return (
      <Skeleton
        noOfRow={rowNo}
        colWidth="100%"
        className={className}
        rowHeight="25px"
        margin="25px"
      />
    );
  };

  renderCloseIcon() {
    return (
      <button
        type="button"
        className={`${ROOT}__close`}
        onClick={this.props.onClickCloseButton}
      >
        <img src={ImgBtnCloseDialog} alt="close" />
      </button>
    );
  }

  renderHeader() {
    return (
      <div className="slds-grid ts-multi-column-finder__header">
        <div className="slds-col slds-size--12-of-12 slds-align-middle">
          <div className="ts-multi-column-finder__header__left">
            <div className="ts-multi-column-finder__header__title">
              {this.props.typeName} {msg().Exp_Lbl_Select}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderButtonGroups() {
    const {
      items,
      tabs,
      favoriteItems,
      onClickSelectByCategory,
      getFavorites,
    } = this.props;

    // decide button should be primary or default type
    const getButtonType = (tabType: string) => {
      const isActive = tabType === this.state.mode;
      return isActive ? 'primary' : 'default';
    };

    const onChange = (activeMode) => {
      this.setState({
        mode: activeMode,
      });
      if (activeMode === 'directory' && items.length === 0) {
        onClickSelectByCategory();
      } else if (activeMode === 'favorite') {
        if (!favoriteItems) {
          getFavorites().then((favoriteList) => {
            this.setState({ tempFavoriteItems: favoriteList });
          });
        } else {
          this.setState({ tempFavoriteItems: favoriteItems });
        }
      }
    };

    let btnGroup = null;
    if (tabs && tabs.length > 0) {
      const btns = tabs.map((tab) => {
        let label = null;
        switch (tab) {
          case tabTypes.SEARCH:
            label = msg().Exp_Lbl_SearchSelect;
            break;
          case tabTypes.DIRECTORY:
            label = msg().Exp_Lbl_SelectFromCategory;
            break;
          case tabTypes.FAVORITE:
            label = msg().Exp_Lbl_SelectFromFavorites;
            break;
          default:
            return '';
        }

        return (
          <Button type={getButtonType(tab)} onClick={() => onChange(tab)}>
            {label}
          </Button>
        );
      });

      btnGroup = (
        <div className="ts-multi-column-finder__btn-grp">
          <ButtonGroups>{btns}</ButtonGroups>
        </div>
      );
    }

    return btnGroup;
  }

  renderSelectableItem(item: any) {
    const cssNoIcon = 'ts-multi-column-finder__item__no-icon';

    const { IconInfo } = this.props;

    return (
      <div
        className="ts-multi-column-finder__item slds-grid ts-multi-column-finder__pointer"
        key={item.id}
        onClick={() => this.props.onClickItem(item)}
      >
        <div className={cssNoIcon}>
          {item.description
            ? withTooltip(<div>{item.name}</div>)(
                <div className="ts-multi-column-finder__text">
                  <div className="ts-multi-column-finder__text-main">
                    {item.code}
                  </div>
                  <div className="ts-multi-column-finder__text-sub">
                    <div aria-label={item.description}>
                      {withTooltip(
                        item.description,
                        'bottom'
                      )(
                        IconInfo ? (
                          <IconInfo className="ts-multi-column-finder__icon-exp-type-info slds-icon" />
                        ) : (
                          <img
                            src={ImgIconInfo}
                            className="ts-multi-column-finder__icon-info slds-icon"
                          />
                        )
                      )}
                      <span className="ts-multi-column-finder__text-sub-name">
                        {item.name}
                      </span>
                    </div>
                  </div>
                </div>
              )
            : withTooltip(<div>{item.name}</div>)(
                <div className="ts-multi-column-finder__text">
                  <div className="ts-multi-column-finder__text-code">
                    {item.code}
                  </div>
                  <div className="ts-multi-column-finder__text-name">
                    {item.name}
                  </div>
                </div>
              )}
        </div>
      </div>
    );
  }

  renderArrowIcon(
    item: any,
    columnIndex: number,
    isSelectable: boolean,
    isSelected: boolean
  ) {
    const iconClass = classNames(
      'slds-col slds-align-middle slds-size--2-of-12',
      isSelectable
        ? 'ts-multi-column-finder__show-child-btn-selectable'
        : 'ts-multi-column-finder__show-child-btn',
      { 'ts-multi-column-finder__item-group--selected': isSelected }
    );

    return (
      <div
        className={iconClass}
        onClick={() =>
          isSelectable ? this.onClickArrowButton(item, columnIndex) : null
        }
      >
        <ArrowRight
          aria-hidden="true"
          className="ts-multi-column-finder__icon-next slds-icon"
        />
      </div>
    );
  }

  renderGroupItem(item: any, columnIndex: number, isSelectable: boolean) {
    const isSelected =
      !_.isEmpty(this.state.nest[columnIndex]) &&
      this.state.nest[columnIndex] === item.id;

    const rowClass = classNames(
      'slds-grid',
      'ts-multi-column-finder__item-group',
      'ts-multi-column-finder__pointer',
      { 'ts-multi-column-finder__item-selectable-group--selected': isSelected }
    );

    const selectableClass = isSelectable
      ? 'ts-multi-column-finder__item-group__selectable-item slds-size--10-of-12'
      : 'ts-multi-column-finder__item-group__non-selectable-item slds-size--12-of-12';

    const itemClass = classNames(
      'slds-col slds-grid slds-align-middle',
      selectableClass
    );

    const { IconInfo } = this.props;

    return (
      <div className={rowClass} key={item.id}>
        <div
          className={itemClass}
          onClick={() => this.onClickGroupRow(item, columnIndex, isSelectable)}
        >
          {item.description
            ? withTooltip(<div>{item.name}</div>)(
                <div className="ts-multi-column-finder__group">
                  <div className="ts-multi-column-finder__text">
                    <div className="ts-multi-column-finder__text-main">
                      {item.code}
                    </div>
                    <div className="ts-multi-column-finder__text-sub">
                      <div aria-label={item.description}>
                        {withTooltip(
                          item.description,
                          'bottom'
                        )(
                          IconInfo ? (
                            <IconInfo className="ts-multi-column-finder__icon-exp-type-info  slds-icon" />
                          ) : (
                            <img
                              src={ImgIconInfo}
                              className="ts-multi-column-finder__icon-info slds-icon"
                            />
                          )
                        )}
                        <span className="ts-multi-column-finder__text-sub-name">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isSelectable &&
                    this.renderArrowIcon(
                      item,
                      columnIndex,
                      isSelectable,
                      isSelected
                    )}
                </div>
              )
            : withTooltip(<div>{item.name}</div>)(
                <div className="ts-multi-column-finder__group">
                  <div className="ts-multi-column-finder__text">
                    <div className="ts-multi-column-finder__text-main">
                      {item.code}
                    </div>
                    <div className="ts-multi-column-finder__text-sub">
                      <div aria-label={item.description}>{item.name}</div>
                    </div>
                  </div>
                  {!isSelectable &&
                    this.renderArrowIcon(
                      item,
                      columnIndex,
                      isSelectable,
                      isSelected
                    )}
                </div>
              )}
        </div>
        {isSelectable &&
          this.renderArrowIcon(item, columnIndex, isSelectable, isSelected)}
      </div>
    );
  }

  renderStarArea(item: any) {
    const className = item.isFavorite
      ? `${ROOT}__star-full`
      : `${ROOT}__star-empty`;

    const cell = (
      <BodyCell
        className={`${className} ${ROOT}__star`}
        // @ts-ignore
        onClick={() => this.onClickStar(item)}
      >
        <div className={`${ROOT}__star-icon`}>
          <StarEmpty />
        </div>
      </BodyCell>
    );
    return cell;
  }

  renderSearchAndSelectView() {
    const rowClass = `${ROOT}__row`;
    const isSearch = this.state.searchViewLabel === msg().Exp_Lbl_SearchResult;
    const recentItems = this.props.showRecentlyUsed
      ? this.props.recentItems
      : [];
    const items = isSearch ? this.props.searchResult : recentItems;
    const listLength = this.props.hasMoreSearchResult
      ? `${MAX_SEARCH_RESULT_NUM}+`
      : items.length;

    const list = (items.length > 0 || isSearch) && (
      <>
        <FixedHeaderTable
          scrollableClass={`${ROOT}__scrollable`}
          className={`${ROOT}--is-ellipsis`}
        >
          {items.map((item, idx) => {
            return (
              <BodyRow
                key={idx}
                className={rowClass}
                data-testid={`${ROOT}__row-${idx}`}
              >
                <BodyCell
                  className={`${ROOT}__code`}
                  // @ts-ignore
                  onClick={() => this.props.onClickItem(item)}
                >
                  <div className={`${ROOT}__name`}>
                    {item.code} - {item.name}
                  </div>
                  <div className={`${ROOT}__parents`}>
                    {item.hierarchyParentNameList &&
                      this.getHierarchyDisplay(item.hierarchyParentNameList)}
                  </div>
                </BodyCell>
                {this.props.showStar && this.renderStarArea(item)}
              </BodyRow>
            );
          })}
        </FixedHeaderTable>
        {this.props.hasMoreSearchResult && (
          <span className={`${ROOT}__too-many-results`}>
            {msg().Com_Lbl_TooManySearchResults}
          </span>
        )}
      </>
    );

    return (
      this.state.mode === 'search' && (
        <div className={`${ROOT}__search-area`}>
          <div className={`${ROOT}__search-field`}>
            <div className={`${ROOT}__search-field-label`}>
              {msg().Exp_Lbl_SearchCodeOrName}
            </div>
            <TextField
              className={`${ROOT}__search-field-input`}
              // @ts-ignore
              onKeyPress={(e) => this.onPressEnter(e)}
              value={this.state.keyword || ''}
              placeholder={
                this.props.placeholder || msg().Com_Lbl_PressEnterToSearch
              }
              onChange={(e) => this.setState({ keyword: e.target.value })}
              data-testid={`${ROOT}__search-field`}
            />
            <Icon
              className={`${ROOT}__search-btn`}
              type="search"
              color="#AFADAB"
            />
          </div>
          <div className={`${ROOT}__search-result`}>
            <span className={`${ROOT}__search-result-label`}>
              {this.state.searchViewLabel}
            </span>
            <span className={`${ROOT}__search-result-count`}>
              {isSearch && `${listLength} ${msg().Exp_Lbl_RecordCount}`}
            </span>
            {this.props.isLoading
              ? this.getSkeleton(5, `${ROOT}__skeleton`)
              : list}
          </div>
        </div>
      )
    );
  }

  renderDirectorItem(item, columnIndex) {
    if (item.hasChildren || item.isGroup) {
      if (this.props.parentSelectable) {
        return this.renderGroupItem(item, columnIndex, true);
      } else {
        return this.renderGroupItem(item, columnIndex, false);
      }
    }
    return this.renderSelectableItem(item);
  }

  renderDirectoryView = () => {
    let columns = this.props.items.map((itemList, columnIndex) => {
      return (
        <div className="ts-multi-column-finder__column" key={columnIndex}>
          {Array.isArray(itemList) ? (
            <VirtualizedList height={322} itemSize={45} items={itemList}>
              {(item) => this.renderDirectorItem(item, columnIndex)}
            </VirtualizedList>
          ) : null}
        </div>
      );
    });

    if (this.props.isLoading) {
      const skeletonCol = (
        <div className="ts-multi-column-finder__column">
          {this.getSkeleton(6, `${ROOT}__category-skeleton`)}
        </div>
      );
      // if click group item in col 1, show loading skeleton in col 2
      const noOfUnchangedCol = this.state.nest.length;
      columns = columns.slice(0, noOfUnchangedCol);
      columns = [...columns, skeletonCol];
    }

    return (
      <div className="ts-multi-column-finder__wrap">
        <div
          className="slds-grid ts-multi-column-finder__contents"
          ref={(c) => {
            this.tsExpenseTypeContents = c;
          }}
        >
          <div className="slds-grid">{columns} </div>
        </div>
      </div>
    );
  };

  renderFavoriteView() {
    let table = (
      <MessageBoard
        message={msg().Com_Msg_AddFavoriteOnSearchTab}
        iconSrc={IconBackground}
      />
    );

    if (this.props.isLoading) {
      table = this.getSkeleton(7, `${ROOT}__skeleton`);
    } else if (
      this.state.tempFavoriteItems &&
      this.state.tempFavoriteItems.length > 0
    ) {
      table = (
        <FixedHeaderTable
          scrollableClass={`${ROOT}__scrollable`}
          className={`${ROOT}--is-ellipsis ${ROOT}__favorites`}
        >
          {this.state.tempFavoriteItems.map((item, idx) => {
            return (
              <BodyRow key={idx} className={`${ROOT}__row`}>
                <BodyCell
                  className={`${ROOT}__code`}
                  // @ts-ignore
                  onClick={() => this.props.onClickItem(item)}
                >
                  <div className={`${ROOT}__name`}>
                    {item.code} - {item.name}
                  </div>
                  <div className={`${ROOT}__parents`}>
                    {item.hierarchyParentNameList &&
                      this.getHierarchyDisplay(item.hierarchyParentNameList)}
                  </div>
                </BodyCell>

                {this.props.showStar && this.renderStarArea(item)}
              </BodyRow>
            );
          })}
        </FixedHeaderTable>
      );
    }

    return <div className={`${ROOT}__wrap favorites`}>{table}</div>;
  }

  renderMainContent() {
    switch (this.state.mode) {
      case tabTypes.SEARCH:
        return this.renderSearchAndSelectView();
      case tabTypes.FAVORITE:
        return this.renderFavoriteView();
      default:
        return this.renderDirectoryView();
    }
  }

  renderFooter() {
    return _.isEmpty(this.props.progressBar)
      ? this.renderFooterSingletep()
      : this.renderFooterMultiStep();
  }

  renderFooterSingletep() {
    const hintText = this.props.hintMsg ? msg().Exp_Lbl_Hint : '';
    return (
      <div className="slds-grid ts-multi-column-finder__footer">
        <div
          className={`slds-col slds-size--12-of-12 slds-align-middle ${ROOT}__footer-area`}
        >
          <LabelWithHint
            text={hintText}
            hintMsg={this.props.hintMsg}
            hintAlign="top"
            infoAlign="left"
          />
          <Button
            className="ts-multi-column-finder__footer-btn ts-multi-column-finder__footer-btn-cancel"
            onClick={this.props.onClickCloseButton}
          >
            {msg().Com_Btn_Cancel}
          </Button>
        </div>
      </div>
    );
  }

  renderFooterMultiStep() {
    const hintText = this.props.hintMsg ? msg().Exp_Lbl_Hint : '';
    return (
      <div className="slds-grid ts-multi-column-finder__footer">
        <div
          className={`slds-col slds-size--12-of-12 slds-align-middle ${ROOT}__footer-area ${ROOT}__footer-multi`}
        >
          <Button
            className="ts-multi-column-finder__footer-btn "
            onClick={this.props.onClickBackButton}
          >
            {msg().Com_Lbl_Back}
          </Button>
          <ProgressBar steps={this.props.progressBar || []} />
          <LabelWithHint
            text={hintText}
            hintMsg={this.props.hintMsg}
            hintAlign="top"
            infoAlign="left"
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ts-multi-column-finder slds">
        {this.renderCloseIcon()}
        {this.renderHeader()}
        {this.renderButtonGroups()}
        {this.renderMainContent()}
        {this.renderFooter()}
      </div>
    );
  }
}
