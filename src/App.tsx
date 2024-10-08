import React, {useRef, useState} from 'react';

//import { FaChevronRight } from "react-icons/fa";
//import { FaChevronLeft } from "react-icons/fa";

//import { FaCaretLeft } from "react-icons/fa6";
//import { FaCaretRight } from "react-icons/fa6";
import { FaEllipsisH } from "react-icons/fa";

import {Paginator} from "./paginator/paginateBuilder";


function App() {
    const [name, setName] = useState('sdsd')
   const  refPaginator=useRef<Paginator>(null)
  return (
      <div>
          <button onClick={()=>{
              refPaginator.current!.Observer.TotalRows=600;
              setName('')
          }}>Total</button>

          <button onClick={()=>{
              refPaginator.current!.Observer.CurrentPage=3;

          }}>current Page</button>

          <button onClick={()=>{
              refPaginator.current!.Observer.PageSize=3;
              setName('')
          }}>size</button>

          <div>{name}</div>
          <Paginator
              range={5}
              //isVisibleSide={false}
              onButtonClick={(val,pages)=>{
                  refPaginator.current!.Observer.CurrentPage=val
                  setName(val+' of '+pages)
              }}
             // first={'first'}
             // last={'last'}
              //previous={'Previous'}
             // next={'Next'}
              ellipsis={<FaEllipsisH/>}
              ref={refPaginator}/>


      </div>
  );
}

export default App;
