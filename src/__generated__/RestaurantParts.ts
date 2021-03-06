/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RestaurantParts
// ====================================================

export interface RestaurantParts_category {
  __typename: "Category";
  name: string;
}

export interface RestaurantParts_divisions {
  __typename: "RestaurantDivision";
  name: string;
}

export interface RestaurantParts {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: RestaurantParts_category | null;
  address: string;
  isPromoted: boolean;
  description: string | null;
  divisions: RestaurantParts_divisions[] | null;
}
