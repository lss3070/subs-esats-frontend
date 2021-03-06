/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum OrderStatus {
  Canceled = "Canceled",
  Cooked = "Cooked",
  Cooking = "Cooking",
  Deliverd = "Deliverd",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

export enum UserRole {
  Client = "Client",
  Customer = "Customer",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  zipCode?: number | null;
  address?: string | null;
  detailAddress?: string | null;
}

export interface CreateDishInput {
  name: string;
  price: number;
  photo?: string | null;
  description: string;
  options?: DishOptionInputType[] | null;
  restaurantId: number;
  divisions?: DishDivisionChoiceInputType[] | null;
}

export interface CreateOrderInput {
  restaurantId: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: number;
  count: number;
  options?: OrderItemOptionInputType[] | null;
}

export interface CreateRestaurantInput {
  name?: string | null;
  coverImg: string;
  zipCode?: number | null;
  address: string;
  detailAddress?: string | null;
  description?: string | null;
  divisions?: DivisionInputType[] | null;
  categoryName: string;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishDivisionChoiceInputType {
  name: string;
}

export interface DishOptionInputType {
  name: string;
  choices?: DishChoiceInputType[] | null;
  extra?: number | null;
  require?: boolean | null;
}

export interface DivisionInputType {
  name: string;
}

export interface EditOrderInput {
  id: number;
  status: OrderStatus;
  deliveryTime?: number | null;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface GetMultipleOrdersInput {
  status?: OrderStatus[] | null;
}

export interface GetOrderInput {
  id: number;
}

export interface GetOrdersInput {
  status?: OrderStatus | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MyRestaurantInput {
  id: number;
}

export interface OrderItemOptionInputType {
  name: string;
  choice?: string | null;
}

export interface OrderUpdatesInput {
  id: number;
}

export interface ReceiptOrderInput {
  id: number;
  status: OrderStatus;
  deliveryTime?: number | null;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface TakeOrderInput {
  id: number;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
