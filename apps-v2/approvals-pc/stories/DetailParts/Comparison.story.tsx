import React from 'react';

import Comparison from '../../components/DetailParts/Comparison';

export default {
  title: 'approvals-pc/DetailParts',
};

export const ComparisonDate = () => (
  <Comparison new="2018/9/15 - 2018/9/20" old="2018/10/15" type="date" />
);

ComparisonDate.storyName = 'Comparison date';

ComparisonDate.parameters = {
  info: { propTables: [Comparison], inline: true, source: true },
};

export const ComparisonDateime = () => (
  <Comparison
    new="2018/9/15 11:00-16:00"
    old="2018/10/15 11:00-16:50"
    type="datetime"
  />
);

ComparisonDateime.storyName = 'Comparison dateime';

ComparisonDateime.parameters = {
  info: { propTables: [Comparison], inline: true, source: true },
};

export const ComparisonText = () => (
  <React.Fragment>
    <Comparison new="振替休日" old={null} type="text" />
    <hr />
    <Comparison new={null} old="振替休日" type="text" />,
  </React.Fragment>
);

ComparisonText.storyName = 'Comparison text';

ComparisonText.parameters = {
  info: { propTables: [Comparison], inline: true, source: true },
};

export const ComparisonLongtext = () => (
  <React.Fragment>
    <Comparison
      new="親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）親譲りの無鉄砲で小供"
      old={null}
      type="longtext"
    />
    <hr />
    <Comparison
      new={null}
      old="親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）親譲りの無鉄砲で小供"
      type="longtext"
    />
  </React.Fragment>
);

ComparisonLongtext.storyName = 'Comparison longtext';

ComparisonLongtext.parameters = {
  info: { propTables: [Comparison], inline: true, source: true },
};
