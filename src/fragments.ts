import { gql } from "@apollo/client";





// export const PAGINATION_RESULT_FRAGMENT = gql`
//     fragment PaginationParts on ee{
//         totalPages
//         totalResults
//     }
// `


export const MYRESTAURANT_FRAGMENT= gql`
fragment MyRestaurantParts on Restaurant{
  id
  name
  coverImg
  category{
    name
  }
  address
  isPromoted
}
`;

export const USER_FRAGMENT= gql`
  fragment UserParts on User{
      id
      email
      role
      zipCode
      address
      detailAddress
    }
`
export const RESTAURANT_FRAGMENT = gql`
    fragment RestaurantParts on Restaurant{
      id
      name
      coverImg
      category{
        name
      }
      address
      isPromoted
      description
      divisions{
        name
      }
    }
`;

export const CATEGORY_FRAGMENT = gql`
    fragment CategoryParts on Category{
        id
        name
        coverImg
        slug
        restaurantCount
    }
`

export const DISH_FRAGMENT= gql`
  fragment DishParts on Dish{
    id
    name
    price
    photo
    description
    options{
      name
      extra
      require
      choices{
        name
        extra
      }
    }
    divisions{
      name
    }
  }
`

export const ORDERS_FRAGMENT = gql`
  fragment OrderParts on Order{
    id
    createdAt
    total
  }
`

export const FULL_ORDER_FRAGMENT = gql`
  fragment FullOrderParts on Order{
    id
            status
            total
            driver{
                email
            }
            customer{
                email
            }
            restaurant{
                name
            }
  }
`