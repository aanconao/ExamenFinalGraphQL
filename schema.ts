export const schema = `#graphql

    type Restaurant {
        id: ID!
        name: String!
        direction: String!
        city:String!
        country: String!
        phoneNumber: String!
    }

    type Query{
        getRestaurant(id:ID!):Restaurant
        getRestaurants:[Restaurant!]!
    }

    type Mutation{
        addRestaurant(name:String!, direction:String!, city:String!, phoneNumber:String!):Restaurant!
        deleteRestaurant(id:ID!):Boolean!
    }



`;
