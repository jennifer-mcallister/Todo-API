const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, getDirectoryFileNames, readFile } = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

const todosDirectory = path.join(__dirname, '..', 'data', 'todos')

exports.resolvers = {
    Query: {
        getTodoById: async (_, args, context) => {
            const id = args.id
            const filePath = path.join(todosDirectory, `${id}.json`)
            const todoExists = await fileExists(filePath)
            if (!todoExists) return new GraphQLError('Oppsie that todo does not exist')
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
            if (todos.length === 0) return new GraphQLError('Oppsie it is empty')
            return todos
        }

    },
    Mutation: {
        createTodo: async (_, args, context) => {
            if (args.task.length === 0) return new GraphQLError('Oppsie task must be at least i character long')

            const newTodo = { id: crypto.randomUUID(), task: args.task, description: args.description || ``, done: false} 
            const filePath = path.join(todosDirectory, `${newTodo.id}.json`)

            let idExists = true
            while (idExists) {
                const exists = await fileExists(filePath)
                if(exists) {
                    newTodo.id = crypto.randomUUID()
                    filePath = path.join(todosDirectory, `${newTodo.id}.json`)
                }
            idExists = false
            }

            await fsPromises.writeFile(filePath, JSON.stringify(newTodo))

            return newTodo

        },
        updateTodo: async (_, args, context) => {

        },
        deleteTodo: async (_, args, context) => {

        },

    }
}