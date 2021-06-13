/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMultipleOrdersInput, OrderStatus, UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: multipleOrdersQuery
// ====================================================

export interface multipleOrdersQuery_getMultipleOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  count: number | null;
  options: multipleOrdersQuery_getMultipleOrders_orders_items_options[] | null;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_customer {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  zipCode: number | null;
  address: string | null;
  detailAddress: string | null;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_driver {
  __typename: "User";
  id: number;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions {
  __typename: "RestaurantDivision";
  name: string;
}

export interface multipleOrdersQuery_getMultipleOrders_orders_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: multipleOrdersQuery_getMultipleOrders_orders_restaurant_category | null;
  zipCode: number | null;
  address: string;
  isPromoted: boolean;
  divisions: multipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions[] | null;
}

export interface multipleOrdersQuery_getMultipleOrders_orders {
  __typename: "Order";
  id: number;
  items: multipleOrdersQuery_getMultipleOrders_orders_items[];
  total: number | null;
  status: OrderStatus;
  createdAt: any;
  customer: multipleOrdersQuery_getMultipleOrders_orders_customer | null;
  driver: multipleOrdersQuery_getMultipleOrders_orders_driver | null;
  restaurant: multipleOrdersQuery_getMultipleOrders_orders_restaurant | null;
}

export interface multipleOrdersQuery_getMultipleOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: multipleOrdersQuery_getMultipleOrders_orders[] | null;
}

export interface multipleOrdersQuery {
  getMultipleOrders: multipleOrdersQuery_getMultipleOrders;
}

export interface multipleOrdersQueryVariables {
  input: GetMultipleOrdersInput;
}
