/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getDeliveryOrder
// ====================================================

export interface getDeliveryOrder_getOrder_order_items_dish {
  __typename: "Dish";
  name: string;
}

export interface getDeliveryOrder_getOrder_order_items {
  __typename: "OrderItem";
  dish: getDeliveryOrder_getOrder_order_items_dish;
}

export interface getDeliveryOrder_getOrder_order_customer {
  __typename: "User";
  email: string;
  address: string | null;
  detailAddress: string | null;
  name: string;
}

export interface getDeliveryOrder_getOrder_order_restaurant {
  __typename: "Restaurant";
  name: string | null;
  address: string;
  detailAddress: string | null;
}

export interface getDeliveryOrder_getOrder_order {
  __typename: "Order";
  id: number;
  items: getDeliveryOrder_getOrder_order_items[];
  customer: getDeliveryOrder_getOrder_order_customer | null;
  restaurant: getDeliveryOrder_getOrder_order_restaurant | null;
}

export interface getDeliveryOrder_getOrder {
  __typename: "GetOrderOutput";
  ok: boolean;
  error: string | null;
  order: getDeliveryOrder_getOrder_order | null;
}

export interface getDeliveryOrder {
  getOrder: getDeliveryOrder_getOrder;
}

export interface getDeliveryOrderVariables {
  input: GetOrderInput;
}
