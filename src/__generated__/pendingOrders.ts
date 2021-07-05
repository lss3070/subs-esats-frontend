/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: pendingOrders
// ====================================================

export interface pendingOrders_pendingOrders_driver {
  __typename: "User";
  email: string;
}

export interface pendingOrders_pendingOrders_customer {
  __typename: "User";
  email: string;
  address: string | null;
  detailAddress: string | null;
}

export interface pendingOrders_pendingOrders_restaurant {
  __typename: "Restaurant";
  name: string | null;
  address: string;
}

export interface pendingOrders_pendingOrders_items_dish {
  __typename: "Dish";
  name: string;
}

export interface pendingOrders_pendingOrders_items {
  __typename: "OrderItem";
  id: number;
  count: number | null;
  dish: pendingOrders_pendingOrders_items_dish;
}

export interface pendingOrders_pendingOrders {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: pendingOrders_pendingOrders_driver | null;
  customer: pendingOrders_pendingOrders_customer | null;
  restaurant: pendingOrders_pendingOrders_restaurant | null;
  items: pendingOrders_pendingOrders_items[];
}

export interface pendingOrders {
  pendingOrders: pendingOrders_pendingOrders;
}
