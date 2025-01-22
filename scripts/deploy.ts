import * as dotenv from 'dotenv'
import shell from 'shelljs'

// Helper function to trim command output
const trimOutput = (command: string, cwd: string): string => {
  const result = shell.exec(command, { silent: true, cwd })

  if (result.code !== 0) {
    console.error(`Error running command: ${command}`)
    shell.exit(result.code)
  }

  return result.stdout.trim()

}

export function deploy(nodeEnv: string = 'development') {
  // rebuild the dotenv vault
  shell.exec('npm run -ws dotenv:build --if-present')

  // set environment and decode dotenv vault
  const NODE_ENV = nodeEnv
  process.env['NODE_ENV'] = NODE_ENV
  process.env['DOTENV_KEY'] = trimOutput(`npx dotenv-vault@latest keys ${NODE_ENV}`, '.')
  const currentEnv = dotenv.config()


  const env = {
    ...process.env,
    ...currentEnv.parsed,
    DOTENV_KEY_CLIENT: trimOutput(`npx dotenv-vault@latest keys ${NODE_ENV}`, './packages/client'),
    DOTENV_KEY_API: trimOutput(`npx dotenv-vault@latest keys ${NODE_ENV}`, './packages/api'),
    DOTENV_KEY_SHARE: trimOutput(`npx dotenv-vault@latest keys ${NODE_ENV}`, './packages/file-sharing'),
  }

  // generate environment ts files
  shell.exec('npm run generate-env -ws --include-workspace-root --if-present', {
    env: {
      DOTENV_KEY: env.DOTENV_KEY_CLIENT,
      NODE_ENV,
    }
  })

  shell.exec(`npm run build --workspace=@talk2resume/api`, {
    env: { ...env, NODE_ENV }
  })

  shell.exec(`docker-compose -f compose.${NODE_ENV}.yaml up --build -d`, {
    env
  })

  console.log('Script completed successfully.')

}