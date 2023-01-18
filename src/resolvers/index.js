const path = require('path')
const fsPromises = require('fs/promises')
const { fileExists, getDirectoryFileNames, readFile, deleteFile} = require('../utils/fileHandling')
const { GraphQLError } = require('graphql')
const crypto = require('crypto')

const todosDirectory = path.join(__dirname, '..', 'data', 'todos')
const ticketDirectory = path.join(__dirname,'..', 'tickets')

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
            const { id, task, description, done } = args
            const filePath = path.join(todosDirectory, `${id}.json`)
            const exists = await fileExists(filePath)
            if (!exists) return new GraphQLError('Oppsie that todo does not exist')
            const updatedTodo = {id, task, description, done}
            await fsPromises.writeFile(filePath, JSON.stringify(updatedTodo))

            return updatedTodo
        },
        deleteTodo: async (_, args, context) => {
            const id = args.id
            const filePath = path.join(todosDirectory, `${id}.json`)
            const Exists = await fileExists(filePath)
            if(!Exists) return new GraphQLError('Oppsie that todo does not exist')
            try {
                await deleteFile(filePath)
            } catch (error) {
                return {
                    deletedTodo: id,
                    success: false
                }
            }
            return {
                deletedTodo: id,
                success: true
            }
        },
        createTicket: async (_,args, context) => {
            const { title, description, type, priority, status, todoId } = args.input
            const filePath = path.join(todosDirectory, `${todoId}.json`)
            const exists = await fileExists(filePath)

            if(!exists) return new GraphQLError('Oppsie that todo does not exist')

            const newTicket = {
                id: crypto.randomUUID(),
				title,
				description: description || '',
				type,
				priority: priority || ticketPriority.LOW,
				status: ticketStatus.NEW,
				todoId
            }

            let ticketIdExists = true
            while (ticketIdExists) {
                const ticketFilePath = path.join(ticketDirectory, `${id}.json`)
                const exists = await fileExists(ticketFilePath)

                if(exists) {
                    newTicket.id = crypto.randomUUID()
                    filePath = path.join(ticketDirectory, `${newTicket.id}.json`)
                }
                idExists = false
            }
            await fsPromises.writeFile(filePath, JSON.stringify(newTicket))

            return newTicket 

        }

    }
}