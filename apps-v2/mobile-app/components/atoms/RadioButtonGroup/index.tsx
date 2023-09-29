import * as React from 'react';

import omit from 'lodash/omit';

import Classic from './Classic';
import Default from './Default';
import { Props as CommonProps } from './Props';

export type Props = Readonly<
  CommonProps & {
    classic?: boolean;
  }
>;

export default class RadioButtonGroup extends React.Component<Props> {
  render() {
    return this.props.classic ? (
      <Classic {...omit(this.props, 'classic')} />
    ) : (
      <Default {...omit(this.props, 'classic')} />
    );
  }
}
