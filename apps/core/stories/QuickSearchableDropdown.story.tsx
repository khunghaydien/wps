import React from 'react';

import range from 'lodash/range';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

/* eslint-disable import/no-extraneous-dependencies */
import { QuickSearchableDropdown } from '../index';

const Label = styled.div`
  color: red;
  font-size: 12px;
`;

export default {
  title: 'core/QuickSearchableDropdown',
};

export const Default = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={[
      { id: '1', value: 1, label: 'Item 1' },
      { id: '2', value: 2, label: 'Item 2' },
      { id: '3', value: 3, label: 'Item 3' },
      { id: '4', value: 4, label: 'Item 4' },
    ]}
    optionSelector={(x) => x}
    filterSelector={(x) => x.label}
    value={3}
  />
);

Default.storyName = 'default';

export const LongValue = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={[
      { value: 'A' },
      {
        value:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, ',
      },
      { value: 'hoge' },
      { value: 'CC' },
      { value: 'test' },
    ]}
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
    value="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, "
  />
);

LongValue.storyName = 'long value';

export const ReadOnly = () => (
  <QuickSearchableDropdown
    readOnly
    onSelect={action('onSelect')}
    items={[
      { value: 'A' },
      { value: 'hoge' },
      { value: 'CC' },
      { value: 'test' },
    ]}
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
    value="hoge"
  />
);

ReadOnly.storyName = 'readOnly';

export const Disabled = () => (
  <QuickSearchableDropdown
    disabled
    onSelect={action('onSelect')}
    items={[
      { value: 'A' },
      { value: 'hoge' },
      { value: 'CC' },
      { value: 'test' },
    ]}
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
    value="hoge"
  />
);

Disabled.storyName = 'disabled';

export const Placeholder = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={[
      { value: 'A' },
      { value: 'hoge' },
      { value: 'CC' },
      { value: 'test' },
    ]}
    placeholder="Placeholder"
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
  />
);

Placeholder.storyName = 'placeholder';

export const HasEmptyOption = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={[
      { value: 'A' },
      { value: 'hoge' },
      { value: 'CC' },
      { value: 'test' },
    ]}
    placeholder="Placeholder"
    hasEmptyOption
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
  />
);

HasEmptyOption.storyName = 'hasEmptyOption';

export const RichContentLabel = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={[
      { value: 'A', label: <Label>A</Label> },
      {
        value: '1',
        label: (
          <>
            <Label>Rich Content</Label>
            <Label>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
              imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
              mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
              semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
              porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem
              ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
              viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean
              imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper
              ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,
              tellus eget condimentum rhoncus, sem quam semper libero, sit amet
              adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus
              pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt
              tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam
              quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis
              leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis
              magna. Sed consequat, leo eget bibendum sodales, augue velit
              cursus nunc,
            </Label>
          </>
        ),
      },
      { value: 'CC' },
      { value: 'test' },
    ]}
    placeholder="Placeholder"
    value="1"
    hasEmptyOption
    optionSelector={(x) => x}
    filterSelector={(x) => x.value}
  />
);

RichContentLabel.storyName = 'rich content label';

export const ALotOfOptions = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={range(0, 500)}
    placeholder="Placeholder"
    value={1}
    hasEmptyOption
    optionSelector={(x) => ({ value: x })}
    filterSelector={(x) => x.toString()}
  />
);

ALotOfOptions.storyName = 'a lot of options';

export const DataLoading = () => (
  <QuickSearchableDropdown
    onSelect={action('onSelect')}
    items={range(0, 500)}
    placeholder="Placeholder"
    value={1}
    hasEmptyOption
    optionSelector={(x) => ({ value: x })}
    filterSelector={(x) => x.toString()}
    isLoading
  />
);

DataLoading.storyName = 'data loading';
