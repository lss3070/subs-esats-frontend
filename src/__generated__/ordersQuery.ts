/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrdersInput, OrderStatus, UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: ordersQuery
// ====================================================

export interface ordersQuery_getOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface ordersQuery_getOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  count: number | null;
  options: ordersQuery_getOrders_orders_items_options[] | null;
}

export interface ordersQuery_getOrders_orders_customer {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  zipCode: number | null;
  address: string | null;
  detailAddress: string | null;
}

export interface ordersQuery_getOrders_orders_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface ordersQuery_getOrders_orders_restaurant_divisions {
  __typename: "RestaurantDivision";
  name: string;
}

export interface ordersQuery_getOrders_orders_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: ordersQuery_getOrders_orders_restaurant_category | null;
  zipCode: number | null;
  address: string;
  isPromoted: boolean;
  divisions: ordersQuery_getOrders_orders_restaurant_divisions[] | null;
}

export interface ordersQuery_getOrders_orders {
  __typename: "Order";
  id: number;
  items: ordersQuery_getOrders_orders_items[];
  total: number | null;
  status: OrderStatus;
  customer: ordersQuery_getOrders_orders_customer | null;
  restaurant: ordersQuery_getOrders_orders_restaurant | null;
}

export interface ordersQuery_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: ordersQuery_getOrders_orders[] | null;
}

export interface ordersQuery {
  getOrders: ordersQuery_getOrders;
}

export interface ordersQueryVariables {
  input: GetOrdersInput;
}
