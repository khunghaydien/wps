import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/talent-profile';
export const SEARCH_TALENT_PROFILE = 'SEARCH_TALENT_PROFILE';
export const CREATE_TALENT_PROFILE = 'CREATE_TALENT_PROFILE';
export const DELETE_TALENT_PROFILE = 'DELETE_TALENT_PROFILE';
export const UPDATE_TALENT_PROFILE = 'UPDATE_TALENT_PROFILE';
export const SEARCH_TALENT_PROFILE_ERROR = 'SEARCH_TALENT_PROFILE_ERROR';
export const CREATE_TALENT_PROFILE_ERROR = 'CREATE_TALENT_PROFILE_ERROR';
export const DELETE_TALENT_PROFILE_ERROR = 'DELETE_TALENT_PROFILE_ERROR';
export const UPDATE_TALENT_PROFILE_ERROR = 'UPDATE_TALENT_PROFILE_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const search = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/search`, param };
  return Api.invoke(req)
    .then((result) => {
      const formatProfiles = result.profiles.map((profile) => {
        const formattedSkills = profile.skills.map((skill) => {
          let newRating = skill.rating;
          if (skill.ratingType === 'Grade') {
            newRating = skill.rating.split('.')[0];
          }
          return { ...skill, rating: +newRating };
        });
        return { ...profile, skills: formattedSkills };
      });
      dispatch(searchSuccess(successType, formatProfiles));
      return formatProfiles;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchTalentProfile = (param = {}) => {
  return search(
    FUNC_NAME,
    param,
    SEARCH_TALENT_PROFILE,
    SEARCH_TALENT_PROFILE_ERROR
  );
};

export const createTalentProfile = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_TALENT_PROFILE,
    CREATE_TALENT_PROFILE_ERROR
  );
};

export const deleteTalentProfile = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_TALENT_PROFILE,
    DELETE_TALENT_PROFILE_ERROR
  );
};

export const updateTalentProfile = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    UPDATE_TALENT_PROFILE,
    UPDATE_TALENT_PROFILE_ERROR
  );
};
