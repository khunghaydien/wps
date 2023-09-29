import React from 'react';

import ActionIconButton from '../../elements/ActionIconButton';
import { Search } from '../../elements/Icons';

type Props = Omit<React.ComponentProps<typeof ActionIconButton>, 'icon'>;

const SearchButton: React.FC<Props> = (props: Props) => (
  <ActionIconButton icon={Search} color="primary" {...props} />
);

export default SearchButton;
