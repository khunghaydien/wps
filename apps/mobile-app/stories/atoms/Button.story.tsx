import React from 'react';

import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Button from '../../components/atoms/Button';

export default {
  title: 'Components/atoms/Button',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
  # Priority

  ## primary

  ~~~js
  <Button priority="primary" variant="neutral">Secondary</Button>
  ~~~

  ## secondary

  ~~~js
  <Button priority="secondary" variant="neutral">Secondary</Button>
  ~~~

  ## primaryとsecondaryの使いわけ

primaryは画面の中で絶対にメインとなり実行されるアクションもしくは定期的に必ず実行する機会が訪れる物のみに使用してください。
(ex, 月次勤怠申請や勤怠打刻など)
それ以外は secondary を使用し、視覚的優先度を下げてください。

詳細は Priority and variant を参照して下さい。

  # Disabled button

  \`disabled\`を\`true\`にすると\`Button\`が非活性になります。

  ~~~js
  <Button disabled priority="primary" variant="neutral">Do Something</Button>
  ~~~

  # Floating button

  \`floating\`を\`top\`または\`bottom\`にすると\`Button\`を固定位置に表示し続けることができます。

  ~~~js
  <Button floating="bottom" priority="primary" variant="neutral">Do Something</Button>
  ~~~

  # E2E テスト

  E2Eテストのために\`testId\` prop に一意なIDを渡してください。
  これにより\`Button\`が常に一意に特定できる事をE2Eテストに保障すること出来ます。
`)(() => (
  <Button
    priority={text('priority', 'primary')}
    variant={text('variant', 'neutral')}
    disabled={boolean('disabled', false)}
    floating={text('floating', null)}
    testId={text('testId', 'unique-id')}
    onClick={action('onClick')}
  >
    新規申請
  </Button>
));

export const Variants = () => (
  <div
    style={{
      display: 'flex',
      flexFlow: 'column wrap',
      justifyContent: 'space-around',
      alignItems: 'start-flex',
      padding: '2rem',
      height: '100vh',
    }}
  >
    <Button priority="primary" variant="neutral">
      Primary Neutral Action
    </Button>
    <Button priority="secondary" variant="neutral">
      Secondary Neutral Action
    </Button>
    <Button priority="primary" variant="add">
      Primary Add Action
    </Button>
    <Button priority="secondary" variant="add">
      Secondary Add Action
    </Button>
    <Button priority="primary" variant="alert">
      Primary Alert Action
    </Button>
    <Button priority="secondary" variant="alert">
      Secondary Alert Action
    </Button>
  </div>
);

Variants.parameters = {
  info: `
    # コンテキスト

    コンテキストに応じてボタンを使い分けてください。

    ## neutral

    メインとなるアクションを表します。

    e.g.
    - 勤怠打刻画面の打刻

    ~~~js
    <Button priority="primary" variant="neutral">Primary Neutral Action</Button>
    <Button priority="secondary" variant="neutral">Secondary Neutral Action</Button>
    ~~~

    ## add

    追加となるアクションを表します。

    e.g.
    - 各種申請画面の編集
    - 各種申請画面の申請

    ~~~js
    <Button priority="primary" variant="add">Primary Add Action</Button>
    <Button priority="secondary" variant="add">Secondary Add Action</Button>
    ~~~

    ## alert

    警告が必要なアクションを表します。

    e.g.
    - 各種申請画面の申請取消
    - 承認画面の承認却下

    ~~~js
    <Button priority="primary" variant="alert">Primary Alert Action</Button>
    <Button priority="secondary" variant="alert">Secondary Alert Action</Button>
    ~~~

  `,
};
