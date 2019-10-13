const fs = require('fs')
const download = require('download-git-repo') // 下载并提取 git 仓库，用于下载项目模板
const inquirer = require('inquirer') // 通用的命令行用户界面集合，用于和用户进行交互
const ora = require('ora') // 下载过程久的话，可以用于显示下载中的动画效果
const chalk = require('chalk') // 可以给终端的字体加上颜色。
const symbols = require('log-symbols')
const templateList = require('./template-list')

function logErrMsg(msg) {
    console.log(symbols.error, chalk.red(msg))
}

module.exports = async (templateName, projectName) => {
    const template = templateList[templateName]
    if (!template) {
        logErrMsg('没有该模板，请确认！')
        process.exit(1)
    }

    if (fs.existsSync(projectName)) {
        logErrMsg('项目已存在！')
        process.exit(1)
    }

    const answers = await inquirer.prompt(
        [
            {
                name: 'author',
                message: '请输入作者名称：'
            },
            {
                name: 'projectname',
                message: '请输入projectname：(若无，可不填)'
            },
            // {
            //     name: 'appid',
            //     message: '请输入小程序appid：(若无，可不填)'
            // },
        ]
    )

    const spinner = ora('项目生成中...').start()

    download('direct:' + template.url, projectName, {
        clone: true
    }, (err) => {
        if (err) {
            spinner.fail()
            logErrMsg(err)
            process.exit(1)
        }

        spinner.succeed()

        const pkgFile = `${projectName}/package.json`
        if (fs.existsSync(pkgFile)) {
            const content = fs.readFileSync(pkgFile).toString()
            let json = JSON.parse(content)
            json.name = projectName
            json.author = answers.author
            fs.writeFileSync(pkgFile, JSON.stringify(json, null, '\t'), 'utf-8')
        }
        
        const projectFile = `${projectName}/project.config.json`
        if (fs.existsSync(projectFile)) {
            const content = fs.readFileSync(projectFile).toString()
            let json = JSON.parse(content)
            json.appid = answers.appid || json.appid
            json.projectname = answers.projectname || json.projectname
            fs.writeFileSync(projectFile, JSON.stringify(json, null, '\t'), 'utf-8')
        }
        console.log(symbols.success, chalk.green('项目初始化完成'))
    })

}