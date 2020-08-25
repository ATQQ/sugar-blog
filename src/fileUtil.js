const path = require('path')
const fs = require('fs')

/**
 * 递归获取指定目录中的所有文件路径
 * @param {String} dir 目录名 
 * @returns {Array<String>} directorys 文件相对路径数组
 */
let getDirFiles = (dir) => {
    let result = []
    let files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
        if (file.isFile()) {
            result.push(path.join(dir, file.name))
        } else {
            result.push(...getDirFiles(path.join(dir, file.name)))
        }
    })
    return result;
}

/**
 * 获取指定目录中所有文件,限定文件类型
 * @param {String} dir 目录
 * @param {String} type 文件类型(后缀) js/.js 
 */
let getDirFileByType = (dir, type) => {
    return getDirFiles(dir).filter(file => path.extname(file).endsWith(type))
}

module.exports = {
    getDirFiles,
    getDirFileByType
}