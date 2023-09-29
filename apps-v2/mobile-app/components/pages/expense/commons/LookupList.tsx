import React from 'react';

import msg from '../../../../../commons/languages';
import SearchField from '../../../molecules/commons/Fields/SearchField';
import Navigation from '../../../molecules/commons/Navigation';

import { CustomEIOption } from '../../../../../domain/models/exp/ExtendedItem';

import LinkListItem from '../../../atoms/LinkListItem';
import Wrapper from '../../../atoms/Wrapper';

import './LookupList.scss';

const ROOT = 'mobile-app-pages-ei-lookup';

type State = {
  keyword: string;
  label: string;
};

type Item = CustomEIOption & { extraRow: string | null };

type Data = {
  hasMore: boolean;
  records: Array<Item>;
};

type Props = {
  title: string;
  data: Data;
  onClickBack: () => void;
  onClickSearchButton: (keyword: string) => void;
  onClickRow: (item: any) => void;
};

export default class LookupList extends React.Component<Props, State> {
  state = {
    keyword: '',
    label: msg().Exp_Lbl_RecentlyUsed,
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ keyword: e.target.value });
  };

  onClickSearch = () => {
    this.setState({ label: msg().Exp_Lbl_SearchResult });
    this.props.onClickSearchButton(this.state.keyword);
  };

  getListItemContent = (item: Item) => {
    const { code, name, extraRow } = item;
    return (
      <div className={`${ROOT}__option`}>
        <div>{`${code} - ${name}`}</div>
        {extraRow && <div className={`${ROOT}__extra-row`}>{extraRow}</div>}
      </div>
    );
  };

  render() {
    return (
      <Wrapper className={ROOT}>
        <Navigation
          title={this.props.title}
          onClickBack={this.props.onClickBack}
        />
        <SearchField
          placeHolder={msg().Com_Lbl_Search}
          iconClick={this.onClickSearch}
          onChange={this.onChange}
          value={this.state.keyword}
          isHideKeyboard={true}
        />
        <div className={`${ROOT}__label`}>{this.state.label}</div>
        <div className="main-content">
          <div className={`${ROOT}__result`}>
            {this.props.data.records.map((item, idx) => (
              <div key={idx} className={`${ROOT}__row`}>
                <LinkListItem
                  key={item.id}
                  className={`${ROOT}__item`}
                  onClick={() => this.props.onClickRow(item)}
                  noIcon
                >
                  {this.getListItemContent(item)}
                </LinkListItem>
              </div>
            ))}
            <div className={`${ROOT}__has-more`}>
              {this.props.data.records.length === 0 &&
                `${msg().Com_Lbl_ZeroSearchResult}`}

              {this.props.data.hasMore && msg().Com_Lbl_TooManySearchResults}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}
