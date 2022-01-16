const { docsDir, sidebarList } = require('../../../src/constants')
const { readFile, writeFile } = require('../../../src/util')
const { join } = require('path')

for (const sidebar of sidebarList) {
    const data = require(`./${sidebar}`)
    migrate(data)
}
function migrate(data) {
    const { root, children } = data
    for (const child of children) {
        const [scope, groupTitle, sidebarTitle, docList = []] = child

        // README配置迁移
        const READMEFile = join(docsDir, root, scope, 'README.md')
        const readmeFileContent = readFile(READMEFile).split('\n')
        const readmeYAML = [
            'sidebar:',
            ` title: ${sidebarTitle}`,
            'group:',
            ` title: ${groupTitle}`
        ]
        if (readmeFileContent[0].startsWith('---')) {
            readmeFileContent.splice(1, 0, ...readmeYAML)
        } else {
            readmeFileContent
                .unshift(...[
                    '---',
                    ...readmeYAML,
                    '---'])
        }
        writeFile(READMEFile, readmeFileContent.join('\n'))

        // 子文章迁移
        for (const [idx, childDoc] of docList.entries()) {
            const [route, title] = childDoc
            const docFile = join(docsDir, root, scope, `${route}.md`)
            const docContext = readFile(docFile).split('\n')
            const docYaml = [
                'sidebar:',
                ` title: ${title}`,
                ` step: ${idx}`
            ]
            if (docContext[0].startsWith('---')) {
                docContext.splice(1, 0, ...docYaml)
            } else {
                docContext
                    .unshift(...[
                        '---',
                        ...docYaml,
                        '---'])
            }
            writeFile(docFile, docContext.join('\n'))
        }
    }
}
