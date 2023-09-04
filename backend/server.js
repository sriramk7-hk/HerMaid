const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql")
const app = express()

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "get",
        fields: () => ({
            message: {
                type: GraphQLString,
                resolve: () => "Working!"
            }
        })
    })
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000/graphql")
})

