const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt } = require("graphql")
const app = express()

const works = [
    {
        "_id": "64f615fe93d0f172090f17c6",
        "work": "Clean Bathroom",
        "workerID": 67
    },
    {
        "_id": "64f6168593d0f172090f17c7",
        "work": "Massage OLD man",
        "workerID": 45
    },
    {
        "_id": "64f616ac93d0f172090f17c8",
        "work": "Cook Breakfast",
        "workerID": 87
    }
]

const workers = [
    {
        "_id": "64f614f693d0f172090f17bf",
        "name": "Ole",
        "workerID": 67,
        "role": "Cleaner"
    },
    {
        "_id": "64f6154593d0f172090f17c0",
        "name": "Sivii",
        "workerID": 45,
        "role": "Massager"
    },
    {
        "_id": "64f6157b93d0f172090f17c1",
        "name": "Sriram",
        "workerID": 87,
        "role": "Chef"
    }
]

const workerType = new GraphQLObjectType({
    name: "workers",
    description: "Details of different workers",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        workerID: { type: new GraphQLNonNull(GraphQLInt) },
        role: { type: new GraphQLNonNull(GraphQLString) },
    }
    
})

const workType = new GraphQLObjectType({
    name: "work",
    description: "Different Works done by workers",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        work: { type: new GraphQLNonNull(GraphQLString) },
        workerID: { type: new GraphQLNonNull(GraphQLInt) },
        worker: { 
            type: workerType, 
            resolve: (works) => {
                return workers.find(worker => worker.workerID === works.workerID)
            }
        }
    }
})

const rootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "Details about all the workers",
    fields: () => ({
        works: {
            type: new GraphQLList(workType),
            resolve: () => works
        },
        work: {
            type: workType,
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => works.find(work => work.workerID === args.id)
        },
        workers: {
            type: new GraphQLList(workerType),
            resolve: () => workers
        },
        worker: {
            type: workerType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => workers.find(worker => worker.workerID === args.id)
        }
    })
})

const rootMutationQuery = new GraphQLObjectType({
    name: "Mutation",
    description: "Mutate data into database",
    fields: () => ({
        addWork: {
            type: workType,
            args: {
                _id: { type: new GraphQLNonNull(GraphQLString) },
                work: { type: new GraphQLNonNull(GraphQLString) },
                workerID: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const work = {
                    _id: args._id,
                    work: args.work,
                    workerID: args.workerID
                }
                works.push(work);
                return work
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutationQuery
})

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000/graphql")
})

