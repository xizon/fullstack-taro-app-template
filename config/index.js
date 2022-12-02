
//配置请查看：https://taro-docs.jd.com/taro/docs/config-detail/#alias
const path = require('path');


const config = {
    projectName: 'fullstack-taro-app-template',
    date: '2022-11-22',
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    alias: {

        // specific mappings.
        // Supports directories and custom aliases for specific files when the express server is running, 
        // you need to configure the following files at the same time:
        // 1) `babel.config.js`    --> "plugins": [["module-resolver", {"alias": {...}} ]]
        // 2) `tsconfig.json`      --> "compilerOptions": { "paths": {...} }
        // 3) `package.json`       --> "jest": { "moduleNameMapper": {...} }

        '@': path.resolve(__dirname, '..', 'src'),
        '@/config': path.resolve(__dirname, '..', 'src/config'),
        '@/components': path.resolve(__dirname, '..', 'src/components'),
        '@/status': path.resolve(__dirname, '..', 'src/status'),
        '@/utils': path.resolve(__dirname, '..', 'src/utils'),
        '@/assets': path.resolve(__dirname, '..', 'src/assets')

    },
    plugins: [],
    defineConstants: {
    },
    copy: {
        patterns: [
        ],
        options: {
        }
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
        enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {

                }
            },
            url: {
                enable: true,
                config: {
                    limit: 1024 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        devServer: {
            hot: false  // 禁用快速刷新，防止错误 `Uncaught ReferenceError: $RefreshReg$ is not defined`
        },
        postcss: {
            autoprefixer: {
                enable: true,
                config: {
                }
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    rn: {
        appName: 'taroDemo',
        postcss: {
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            }
        }
    }
}

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'))
    }
    return merge({}, config, require('./prod'))
}
