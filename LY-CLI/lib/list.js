const templateList = require('./template-list')
const chalk = require('chalk')

module.exports = async () => {
    Object.keys(templateList).forEach(name => {
        const repo = templateList[name]
        console.log(
            '  ' + chalk.yellow('★') +
            '  ' + chalk.blue(name) +
            ' - ' + repo.description)
    })
}