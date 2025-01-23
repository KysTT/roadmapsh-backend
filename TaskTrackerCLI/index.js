#!/usr/bin/env node

import {program} from "commander";
import chalk from "chalk"
import fs from "fs"

const tasksPath = "./tasks.json"

function readTasks() {
    if (fs.existsSync(tasksPath)) {
        const data = fs.readFileSync(tasksPath, "utf8")
        if (data !== "") return JSON.parse(data)
        else return []
        }
    return []
}

function writeTask(tasks){
    fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), ()=>{})
}

function getNextId(){
    const tasks = readTasks()
    if (tasks.length !== 0) return tasks[Object.keys(tasks)[Object.keys(tasks).length - 1]].id + 1
    return 1
}

function markInProgress(taskId){
    const tasks = readTasks()

    for (const task of tasks){
        if (task.id == taskId) {
            task.status = 'in-progress'
        }
    }
    writeTask(tasks)
}

function markDone(taskId){
    const tasks = readTasks()

    for (const task of tasks){
        if (task.id == taskId) {
            task.status = 'done'
        }
    }
    writeTask(tasks)
}

function markToDo(taskId){
    const tasks = readTasks()

    for (const task of tasks){
        if (task.id == taskId) {
            task.status = 'todo'
        }
    }
    writeTask(tasks)
}

function updateTask(taskId, desc){
    const tasks = readTasks()
    let date = `${new Date().getUTCDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}`

    for (const task of tasks) {
        if (task.id == taskId) {
            task.description = desc
            task.updatedAt = date
        }
    }
    writeTask(tasks)
}

function addNewTask(desc) {
    const tasks = readTasks()
    let date = `${new Date().getUTCDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}`
    let task = {
        id: getNextId(),
        description: desc,
        status: 'todo',
        createdAt: date,
        updatedAt: date,
    }
    tasks.push(task)
    writeTask(tasks)
}

function removeTask(taskId){
    const tasks = readTasks()
    let newTasks = []
    for (const task of tasks) {
        if (task.id != taskId) {
            newTasks.push(task)
        }
    }
    writeTask(newTasks)
}

function getMarkedTasks(mark){
    const tasks = readTasks()
    let newTasks = []
    for (const task of tasks) {
        if (task.status == mark) {
            newTasks.push(task)
        }
    }
    return newTasks
}

function listTasks(mark){
    const tasks = readTasks()
    if (mark == undefined) tasks.forEach(task => {
        console.log(`Task # ${task.id}`)
        console.log(`Description: ${task.description}`)
        console.log(`Status: ${addStatusColour(task.status)}`)
        console.log(`Created: ${task.createdAt}`)
        console.log(`Updated: ${task.updatedAt}`)
        console.log()
    })
    else{
        const markedTasks = getMarkedTasks(mark)
        markedTasks.forEach(task => {
            console.log(`Task # ${task.id}`)
            console.log(`Description: ${task.description}`)
            console.log(`Status: ${addStatusColour(task.status)}`)
            console.log(`Created: ${task.createdAt}`)
            console.log(`Updated: ${task.updatedAt}`)
            console.log()
        })
    }
}

function addStatusColour(status){
    let colour = chalk.green(status)
    switch(status){
        case 'todo':
            return `Status: ${chalk.yellow(status)}`
        case 'in-progress':
            return `Status: ${chalk.cyan(status)}`
        case 'done':
            return `Status: ${chalk.green(status)}`
    }

}

program
    .command('add')
    .argument('<desc>')
    .description('Add a new task')
    .action((desc) => {addNewTask(desc)})

program
    .command('update')
    .argument('<id>')
    .argument('<desc>')
    .description('Update existing task by id')
    .action((id, desc) => {updateTask(id, desc)})

program
    .command('list')
    .argument('[mark]')
    .description('Listing all tasks')
    .action((mark) => {listTasks(mark)})

program
    .command('delete')
    .argument('<id>')
    .description('Delete task by id')
    .action((id) => {removeTask(id)})

program
    .command('mark-done')
    .argument('<id>')
    .description('Delete task by id')
    .action((id) => {markDone(id)})

program
    .command('mark-in-progress')
    .argument('<id>')
    .description('Delete task by id')
    .action((id) => {markInProgress(id)})

program
    .command('mark-todo')
    .argument('<id>')
    .description('Delete task by id')
    .action((id) => {markToDo(id)})

program.parse(process.argv);