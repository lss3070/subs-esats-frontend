/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DishParts
// ====================================================

export interface DishParts_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface DishParts_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  require: boolean;
  choices: DishParts_options_choices[] | null;
}

export interface DishParts_divisions {
  __typename: "DishDivision";
  name: string;
}

export interface DishParts {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: DishParts_options[] | null;
  divisions: DishParts_divisions[] | null;
}
