import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import TalentProfile from '../../components/TalentProfile';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import TalentProfileContainer from '../TalentProfileContainer';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockStore = configureStore([thunk]);

const state = {
  userSetting: {
    companyId: 'test-company',
    employeeName: 'test-employee',
    employeeId: 'test-employee-id',
    photoUrl: 'test-employee-photo-url',
  },
  entities: {
    capabilityInfo: {
      empCode: 'TDEMP000',
      empDeptName: 'Dept CEO',
      empEmail: 'test.email@testemail.com',
      empGrade: null,
      empHiredDate: '2021-01-01',
      empId: 'a129D000000greNQAQ',
      empNameL: 'Sista Aadmi',
      empName_L0: 'Sista Aadmi',
      empName_L1: 'Aadmi Sista',
      empName_L2: null,
      empPhotoUrl: 'https://test-url.com/profilephoto/005/T',
      empPosition: 'Dept Manager',
      id: 'a2E9D000000A7jGUAS',
      links: [],
      remarks: "I'm good. Are you?",
      skills: [
        {
          skillId: 'test-skill-id',
          skillCode: 'test-skill-code',
          rating: '30',
        },
      ],
    },
    skillsetCategoryList: [
      {
        id: 'test-category',
        name: 'TD Exams',
        skillsets: [
          {
            code: 'Grade 2',
            grades: '1\n2\n3',
            id: 'a2Z9D000000OHRWUA4',
            name: 'Grade 2',
            ratingType: 'Grade',
          },
        ],
      },
    ],
    skillItemsList: [],
  },
};

describe('TalentProfileContainer Test', () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore(state);
    const origDispatch = store.dispatch;
    store.dispatch = jest.fn(origDispatch);

    ApiMock.reset();
  });

  afterEach(cleanup);

  it('it renders without crashing', () => {
    component = renderer.create(
      <Provider store={store}>
        <TalentProfileContainer />
      </Provider>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('dispatch event to save profile', async () => {
    component = mount(
      <Provider store={store}>
        <TalentProfileContainer />
      </Provider>
    );
    const page = component.find(TalentProfile).props();
    await act(async () => {
      page.onSaveProfile();
      await delay(100);
      component.update();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  it('dispatch event to search skill', async () => {
    ApiMock.setDummyResponse(
      '/psa/skillset/search',
      {
        companyId: 'test-company',
        categoryId: 'test-category',
        allowSelfEditing: 'Allowed',
      },
      {
        skillsets: [],
      }
    );
    component = mount(
      <Provider store={store}>
        <TalentProfileContainer />
      </Provider>
    );
    const page = component.find(TalentProfile).props();
    await act(async () => {
      page.onCategorySelect('test-category');
      await delay(100);
      component.update();
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
});
