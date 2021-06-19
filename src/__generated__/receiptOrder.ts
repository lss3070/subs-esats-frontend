/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReceiptOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: receiptOrder
// ====================================================

export interface receiptOrder_receiptOrder {
  __typename: "ReceiptOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface receiptOrder {
  receiptOrder: receiptOrder_receiptOrder;
}

export interface receiptOrderVariables {
  input: ReceiptOrderInput;
}
