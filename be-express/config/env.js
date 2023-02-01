const dotenv = require('dotenv')
const path = require("path")

const setupEnv = () => {
  console.info(`Running in '${process.env.NODE_ENV}' environment`)
  let envFile
  if (process.env.NODE_ENV) {
    envFile = `.env.${process.env.NODE_ENV}`
  } else {
    envFile = `.env`
  }

  try {
    envFile = path.resolve(__dirname + "/../", envFile)
    console.info(`Using config file '${envFile}'`)
    const vars = dotenv.config({path: envFile})
    console.info("Variables: ", vars.parsed)
  } catch (e) {
    console.error(`Error fetching file in path '${envFile}'. \nError: ${e.stack}`)
  }
}

setupEnv()