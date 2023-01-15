const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, deleteFile, getDirectoryFileNames, readFile } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const { get } = require('http')

const todosDirectory = path.join(__dirname, '..', 'data', 'todos')

exports.resolvers = {
    Query: {
        getTodoById: async (_, args, context) => {
            const id = args.id
            const filePath = path.join(todosDirectory, `${id}.json`)
            const todoExists = await fileExists(filePath)
            if (!todoExists) return GraphQLError('Todo has aldready left')
            const todoData = JSON.parse(await readFile(filePath))

            return todoData
        },
        getAllTodos: async (_, args, context) => {
            const todoFiles = await getDirectoryFileNames(todosDirectory)
            const todos = []
            for(const file of todoFiles) {
                const filePath = path.join(todosDirectory, `${file}`)
                const todoData = JSON.parse(await readFile(filePath))
                todos.push(todoData)
            }
           
            return todos
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