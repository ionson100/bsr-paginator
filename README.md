# bsr-paginator

> React component paginator

[![NPM](https://img.shields.io/npm/v/bsr-radiocheck.svg)](https://www.npmjs.com/package/bsr-paginator) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save bsr-paginator
```

## Usage

```tsx
import {useEffect, useRef, useState} from "react";
import {Paginator} from 'bsr-paginator'
import 'bsr-paginator/dist/index.css'

export function App() {
    const [myState, setMyState] = useState('');
    const refPaginator = useRef<Paginator>(null)
    useEffect(() => {
        /*fetching SetState(totalRows, pageSize,currentPage)*/
        refPaginator.current!.SetState(500, 10, 1)
    }, [])

    return (
        <div  style={{textAlign:"center",width:"fit-content"}} >
            <div>{myState}</div>
            <Paginator
                range={10}
                ref={refPaginator}
                previous={'<'}
                next={'>'}
                first={'<<'}
                last={'>>'}
                onChange={(page) => {
                    setMyState(page + " page of " + refPaginator.current!.State.PagesCount)
                }}
            />
        </div>
    )
}
```

## License

MIT © [ionson100](https://github.com/ionson100)



[Examples, Help pages](https://ionson100.github.io/wwwroot/index.html#page=15-2).
