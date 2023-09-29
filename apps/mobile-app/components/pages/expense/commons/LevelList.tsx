import React from 'react';

import msg from '../../../../../commons/languages';
import SearchField from '../../../molecules/commons/Fields/SearchField';
import Navigation from '../../../molecules/commons/Navigation';

import LevelLinkListItem from '../../../molecules/expense/LevelLinkListItem';

import './LevelList.scss';

const ROOT = 'mobile-app-pages-level-list';

type State = {
  keyword: string;
};

type Props = {
  list: Array<any>;
  keyword: string;
  title: string;
  limitNumber: number;
  onClickBack: () => void;
  onClickSearchButton: (keyword: string) => void;
  onClickRow: (item: Record<string, any>) => void;
  onClickIcon: (item: Record<string, any>) => void;
};

export default class LevelList extends React.Component<Props, State> {
  state = {
    keyword:
      this.props.keyword === 'null'
        ? ''
        : decodeURIComponent(this.props.keyword || ''),
  };

  render() {
    const { list, limitNumber } = this.props;
    return (
      <div className={ROOT}>
        <Navigation
          title={this.props.title}
          onClickBack={this.props.onClickBack}
        />
        <div className="main-content">
          <section className={`${ROOT}__input`}>
            <SearchField
              placeHolder={msg().Com_Lbl_Search}
              onChange={(e: any) => this.setState({ keyword: e.target.value })}
              value={this.state.keyword}
              iconClick={() =>
                this.props.onClickSearchButton(this.state.keyword)
              }
            />
          </section>
          <section className={`${ROOT}__result`}>
            {list.slice(0, limitNumber).map((item) => (
              <section key={item.requestId} className={`${ROOT}__row`}>
                <LevelLinkListItem
                  key={item.requestId}
                  className={`${ROOT}__item`}
                  onClickBody={() => this.props.onClickRow(item)}
                  onClickIcon={
                    item.hasChildren ? () => this.props.onClickIcon(item) : null
                  }
                >
                  {item.code} - {item.name}
                </LevelLinkListItem>
              </section>
            ))}
            {list.length === 0 && (
              <div key="hasZero" className={`${ROOT}__has-zero`}>
                {msg().Com_Lbl_ZeroSearchResult}
              </div>
            )}
            {list.length > limitNumber && (
              <div key="hasMore" className={`${ROOT}__hasMore`}>
                {msg().Com_Lbl_TooManySearchResults}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
}
