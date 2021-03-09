# inditeminds-api

## A Blogs RESTful API created with Expressjs

### Setup

- **Production Mode**
  - Make sure to have **Docker** & **docker-compose** installed in your machines
  - You can build the image locally or use from my hosted images in [Docker Hub](https://hub.docker.com/r/pickezdocker/inditeminds-api)
  - Setup your environment in ```docker-compose.yml``` api services
  > *Recommended to use **MongoDB Atlas*** free plan or paid plan*for environment Production **MongoDB** URL*
  - Run ``` docker-compose up -d ``` on your terminal
  > *Use -d parameters for running on backgrounds*
  - Docker Running on [http://localhost:8081](http://locahost:8081)

- **Development Mode**
  - Make sure to have **MongoDB** & **Redis** installed & runnning in your machines
  - Create ```.env``` file inside ```src``` folders
  - Create **MongoDB** Database for development and set database uri in ```./src/.env``` files
  - Change Directory to ```src``` folders
  - Setup your environment like ```sample.env``` inside ```.env``` files
  - Run commands ```npm i``` for installing all modules,packages,etc
  > *Using npm i or npm install its okay*
  - Run commands ```npm run dev``` for run server in dev mode
  - Server running on [http://localhost:8080](http://localhost:8080)
  > *Use another port its okay ex.5000,3000,8000*

- **Test Mode**
  - Create **MongoDB** Database for test and set database uri in ```./src/.env``` files
  - Repeat from Dev Mode Steps until running commands ```npm i```  
  - Run commands ```npm run test``` for run unit test & functional tests
    - **Test Results** :
      - **Total Tests** : 118 (*All Passed*)
      - **Tests Finished** : (*based on performances*)
  - Run commands ```npm run coverage``` for coverage results of tests
    - **Coverage Results** :
      - **Statements**   : 92.86% ( 585/630 )
      - **Branches**     : 94.17% ( 113/120 )
      - **Functions**    : 95.89% ( 70/73 )
      - **Lines**        : 92.85% ( 584/629 )
