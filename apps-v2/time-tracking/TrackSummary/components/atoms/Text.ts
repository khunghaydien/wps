import classnames from 'classnames';

import styled from 'styled-components';

export const Headline = styled.span.attrs({
  className: 'wsp-header-1',
})``;

export const Text = styled.span.attrs<{ body1?: boolean; body2?: boolean }>(
  (props) => ({
    className: classnames({
      'wsp-body-1': (!props.body1 && !props.body2) || props.body1,
      'wsp-body-2': props.body2,
    }) as string | null | undefined,
  })
)<{ body1?: boolean; body2?: boolean }>``;
