#!/usr/bin/env node

const prompts = require('prompts')
const fs = require('fs-extra')
const logSymbols = require('log-symbols')
const { exec } = require('child_process')

const { packages } = require(`./config.json`)

const command = `npm i -D ${packages.join(' ')} && npx install-peerdeps --dev eslint-config-airbnb`

const files = fs.readdirSync(require.main.path)

if (!files.includes('package.json')) {
  console.log(`${logSymbols.error} No package.json file found \n${logSymbols.info} Run npm init -y to generate one`)
  return process.exit();  
}
const questions = [
  {
    type: 'confirm',
    name: 'Package',
    message: 'Do you want to download dependencies ? (Prettier , Eslint ......)',
    initial: true,
  },
  {
    type: 'confirm',
    name: 'Templates',
    message: 'Do you want to generate templates?',
    initial: true,
  },
  {
    type: 'confirm',
    name: 'ConfirmMessage',
    message: 'Are you Sure you want to do this ?',
    initial: true,
  },
]

const onCancel = () => {
  console.log(logSymbols.error, '.....')
  process.exit()
}

;(async () => {
  const response = await prompts(questions, { onCancel })
  
  if (response.ConfirmMessage === true) {

    if (response.Package === true) {
      console.log(logSymbols.info, `Downloading Dependencies`)
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(error)
          return
        }
  
        console.log(stdout)
        console.error(stderr)
  
        console.log(logSymbols.success, `Done`)
  
      })
      
    }
    
    if (response.Templates === true) {
      
      console.log(logSymbols.info, `Loading Templates`)
  
      const templates = fs.readdirSync('./templates/')

      for (const template of templates) {
        fs.copy(
          `${require.main.path}/templates/${template}`,
          `${process.cwd()}/${template}`
        )

          .then(() => {
            console.log(logSymbols.success, `Loaded ${template}`)
          })
          .catch((err) => console.error(err))
      }
    }
    

    
  }
})()
