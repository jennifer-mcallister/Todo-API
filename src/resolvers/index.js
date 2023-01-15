const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, deleteFile, getDirectoryFileNames } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')

exports.resolvers = {
    Query: {
        getTodoById: async (_, args, context) => {

        },
        getAllTodos: async (_, args, context) => {
            
        }

    },
    Mutation: {
        createTodo: async (_, args, context) => {

        },
        updateTodo: async (_, args, context) => {

        },
        deleteTodo: async (_, args, context) => {

        },

    }
}