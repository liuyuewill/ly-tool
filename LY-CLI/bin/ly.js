#!/usr/bin/env node

const program = require('commander') // 可以自动的解析命令和参数，用于处理用户输入的命令
const pkg = require('../package.json')
const chalk = require('chalk') // 让你 console.log 出来的字带颜色，比如成功时的绿色字
const didYouMean = require('didyoumean')

didYouMean.threshold = 0.6

program
    .version(pkg.version, '-v, --version')
    .usage('<command> [options]')

program
    .command('init <template-name> <project-name>')
    .description(' 根据指定模板<template-name> 生成小程序项目<project-name>  ')
    .action((templateName, projectName) => {
        require('../lib/init')(templateName, projectName)
    })

program
    .command('list')
    .description(' 列出所有可用模板  ')
    .action(() => {
        require('../lib/list')()
    })

program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`wr <command> --help`)} for detailed usage of given command.`)
    console.log()
})

program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp()
        console.log()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
        suggestCommands(cmd)
    })


    program.parse(process.argv)

    if (!process.argv.slice(2).length) {
        program.outputHelp()
    }
    
    
    function suggestCommands(unknownCommand) {
        const availableCommands = program.commands.map(cmd => {
            return cmd._name
        })
    
        const suggestion = didYouMean(unknownCommand, availableCommands)
        if (suggestion) {
            console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
        }
    }