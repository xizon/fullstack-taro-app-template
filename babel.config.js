module.exports = {
    "presets": [
        // babel-preset-taro 更多选项和默认值：
        // https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md

        ['taro', {
            framework: 'react',
            ts: true,
            hot: false // 禁用快速刷新，防止错误 `Uncaught ReferenceError: $RefreshReg$ is not defined`
        }]
    ],
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
};

