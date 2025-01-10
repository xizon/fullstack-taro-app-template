import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { Button, ConfigProvider, TextArea, Dialog, Space } from '@nutui/nutui-react-taro'
import enUS from '@nutui/nutui-react-taro/dist/locales/en-US'
import zhCN from '@nutui/nutui-react-taro/dist/locales/zh-CN'


import './index.scss'


function Index() {
    const [locale, setLocale] = useState<any>(zhCN);
    const localeKey = locale === zhCN ? 'zhCN' : 'enUS';
    const [visible, setVisible] = useState<boolean>(false);
    const [translated] = useState<Record<string, any>>({
        zhCN: {
            welcome: '欢迎使用 NutUI React 开发 Taro 多端项目。',
            button: '使用英文',
            open: '点击打开',
        },
        enUS: {
            welcome: 'Welcome to use NutUI React to develop Taro multi-terminal projects.',
            button: 'Use Chinese',
            open: 'Click Me',
        },
    });
    const handleSwitchLocale = () => {
        setLocale(locale === zhCN ? enUS : zhCN)
    }
    return (
        <ConfigProvider locale={locale}>
            <View className="wrapper">

                <View className="page-title">官方演示</View>

                <View className="official">
                    <View>{translated[localeKey].welcome}</View>
                    <View>

                        <Space style={{marginBottom: 10, marginTop: 10}}>
                            <Button type='primary' onClick={handleSwitchLocale}>
                                {translated[localeKey].button}
                            </Button>
                            <Button type='success' onClick={() => setVisible(true)}>
                                {translated[localeKey].open}
                            </Button>
                        </Space>


                        <Dialog
                            visible={visible}
                            onConfirm={() => setVisible(false)}
                            onCancel={() => setVisible(false)}>
                            {translated[localeKey].welcome}
                        </Dialog>


                        <TextArea showCount maxLength={20} />


                    </View>
                </View>


            </View>
        </ConfigProvider>
    )
}

export default Index
