## Installation

```bash
#install dependencies and devDependencies (node_modules)
yarn install or npm install
```

> optinal

```bash
# formating the code
yarn format or npm run format

# to check the error and bugs
yarn lint or npm run lint
```

## important - create .env file and .env.production file

- create .env -> file for development in local

- create .env.production -> file for production

> how to use variable or data in .env and .env.production file - given an example in .env.example file

- .env.example -> file for demo to how use envirenment variables (available in root dir).

# after creating a .env and .env.production file then start below command.

## Running the app

```bash
# development
yarn dev or npm run dev

# production mode
yarn dev:production or npm run dev:production

#build production
yarn build or npm run build

#start build server in local (make sure to you have install in your system : npm install -g serve)
yarn build:start or npm run build:start
```
