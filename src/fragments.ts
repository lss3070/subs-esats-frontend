import { gql } from "@apollo/client";





// export const PAGINATION_RESULT_FRAGMENT = gql`
//     fragment PaginationParts on ee{
//         totalPages
//         totalResults
//     }
// `

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