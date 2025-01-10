# Full-Stack Taro Application Template
  
 This repository is a full-stack sample mini program based on Taro that creates a simple extended architecture (Redux, Asynchronous requests etc.), and provides the foundational services, components, and plumbing needed to get a basic application up and running. 

[English Documentation](README.md) | [中文版说明文档](README_CN.md)


<img src="screenshots/demo.gif" width="300px">
<img src="screenshots/demo-pagination.gif" width="300px">


## Scheme

List my progress here:

| Function Block |  Supports  |
| --- | --- |
| Navigation | ✔ |
| Parameter Acquisition | ✔ |
| Authorization | ✔ |
| Login\/Logout | ✔ |
| Register | ✔ |
| State Management | ✔ |
| Network Requests | ✔ |
| Upload | ✔ |
| File System (for image) | ✔ |
| Link Jump | ✔ |
| Scroll Trigger | ✔ |
| HTML5 Tags | ✔ |
| DragDrop (for uploaded image) | ✔ |
| Pagination | ✔ |
| Cloud Hosting | ✔ |
| WebView | ✔ |
| Canvas | ✔ |
| Basic Taro-UI | ✔ |
| CURD | ✔ |
| Authority Diagnosis | ✔ |


## File Structures

```sh
fullstack-taro-app-template/
├── README.md
├── LICENSE
├── project.config.json        # Mini Program Project Configuration
├── project.tt.json
├── babel.config.js
├── tsconfig.json
├── package-lock.json
├── package.json                # Node.js manifest
├── screenshots/                # screenshots
├── cloud-hosting/              # Deploy backend server using Cloud Hosting
├── dist/                       # Packaged Directory
├── config                      # Compile configuration directory
│   ├── dev.js                  # Development Mode Configuration
│   ├── index.js                # Default Configuration
│   └── prod.js                 # Production Mode Configuration
├── src
│   ├── app.config.ts           # Global Configuration
│   ├── app.scss                # Global CSS
│   ├── app.tsx                 # Entry Component
│   ├── index.html              # H5 Entry HTML
│   └── pages                   # Page Component
│   │   └── index
│   │       ├── index.config.ts # Page Configuration
│   │       ├── index.scss      # Page CSS
│   │       └── index.jsx       # Page Component,If the Vue project, this file is index.vue
│   │
│   ├── status/                 # Using Redux to manage folders of state across components
│   ├── assets/
│   ├── config/
│   ├── components/ 
│   └── ...   
└──
```
  

## Installation And Test


**Step 1.** Clone the repo to get all source files including build scripts: 

```sh
$ git clone git://github.com/xizon/fullstack-taro-app-template.git
```


**Step 2.** First, using an absolute path into your `"fullstack-taro-app-template/"` folder directory.

```sh
$ cd /{your_directory}/fullstack-taro-app-template
```


**Step 3.** Before doing all dev stuff make sure you have `Node 14+` installed. After that, run the following code in the main directory to install the node module dependencies.

```sh
$ sudo npm install
```

**Step 4.** Database connection

a) Save and write local test data. First build a `PHP` local server and use the following information to ensure database connection

```sh
hostname='localhost';
username='mm';
password='mm';
database='test1';
```

b) Use a browser to run the following address to generate a table

```sh
http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/sql-init.php
```

c) Use the collection function to operate data storage

Enter My, click Login, and then you can use the collection function.

**Step 5.** Test the application, such as the command

```sh
$ npm run dev:h5
$ npm run build:h5
```

**Step 6 (Optional).** Unit Testing

```sh
$ npm run test
```




## Configuration process of Taro development environment

**Step 1.**  You will need to have [node](https://nodejs.org/), [Taro CLI](https://taro.zone/) setup on your machine.

```sh
# Install Node globally
$ curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
$ sudo yum install -y nodejs
$ node -v

# Install Taro CLI globally
$ sudo npm i -g @tarojs/cli
$ taro -v
```

**Step 2.** Install the Taro template

```sh
$ cd /{your_directory}
$ sudo taro init
```

## FAQs


### ⚙️ When importing pictures, in order to prevent the editor (VS Code) from reporting errors:

Create a declaration file `global.d.ts` to `src/` for image resources:

```js
declare module '*.png' {
    const value: string;
    export default value;
}
declare module '*.jpg' {
    const value: string;
    export default value;
}
declare module '*.jpeg' {
    const value: string;
    export default value;
}
declare module '*.svg' {
    const value: string;
    export default value;
}
declare module '*.gif' {
    const value: string;
    export default value;
}
declare module '*.webp' {
    const value: string;
    export default value;
}
```



### ⚙️ To use an alias or other custom configuration, modify the following files:

First install a dependency:

```sh
$ npm i babel-plugin-module-resolver
```

Then: 

config/index.js 

```js
    alias: {
        '@': path.resolve(__dirname, '..', 'src'),
        '@/config': path.resolve(__dirname, '..', 'src/config'),
        '@/components': path.resolve(__dirname, '..', 'src/components'),
        '@/status': path.resolve(__dirname, '..', 'src/status'),
        '@/utils': path.resolve(__dirname, '..', 'src/utils'),
        '@/assets': path.resolve(__dirname, '..', 'src/assets')

    },
```


package.json

```json
  "jest": {
    "testEnvironment": "jsdom",
    "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^@/(.*)": "<rootDir>/src/$1",
      "^@/config/(.*)": "<rootDir>/src/config/$1",
      "^@/components/(.*)": "<rootDir>/src/components/$1",
      "^@/status/(.*)": "<rootDir>/src/status/$1",
      "^@/utils/(.*)": "<rootDir>/src/utils/$1",
      "^@/assets/(.*)": "<rootDir>/src/assets/$1"
    },
    "transform": {
      "^.+\\.(js|jsx)$": "babel-jest",
      "^.+\\.(ts|tsx)?$": "ts-jest"
    }
  },
```

**Jest** is not installed by default, if necessary, please execute the following code:

```sh
$ npm i @testing-library/jest-dom @types/jest jest ts-jest --save-dev
```


tsconfig.json

```json
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/config/*": ["config/*"],
      "@/components/*": ["components/*"],
      "@/status/*": ["status/*"],
      "@/utils/*": ["utils/*"],
      "@/assets/*": ["assets/*"]
    },
```




babel.config.js 

```js
    "plugins": [
        ["module-resolver", {
            "root": ["./src"],
            "alias": {
                "@/": "./src",
                "@/config": "./src/config",
                "@/components": "./src/components",
                "@/status": "./src/status",
                "@/utils": "./src/utils",
                "@/assets": "./src/assets"
            }
        }]

    ]
```




### ❌ ERROR: `@import rules are deprecated and will be removed in Dart Sass 3.0.0.` or `ERROR in ./src/app.scss ... Undefined variable.`

Solution:

Downgrade the stable version of SASS

```sh
$ npm uninstall sass
$ npm install sass@1.54.5 --save-dev
```


### ❌ ERROR: `[object Object] is not a PostCSS plugin Error: pages/index/index.wxss from Css Minimizer plugin`

Solution:

```sh
$ npm i postcss --save-dev
```


### ❌ ERROR: `Uncaught ReferenceError: $RefreshReg$ is not defined`

Solution:

Disable fast refresh, and change the configuration from `config/index.js` and `babel.config.js`.


config/index.js

```js
  h5: {
    devServer: {
      hot: false 
    }
  }
```


babel.config.js

```js
  presets: [
    ['taro', {
      framework: 'react',
      hot: false
    }]
  ]
```


## Changelog

[releases](CHANGELOG.md)




## Contributing

- [React](https://reactjs.org/)
- [Taro](https://taro.zone//)
- [redux](https://redux.js.org/)


## Supported development environment

- Taro 4.0.8 +
- nutui 2.7.5 +
- React 18 +


## Licensing

Licensed under the [MIT](https://opensource.org/licenses/MIT).


