import React from 'react';

import msg from '@apps/commons/languages';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import { IcCards } from '@apps/domain/models/exp/TransportICCard';

import LinkListItem from '@mobile/components/atoms/LinkListItem';
import Wrapper from '@mobile/components/atoms/Wrapper';

import './CardList.scss';

const ROOT = 'mobile-app-pages-card-list';

type Props = {
  title: string;
  cardList: IcCards;
  onClickBack: () => void;
  onClickRow: (string) => void;
};

const CardList = (props: Props) => {
  const cards = props.cardList.map((item, idx) => (
    <div key={idx} className={`${ROOT}__row`}>
      <LinkListItem
        className={`${ROOT}__item`}
        onClick={() => props.onClickRow(item.cardNo)}
      >
        {item.cardName}
      </LinkListItem>
    </div>
  ));

  return (
    <Wrapper className={ROOT}>
      <Navigation title={props.title} onClickBack={props.onClickBack} />
      <div className="main-content">
        {cards}
        {cards.length === 0 && (
          <div className={`${ROOT}__has-zero`}>
            {msg().Com_Lbl_ZeroSearchResult}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default CardList;
