const fsPromises = require('fs/promises')

exports.fileExists = async (filePath) => !!(await fsPromises.stat(filePath).catch((e) => false))

exports.deleteFile = async (filePath) => await fsPromises.unlink(filePath)

exports.getDirectoryFileNames = async (directoryPath) => await fsPromises.readdir(directoryPath)

