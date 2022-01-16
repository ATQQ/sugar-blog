const path = require('path')
const fs = require('fs')
const matter = require('gray-matter');

function getFileMatterData(filepath) {
    if (!fs.existsSync(filepath)) {
        return {}
    }
    return matter(readFile(filepath)).data
}
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


function readDir(v) {
    return fs.readdirSync(v, { withFileTypes: true })
}
function readFile(v) {
    return fs.readFileSync(v, { encoding: 'utf-8' })
}
function writeFile(filepath, data) {
    return fs.writeFileSync(filepath, data, { encoding: 'utf-8' })
}
function getFileH1(filepath) {
    if (fs.existsSync(filepath)) {
        return readFile(filepath)
            .split('\n').find(str => {
                return str.startsWith('# ')
            }).slice(2).trim() || path.parse(filepath).name
    }
}

module.exports = {
    getDirFiles,
    getDirFileByType,
    readDir,
    readFile,
    getFileH1,
    getFileMatterData,
    writeFile
}