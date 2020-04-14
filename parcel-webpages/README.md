# Parcel Bundle (alternative to webpack)
## Configuration

If you haven't already installed `Node` and `npm`, you should follow this
[tutorial for Node and npm installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or installing it directly through your OS [package manager](https://nodejs.org/en/download/package-manager/#arch-linux)


Once everything is installed, run the following command in the react project directory `webpages/` to install the required dependencies to run the react application :
```shell
$ npm install
```
You are now ready to start 
___
## Available Scripts

**In the `webpages` directory, you can use the following commands :**

```shell
$ npm start
```

Runs the application in development mode server at [http://localhost:8080](http://localhost:8080)

>-   The page will reload if you make edits. 
___

```shell
$ npm run build
```
Builds the application for production to the `./dist` folder.
Your application is ready to be deployed!

___
## Running the production ready app 

After building the app, you can serve the files located at webpages/build/ to the user. The simplest way is to install and run `serve`

 ```shell
npm install -g serve
 ```
```shell
serve -s dist -l 8080
```

>**Note : the application must be launched on port 8080 to receive data from the API**


