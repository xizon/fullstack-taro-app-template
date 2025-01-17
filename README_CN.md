# Full-Stack Taro Application Template
  
这个存储库是一个基于Taro构建的全栈小程序示例模板，它创建了一个简单的扩展架构(跨组件状态管理, 异步请求等)，并提供了启动和运行基本应用程序所需的基础服务、组件和管道。


[English Documentation](README.md) | [中文版说明文档](README_CN.md)


<img src="screenshots/demo.gif" width="300px">
<img src="screenshots/demo-pagination.gif" width="300px">


## 提供方案

这里列出完成的的进度:

| 功能块 | 支持 |
| --- | --- |
| 导航 | ✔ |
| 参数获取 | ✔ |
| 授权 | ✔ |
| 登录\/退出 | ✔ |
| 注册 | ✔ |
| 状态管理 | ✔ |
| 网络请求 | ✔ |
| 上传 | ✔ |
| 文件系统（针对图片） | ✔ |
| 链接跳转 | ✔ |
| 滑动触发器 | ✔ |
| HTML5标签 | ✔ |
| 拖拽移动（针对上传的图片） | ✔ |
| 分页 | ✔ |
| 云部署 | ✔ |
| 嵌入远程页面 | ✔ |
| 画布 | ✔ |
| 基础的Taro-UI | ✔ |
| 数据CURD | ✔ |
| 权限判断 | ✔ |



## 目录结构

```sh
fullstack-taro-app-template/
├── README.md
├── LICENSE
├── project.config.json        # 小程序项目配置
├── project.tt.json
├── babel.config.js
├── tsconfig.json
├── package-lock.json
├── package.json                # Node.js manifest
├── screenshots/                # 截图
├── cloud-hosting/              # 云托管后端服务器文件包
├── dist/                       # 打包目录
├── config                      # 编译配置目录
│   ├── dev.js                  # 开发模式配置
│   ├── index.js                # 默认配置
│   └── prod.js                 # 生产模式配置
├── src
│   ├── app.config.ts           # 全局配置
│   ├── app.scss                # 全局 CSS
│   ├── app.tsx                 # 入口组件
│   ├── index.html              # H5 入口 HTML
│   └── pages                   # 页面组件
│   │   └── index
│   │       ├── index.config.ts # 页面配置
│   │       ├── index.scss      # 页面 CSS
│   │       └── index.jsx       # 页面组件，如果是 Vue 项目，此文件为 index.vue
│   │
│   ├── status/                 # 使用 Redux 来管理跨组件状态的目录
│   ├── assets/
│   ├── config/
│   ├── components/    
│   └── ...
└──
```



## 开发调试


**Step 1.** 克隆项目

```sh
$ git clone git://github.com/xizon/fullstack-taro-app-template.git
```


**Step 2.** 进入您所在设备的 `"fullstack-taro-app-template/"` 目录.

```sh
$ cd /{your_directory}/fullstack-taro-app-template
```


**Step 3.** 确保安装了 `Node 14+`, 接下去安装依赖项.

```sh
$ sudo npm install
```




**Step 4.** 数据库连接

a) 本地测试数据保存写入，先搭建 `PHP` 本地服务器，并使用下面的资料来保证数据库连接

```sh
hostname='localhost';
username='mm';
password='mm';
database='test1';
```


b) 使用浏览器运行下面的地址，生成表

```sh
http://127.0.0.1:8888/fullstack-taro-app-template/cloud-hosting/miniprogram-deploy-package/sql-init.php
```


c) 使用收藏功能时即可操作数据存储

进入我的，点击登录，然后即可使用收藏功能。



**Step 5.** 测试和打包应用的代码类似

```sh
$ npm run dev:h5
$ npm run build:h5
```

**Step 6 (可选).** 单元测试

```sh
$ npm run test
```


## Taro开发环境配置流程

**Step 1.**  安装 [node](https://nodejs.org/), [Taro CLI](https://taro.zone/) 到您的设备中.

```sh
# 全局安装Node
$ curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
$ sudo yum install -y nodejs
$ node -v

# 全局安装Taro CLI
$ sudo npm i -g @tarojs/cli
$ taro -v
```

**Step 2.** 安装Taro模板

```sh
$ cd /{your_directory}
$ sudo taro init
```

## 其它常见问题


### ⚙️ 导入图片时，为了让编辑器（VS Code）不报错的解决方案:

创建一个全局生声明文件 `global.d.ts` 到 `src/` 处理图片资源:

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


### ⚙️ 使用别名或者其他，修改以下文件:

首先需要安装一个依赖:

```sh
$ npm i babel-plugin-module-resolver
```

接着修改下面的配置文件: 

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

默认没有安装 **Jest**，如果需要，请执行下面的代码：

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



### ❌ 报错: `@import rules are deprecated and will be removed in Dart Sass 3.0.0.` 或者 `ERROR in ./src/app.scss ... Undefined variable.`

解决方案：

降级稳定版的 SASS

```sh
$ npm uninstall sass
$ npm install sass@1.54.5 --save-dev
```


### ❌ 报错: `[object Object] is not a PostCSS plugin Error: pages/index/index.wxss from Css Minimizer plugin`

解决方案：

```sh
$ npm i postcss --save-dev
```

### ❌ 报错: `Uncaught ReferenceError: $RefreshReg$ is not defined`

解决方案：

禁用快速刷新,修改配置文件 `config/index.js` 和 `babel.config.js`。


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

## 更新日志

[releases](CHANGELOG.md)


## 感谢

- [React](https://reactjs.org/)
- [Taro](https://taro.zone//)
- [redux](https://redux.js.org/)


## 支持的开发环境

- Taro 4.0.8 +
- nutui 2.7.5 +
- React 18 +


## 许可证

Licensed under the [MIT](https://opensource.org/licenses/MIT).


