/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL fragment: UserParts
// ====================================================

export interface UserParts {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  zipCode: number | null;
  address: string | null;
  detailAddress: string | null;
}
