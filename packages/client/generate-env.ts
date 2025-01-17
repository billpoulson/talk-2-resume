import { exec } from 'child_process'
import * as dotenv from 'dotenv'
import fs from 'fs'
const NODE_ENV = process.env['NODE_ENV']
exec(`npx dotenv-vault@latest keys ${NODE_ENV}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`Error: ${stderr}`)
    return
  }
  console.log(stdout)
})

dotenv.config()

// Load environment variables from the .env file
// Generate the environment.ts file dynamically
const envConfig = `
export const environment = {
  auth_issuer: '${process.env['AUTH_ISSUER']}',
  auth_client_id:'${process.env['AUTH_CLIENT_ID']}',
  auth_callback_uri: '${process.env['AUTH_CALLBACK_URI']}',
  auth_audience: '${process.env['AUTH_AUDIENCE']}',
};
`

// Write to environment.ts file
fs.writeFileSync('./src/environment.ts', envConfig)

console.log('Environment file generated successfully!')
