/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allCategory
// ====================================================

export interface allCategory_allCategories_categories {
  __typename: "Category";
  id: number;
  slug: string;
}

export interface allCategory_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: allCategory_allCategories_categories[] | null;
}

export interface allCategory {
  allCategories: allCategory_allCategories;
}
