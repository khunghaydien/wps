/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import styled from 'styled-components';

import { Theme } from '../elements/Button';
import { Button } from '../index';

const colors = ['default', 'primary', 'secondary', 'danger'];

const S = {
  Section: styled.section`
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 500px;
  `,
  Container: styled.div`
    width: 100px;
    height: 80px;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: space-between;
  `,
};

export default {
  title: 'core/Button',
};

export const AllTypes = () => (
  <S.Section>
    {colors.map((color: Theme) => (
      <React.Fragment key={color}>
        <S.Container>
          <Button color={color}>{color.toUpperCase()}</Button>
          <Button color={color} disabled>
            DISABLED
          </Button>
        </S.Container>
      </React.Fragment>
    ))}
  </S.Section>
);

AllTypes.storyName = 'all types';

export const LongText = () => (
  <Button color="default">
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
    ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis
    parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
    pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec
    pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
    rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
    mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper
    nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
    consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra
    quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.
    Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur
    ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,
    tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing
    sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit
    id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut
    libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros
    faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec
    sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue
    velit cursus nunc,
  </Button>
);

LongText.storyName = 'long text';
