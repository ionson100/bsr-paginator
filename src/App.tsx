import React, {useRef} from 'react';

import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";

import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";

import {Paginator} from "./paginator/paginateBuilder";


function App() {
   const  refPaginator=useRef<Paginator>(null)
  return (
      <div>
          <button onClick={()=>{
              refPaginator.current!.Observer.TotalRows=100;
          }}>Total</button>

          <button onClick={()=>{
              refPaginator.current!.Observer.CurrentPage=2;
          }}>Page</button>

          <button onClick={()=>{
              refPaginator.current!.Observer.PageSize=100;
          }}>size</button>

          <Paginator
              isVisibleSide={true}
              onButtonClick={(val)=>{
                  refPaginator.current!.Observer.CurrentPage=val
              }}
              first={<FaCaretLeft color={"green"}/>}
              last={<FaCaretRight color={"green"}/>}
              previous={<FaChevronLeft color={"green"}/>}
              next={<FaChevronRight color={"green"}/>}
              ref={refPaginator}/>


      </div>
  );
}

export default App;
