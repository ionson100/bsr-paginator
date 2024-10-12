# bsr-paginator

> React component paginator

[![NPM](https://img.shields.io/npm/v/bsr-radiocheck.svg)](https://www.npmjs.com/package/bsr-paginator) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save bsr-paginator
```

## Usage

```tsx
function App() {
    const refPag=useRef<Paginator>(null)
    const [state, setState] = useState('')
    useEffect(()=>{
        refPag.current!.SetState(500, 10, 1, () => {
            writeState()
        })
    })
    function writeState(){
        setState(`total:${refPag.current!.State.TotalRows}
         pageSize:${refPag.current!.State.PageSize} 
         currentPage:${refPag.current!.State.CurrentPage} 
         pages: ${refPag.current!.State.PagesCount} 
         Range:${refPag.current!.State.Range} 
         mode:${refPag.current!.State.Mode}`)
    }

    return (
        <div>
            <div>{state}</div>
            
            <Paginator
                next={'>'}
                previous={'<'}
                last={'>>'}
                first={'<<'}
                ref={refPag}
                onPageClick={(page,sender) => {
                    setState(`page:${page} of ${refPag.current!.State.PagesCount}`)
                }}
            />
        </div>
    );
}
```

## License

MIT © [ionson100](https://github.com/ionson100)



[Examples, Help pages](https://ionson100.github.io/wwwroot/index.html#page=15-2).
