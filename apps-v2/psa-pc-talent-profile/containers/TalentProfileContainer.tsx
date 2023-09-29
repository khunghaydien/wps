import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import { cloneDeep } from 'lodash';

import talentProfileFormSchema from '../schema/TalentProfile';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import '../modules';
import type { State } from '../modules';

import { saveProfile } from '../action-dispatchers/TalentProfile';
import { searchSkillset } from '@apps/admin-pc/actions/skillset';

import TalentProfile from '../components/TalentProfile';

const mapStateToProps = (state: State) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  talentProfile: state.entities.capabilityInfo,
  skillCategories: state.entities.skillsetCategoryList,
  skillItems: state.entities.skillItemsList,
  photoUrl: state.userSetting.photoUrl,
});

const TalentProfileContainer = () => {
  const props = useSelector(mapStateToProps);
  const { skillCategories, skillItems, talentProfile } = props;
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const onClickDiscard = ({ resetForm, initialValues }) => {
    dispatch(
      confirm(msg().Psa_Msg_ConfirmDiscardChanges, (yes) => {
        if (yes) {
          resetForm(initialValues);
        }
      })
    );
  };

  const onSaveProfile = (values) => {
    const talentProfile = {
      id: props.talentProfile.id,
      isSelfUpdate: true,
      empId: props.talentProfile.empId,
      links: values.userLinks,
      remarks: values.remarks,
      skills: values.selectedSkillItems.map((item) => {
        return {
          skillId: item.skillId,
          skillCode: item.skillCode,
          rating: Number(item.rating) || 0,
        };
      }),
    };
    dispatch(saveProfile(talentProfile));
  };

  const onCategorySelect = (categoryId: string) => {
    dispatch(
      searchSkillset({
        companyId: props.companyId,
        categoryId,
        allowSelfEditing: 'Allowed',
      })
    );
  };

  const generateInitialValues = () => {
    let userSkillItems = cloneDeep(props.talentProfile.skills);
    const userLinks = cloneDeep(props.talentProfile.links);
    userSkillItems = userSkillItems.map((skillItem) => {
      return {
        ...skillItem,
        rating: Number(skillItem.rating),
      };
    });
    return {
      remarks: props.talentProfile.remarks || '',
      selectedSkillItems: userSkillItems || [],
      userLinks: userLinks || [],
    };
  };

  return (
    props.talentProfile &&
    props.talentProfile.empId && (
      <Formik
        enableReinitialize
        initialValues={generateInitialValues()}
        validationSchema={talentProfileFormSchema}
        onSubmit={onSaveProfile}
      >
        {(props) => {
          return (
            <TalentProfile
              skillCategories={skillCategories}
              onCategorySelect={onCategorySelect}
              skillItems={skillItems}
              photoUrl={talentProfile.empPhotoUrl}
              employeeProfile={talentProfile}
              onClickDiscard={() => onClickDiscard(props)}
              values={props.values}
              dirty={props.dirty}
              errors={props.errors}
              setFieldValue={props.setFieldValue}
              onSaveProfile={props.handleSubmit}
            />
          );
        }}
      </Formik>
    )
  );
};

export default TalentProfileContainer;
