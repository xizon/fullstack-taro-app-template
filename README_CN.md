# uix-create-taro-app
  
创建Taro应用的脚手架(扩展版,支持单元测试)

[English Documentation](README.md) | [中文版说明文档](README_CN.md)


## 目录结构

```sh
uix-create-taro-app/
├── README.md
├── LICENSE
├── project.config.json        # 小程序项目配置
├── project.tt.json
├── babel.config.js
├── tsconfig.json
├── global.d.ts
├── package-lock.json
├── package.json                # Node.js manifest
├── test/                       # 单元测试目录
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
│       └── index
│           ├── index.config.ts # 页面配置
│           ├── index.scss      # 页面 CSS
│           └── index.jsx       # 页面组件，如果是 Vue 项目，此文件为 index.vue
└──
```



## 开发调试


**Step 1.** 克隆项目

```sh
$ git clone git://github.com/xizon/uix-create-taro-app.git
```


**Step 2.** 进入您所在设备的 `"uix-create-taro-app/"` 目录.

```sh
$ cd /{your_directory}/uix-create-taro-app
```


**Step 3.** 确保安装了 `Node 14+`, 接下去安装依赖项.

```sh
$ sudo npm install
```

**Step 4.** 测试和打包应用的代码类似

```sh
$ npm run dev:h5
$ npm run build:h5
```

**Step 5 (可选).** 单元测试

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

**🍗 如果使用自己配置的脚手架，需要进行如下操作:**

**Step 1.**  安装Taro的开发依赖

开发所需的 Taro（包含 `react`、`typescript`、`sass`、`mobx`）依赖项。


```sh
# 删除旧的可能有冲突或不必要的包:
$ npm uninstall webpack webpack-cli @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/polyfill @babel/preset-env @babel/preset-react @babel/preset-typescript css-minimizer-webpack-plugin mini-css-extract-plugin moment node-sass babel-loader css-loader raw-loader style-loader glslify-loader json-loader sass-loader react-test-renderer terser-webpack-plugin
```


```sh
$ npm install @babel/runtime @tarojs/runtime @tarojs/taro @tarojs/components @tarojs/plugin-framework-react @tarojs/react mobx mobx-react react react-dom --save
```

```sh
$ npm install @types/webpack-env @types/react @tarojs/mini-runner @tarojs/webpack-runner @babel/core babel-preset-taro eslint eslint-config-taro eslint-plugin-react eslint-plugin-import eslint-plugin-react-hooks stylelint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```


**Step 2.**  复制模板生成的文件:

- project.config.json
- project.tt.json
- global.d.ts
- config/*


**Step 3.**  参考官方生成的taro模板修改自己的配置文件:


- package.json (from `.eslintrc.js` and `package.json`)
- tsconfig.json (from `tsconfig.jsonn`)
- babel.config.js (from `babel.config.js`)



## 感谢

- [React](https://reactjs.org/)
- [Mobx](https://mobx.js.org/)
- [Taro](https://taro.zone//)


## 支持的开发环境

- Taro 3 +
- React 17 +
- TypeScript 4.x.x + 
- Jest 27.x.x


## 许可证

Licensed under the [MIT](https://opensource.org/licenses/MIT).


