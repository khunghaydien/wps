import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Modal from '../../components/atoms/Modal';

import './Modal.story.scss';

export default {
  title: 'Components/atoms/Modal',
  decorators: [withKnobs, withInfo],
};

export const Basic = () => <Modal persistent />;

Basic.story = {
  parameters: {
    info: {
      text: `
        モバイルではスクリーンサイズが小さい為、一般的なモーダルを利用するとコンテンツの領域が狭くなります。
        なので、WSPのモーダルは画面全体を利用してコンテンツを表示させます。
      `,
    },
  },
};

export const Types = () => (
  <Modal
    persistent={boolean('persistent', false)}
    onClickCloseButton={action('onClickCloseButton')}
  />
);

Types.story = {
  parameters: {
    info: {
      text: `
  永続的なモーダルなのか開閉可能なモーダルなのかは個別の要件によって決まります。
  \`persistent\` オプションを使って、永続的なモーダルか開閉可能なモーダルかを制御する事ができます。
      `,
    },
  },
};

export const Style = () => (
  <section>
    <Modal
      className={text('className', 'light')}
      persistent={boolean('persistent', false)}
      onClickCloseButton={action('onClickCloseButton')}
    >
      classNames
      <ul>
        <li>light</li>
        <li>dark</li>
      </ul>
    </Modal>

    <p className="body-1">
      <section>
        <h1 className="heading-1">坊ちゃん</h1>
        <p className="body-1">
          親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
        </p>
      </section>
    </p>
  </section>
);

Types.story = {
  parameters: {
    info: {
      text: `
        classNameを使ってスタイルを上書きする事ができます。
      `,
    },
  },
};

export const Content = () => (
  <Modal
    persistent={boolean('persistent', false)}
    onClickCloseButton={action('onClickCloseButton')}
  >
    <section style={{ color: '#fff' }}>
      <h1 className="heading-1">坊ちゃん</h1>
      <p className="body-1">
        親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。（青空文庫より）
      </p>
    </section>
  </Modal>
);

Content.story = {
  parameters: {
    info: {
      text: `
  モーダルに任意のコンテツを配置する事ができます。
  コンテンツはModalコンポーネントの子要素として渡して下さい。
      `,
    },
  },
};
