/* 
 *************************************
 * <!-- Button -->
 *************************************
 */
import React from 'react';
import { Button } from '@tarojs/components';
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
        <div>

            {href ? (
                <Button onClick={(e) => navigateTo(e, href)} {...attributes}>
                    {btnName || 'Default'}
                </Button>
            ) : (
                <Button {...attributes}>
                    {btnName || 'Default'}
                </Button>
            )}

        </div>
    )

}
