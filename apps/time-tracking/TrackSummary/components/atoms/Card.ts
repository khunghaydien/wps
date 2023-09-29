import classnames from 'classnames';

import styled from 'styled-components';

import '../../../../commons/styles/wsp.scss';

export const Card = styled.div.attrs({
  className: 'wsp-card' as string | null | undefined,
})``;

export const Title = styled.div.attrs({
  className: 'wsp-card__title' as string | null | undefined,
})``;

export const Header = styled.div.attrs({
  className: 'wsp-card__header' as string | null | undefined,
})``;

export const HeaderGroup = styled.div.attrs<{ right?: boolean }>((props) => ({
  className: classnames('wsp-card__header-group', {
    'wsp-card__header-group--right': props.right,
  }) as string | null | undefined,
}))<{ right?: boolean }>`
  margin: ${(props) => (props.right ? '0' : '0 0 0 20px')};
`;

export const HeaderItem = styled.div.attrs({
  className: classnames('wsp-card__header-group__item') as
    | string
    | null
    | undefined,
})``;

export const Divider = styled.div.attrs({
  className: classnames('wsp-card__divider') as string | null | undefined,
})``;

export const Body = styled.div.attrs({
  className: classnames('wsp-card__body') as string | null | undefined,
})``;
