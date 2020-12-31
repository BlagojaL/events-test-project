const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpire: Int!
}

input CreateUserInput {
    email: String!
    password: String!
}

input CreateEventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

type RootQuery {
    getEvents: [Event!]
    getBookings: [Booking!]
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: CreateEventInput): Event
    createUser(userInput: CreateUserInput) : User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);