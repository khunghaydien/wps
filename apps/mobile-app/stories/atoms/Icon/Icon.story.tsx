import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { text, withKnobs } from '@storybook/addon-knobs';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import Icon from '../../../components/atoms/Icon';

import icons from './icons';

import './Icon.story.scss';
import colors from '../../../styles/variables/_colors.scss';

storiesOf('Components/atoms/Icon', module)
  .addDecorator(withKnobs)
  .add(
    'Basic',
    withInfo(`
      アイコンを表示します。
      モバイルでは画面サイズが端末により変わるためsvgを利用しています。

      \`type\` props で icon の種類を指定できます。
      \`size\` props で icon のサイズ(x-small, small, medium, large, x-large)を変更できます。
      \`color\` props で icon の色を指定できます。
    `)(() => (
      // @ts-ignore
      <Icon type={'adduser'} size={'x-large'} color={text('color', 'red')} />
    ))
  )
  .add(
    'Size',
    withInfo(`
      \`size\` propsを使うとアイコンのサイズをx-small,samll,medium,large,x-largeのプリセットから簡単に設定出来るよになります。
    `)(() => (
      <div className="center-column">
        <div className="playground">
          <Icon type="adduser" size={'x-large'} />
          <div>You can try `size` of this icon on knobs tab.</div>
        </div>
        <div className="space-around-row">
          <div>
            <Icon type="adduser" size="x-small" />
            <div>x-small</div>
          </div>

          <div>
            <Icon type="adduser" size="small" />
            <div>small</div>
          </div>

          <div>
            <Icon type="adduser" size="medium" />
            <div>medium</div>
          </div>

          <div>
            <Icon type="adduser" size="large" />
            <div>large</div>
          </div>

          <div>
            <Icon type="adduser" size="x-large" />
            <div>x-large</div>
          </div>
        </div>
      </div>
    ))
  )
  .add(
    'Color',
    withInfo(`
      \`color\` propsを使って色を自由に指定する事ができます。
      \`color\` はcss backgroundで指定出来る全ての値をサポートしています。
    `)(() => (
      <div className="center-column">
        <div className="playground">
          <Icon type="adduser" size="x-large" color={text('color', 'black')} />
          <div>You can try `color` of this icon on knobs tab.</div>
        </div>
        <div className="space-around-row">
          <div>
            <Icon type="adduser" size="large" color={colors.brand} />
            <div>brand color</div>
          </div>

          <div>
            <Icon type="adduser" size="large" color={colors.add} />
            <div>add color</div>
          </div>

          <div>
            <Icon type="adduser" size="large" color={colors.alert} />
            <div>alert color</div>
          </div>

          <div>
            <Icon type="adduser" size="large" color="#df2ed1" />
            <div>#df2ed1</div>
          </div>
        </div>
      </div>
    ))
  )
  .add('Variants', () => {
    const xs: string[] = Object.entries(colors)
      .filter(
        ([key, _]) =>
          !(key.includes('000') || key.includes('100') || key.includes('200'))
      )
      .map(([_, value]) => value as string);
    const ys = icons.length;
    const zs = xs.length / ys;
    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {icons.map((icon: any, index) => (
          <div
            style={{
              padding: '1rem',
              width: '12rem',
              height: '5rem',
            }}
          >
            <Icon
              type={icon}
              size="medium"
              color={xs[Math.floor((index + 1) * zs)]}
              style={{
                textAlign: 'center',
              }}
            />
            <div>{icon}</div>
          </div>
        ))}
      </div>
    );
  });
