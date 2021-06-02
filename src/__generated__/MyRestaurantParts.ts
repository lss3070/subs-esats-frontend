/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MyRestaurantParts
// ====================================================

export interface MyRestaurantParts_category {
  __typename: "Category";
  name: string;
}

export interface MyRestaurantParts {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: MyRestaurantParts_category | null;
  address: string;
  isPromoted: boolean;
}
