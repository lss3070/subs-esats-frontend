/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMultipleOrdersInput, OrderStatus, UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: clientMultipleOrdersQuery
// ====================================================

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_items {
  __typename: "OrderItem";
  id: number;
  count: number | null;
  options: clientMultipleOrdersQuery_getMultipleOrders_orders_items_options[] | null;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_customer {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  zipCode: number | null;
  address: string | null;
  detailAddress: string | null;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_driver {
  __typename: "User";
  id: number;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions {
  __typename: "RestaurantDivision";
  name: string;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string | null;
  coverImg: string;
  category: clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant_category | null;
  zipCode: number | null;
  address: string;
  isPromoted: boolean;
  divisions: clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant_divisions[] | null;
}

export interface clientMultipleOrdersQuery_getMultipleOrders_orders {
  __typename: "Order";
  id: number;
  items: clientMultipleOrdersQuery_getMultipleOrders_orders_items[];
  total: number | null;
  status: OrderStatus;
  deliveryTime: number | null;
  createdAt: any;
  customer: clientMultipleOrdersQuery_getMultipleOrders_orders_customer | null;
  driver: clientMultipleOrdersQuery_getMultipleOrders_orders_driver | null;
  restaurant: clientMultipleOrdersQuery_getMultipleOrders_orders_restaurant | null;
}

export interface clientMultipleOrdersQuery_getMultipleOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  orders: clientMultipleOrdersQuery_getMultipleOrders_orders[] | null;
}

export interface clientMultipleOrdersQuery {
  getMultipleOrders: clientMultipleOrdersQuery_getMultipleOrders;
}

export interface clientMultipleOrdersQueryVariables {
  input: GetMultipleOrdersInput;
}
