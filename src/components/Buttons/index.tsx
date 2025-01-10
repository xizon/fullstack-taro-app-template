/* 
 *************************************
 * <!-- Button -->
 *************************************
 */
import React from 'react';
import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro';

/*-- Apply this component styles --*/
import './styles/_style.scss';


interface ButtonProps extends React.ComponentPropsWithoutRef<any> {
    btnName?: string;
    href?: string;
};


export default function CustomButton(props: ButtonProps) {

    const {
        btnName,
        href,
        ...attributes
    } = props;


    function navigateTo(e, url) {
        e.preventDefault();
        Taro.navigateTo({ url: url });
    }


    return (
        <>

            {href ? (
                <Button type='primary' onClick={(e) => navigateTo(e, href)} {...attributes}>
                    {btnName || 'Default'}
                </Button>
            ) : (
                <Button type='primary' {...attributes}>
                    {btnName || 'Default'}
                </Button>
            )}

        </>
    )

}
