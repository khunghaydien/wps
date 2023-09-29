import React from 'react';

import { withInfo } from '@storybook/addon-info';
/* eslint-disable import/no-extraneous-dependencies */
import { boolean, text, withKnobs } from '@storybook/addon-knobs';

import Card from '../../components/atoms/Card';

export default {
  title: 'Components/atoms/Card',
  decorators: [withKnobs],
};

export const Basic = withInfo(`
  # Description

  Genric card component.

  # Flat card

  You can make card flat by enabling flat props.

  ~~~js
  <Card
    flat={true}
  />
  ~~~

  # Content

  You can put any content as children (React.Node).

  ~~~js
  <Card
    flat={true}
  >
    <h1>FOOBAR</h1>
    <section>
      CONTENT
    </section>
  </Card>
  ~~~

  If you set \`title\` props, then a card displays title.

  ~~~js
  <Card
    title="FOOBAR"
    flat={true}
  />
  ~~~
`)(() => (
  <Card
    title={text('title', 'CARD TITLE CARD title card TITLE')}
    flat={boolean('flat', false)}
  >
    <h1>FOOBAR</h1>
    <section>CONTENT</section>
  </Card>
));
