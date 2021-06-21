/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMultipleOrdersInput, OrderStatus, UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: ownerMultipleOrdersQuery
// ====================================================

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_items_dish {
  __typename: "Dish";
  id: number;
  name: string;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_items {
  __typename: "OrderItem";
  dish: ownerMultipleOrdersQuery_getMultipleOrders_orders_items_dish;
  id: number;
  count: number | null;
  options: ownerMultipleOrdersQuery_getMultipleOrders_orders_items_options[] | null;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_customer {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  zipCode: number | null;
  address: string | null;
  detailAddress: string | null;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_driver {
  __typename: "User";
  id: number;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions {
  __typename: "RestaurantDivision";
  name: string;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant_category | null;
  zipCode: number | null;
  address: string;
  isPromoted: boolean;
  divisions: ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions[] | null;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders_orders {
  __typename: "Order";
  id: number;
  items: ownerMultipleOrdersQuery_getMultipleOrders_orders_items[];
  total: number | null;
  status: OrderStatus;
  createdAt: any;
  customer: ownerMultipleOrdersQuery_getMultipleOrders_orders_customer | null;
  driver: ownerMultipleOrdersQuery_getMultipleOrders_orders_driver | null;
  restaurant: ownerMultipleOrdersQuery_getMultipleOrders_orders_restaurant | null;
}

export interface ownerMultipleOrdersQuery_getMultipleOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: ownerMultipleOrdersQuery_getMultipleOrders_orders[] | null;
}

export interface ownerMultipleOrdersQuery {
  getMultipleOrders: ownerMultipleOrdersQuery_getMultipleOrders;
}

export interface ownerMultipleOrdersQueryVariables {
  input: GetMultipleOrdersInput;
}
