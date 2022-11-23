# @/components/Buttons

![MIT license](https://badgen.now.sh/badge/license/MIT)

[Source](https://github.com/xizon/fullstack-taro-app-template/tree/main/src/components/Buttons)


## API

### Buttons
```js
import Button from '@/components/Buttons';
```
| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | string | - | Providing a href which is a route URL. |
| `btnName` | string \| React.ReactNode  | - | The currently selected page number.  |

It accepts all props(include data-* attributes) which native buttons support.


## Examples

```js
import React from 'react';
import { View } from '@tarojs/components';
import Button from '@/components/Buttons';


export default () => {
  return (
    <View>
		<Button className='btn-max-w' plain type='primary' btnName='Posts' href={`/pages/posts/index`} />
    </View>
  );
}

```