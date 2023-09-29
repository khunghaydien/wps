import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as categoryActions from '../actions/category';

import Category from '../presentational-components/Category';

export function getCategoryList(state: any) {
  const { categoryList } = state.entities;

  if (categoryList && categoryList.length > 0) {
    return categoryList.map((category) => ({
      code: category.code,
      id: category.id,
      name: category.name,
      label: category.name,
    }));
  }

  return categoryList;
}

const mapStateToProps = (state) => ({
  itemList: state.searchCategory,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: categoryActions.searchCategory,
      create: categoryActions.createCategory,
      update: categoryActions.updateCategory,
      delete: categoryActions.deleteCategory,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Category) as React.ComponentType<Record<string, any>>;
