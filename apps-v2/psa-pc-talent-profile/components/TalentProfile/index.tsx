import React from 'react';

import { FormikErrors } from 'formik';
import { cloneDeep } from 'lodash';

import Button from '@apps/commons/components/buttons/Button';
import msg from '@apps/commons/languages';

import {
  CapabilityInfo,
  Link,
  SkillCategory,
  SkillItem,
} from '@apps/domain/models/psa/CapabilityInfo';

import BasicInfo from '../BasicInfo';
import LinksEdit from '../LinksEdit';
import SkillEdit from '../SkillEdit';

import './index.scss';

type Values = {
  remarks: string;
  selectedSkillItems: Array<SkillItem>;
  userLinks: Array<Link>;
};

type Errors = {
  remarks: string;
  selectedSkillItems: string;
  userLinks: string;
};

type FormikProps = {
  errors: FormikErrors<Errors>;
  values: Values;
  dirty: boolean;
  setFieldValue: (arg0: string, arg1: any) => void;
};

type Props = {
  skillCategories: Array<SkillCategory>;
  onSaveProfile: (talentProfile) => void;
  onCategorySelect: (categoryId: string) => void;
  skillItems: Array<SkillItem>;
  photoUrl: string;
  employeeProfile: CapabilityInfo;
  onClickDiscard: () => void;
} & FormikProps;

const ROOT = 'ts-psa__talent-profile-management';

const TalentProfile = (props: Props) => {
  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__profile`}>
        <div className={`${ROOT}__profile-label`}>
          <div className={`${ROOT}__profile-label__header`}>
            {msg().Psa_Lbl_TalentInfo}
          </div>
          <div className={`${ROOT}__profile-label__subheader`}>
            {msg().Psa_Lbl_TalentInfoSubtitle}
          </div>
        </div>
        <div className={`${ROOT}__profile-picture`}>
          <img
            src={props.photoUrl}
            className={`${ROOT}__profile-picture__img`}
          />
        </div>
      </div>
      <div className={`${ROOT}__actions`}>
        <Button
          className={`${ROOT}__discard-btn`}
          data-testid={`${ROOT}__discard-btn`}
          disabled={!props.dirty}
          onClick={props.onClickDiscard}
        >
          {msg().Com_Btn_Discard}
        </Button>
        <Button
          type="primary"
          className={`${ROOT}__save-btn`}
          data-testid={`${ROOT}__save-btn`}
          disabled={!props.dirty}
          onClick={props.onSaveProfile}
        >
          {msg().Com_Btn_Save}
        </Button>
      </div>
      <div className={`${ROOT}__basic-info`}>
        <BasicInfo
          employeeProfile={props.employeeProfile}
          remarks={props.values.remarks}
          updateRemarks={(remarks) => props.setFieldValue('remarks', remarks)}
        />
      </div>
      <div className={`${ROOT}__skill-edit`}>
        <SkillEdit
          selectedSkillsets={cloneDeep(props.values.selectedSkillItems)}
          onSkillSelect={(skills) => {
            props.setFieldValue('selectedSkillItems', skills);
          }}
          onCategorySelect={props.onCategorySelect}
          skillCategories={props.skillCategories}
          skillItems={props.skillItems}
          updateSkillItems={(itemList) =>
            props.setFieldValue('selectedSkillItems', itemList)
          }
        />
      </div>
      <div className={`${ROOT}__links-edit`}>
        <LinksEdit
          userLinks={cloneDeep(props.values.userLinks)}
          validationError={(props.errors && props.errors.userLinks) || []}
          onAddNewLink={() =>
            props.setFieldValue('userLinks', [
              ...props.values.userLinks,
              { name: '', url: '' },
            ])
          }
          onUpdateLinks={(links) => props.setFieldValue('userLinks', links)}
        />
      </div>
    </div>
  );
};

export default TalentProfile;
