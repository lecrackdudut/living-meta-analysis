This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Configuration

**Note : a `NodeJS` version >= ...  and `npm` version >= ... is required**

If you haven't already installed Node and npm, you should follow this
[tutorial for Node and npm installation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
or installing it directly through your os [package manager](https://nodejs.org/en/download/package-manager/#arch-linux)

Once everything's installed, run the following command in the react project directory `webpages/` to install the required dependancies to run the react application :
```
npm install
```
You are now ready to start 
___
## Available Scripts

**In the `webpages` directory, you can use the following commands :**

```
npm start
```

Runs the app in the development mode and opens [http://localhost:8080](http://localhost:8080)in the browser to view the application

>-   The page will reload if you make edits. 
>
>-   You will also see any lint errors in the console.
___

```
npm run build
```
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

___
```
npm run eject
```
>**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
___
## Running the production ready app 

After building the app, you can serve the files located at webpages/build/ to the user. The simplest way is to install and run `serve`

 ```shell
npm install -g serve
 ```
```shell
serve -s build -l 8080
```

>**Note : the application must be launched on port 8080 to receive data from the API**

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
