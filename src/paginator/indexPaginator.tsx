import React from "react";
import {PaginatorProperty} from "./PaginatorProperty";
import './index.css'

export class MyPaginator extends React.Component<PaginatorProperty, any>  {


   componentDidMount() {
       if(this.props.box.event){
           this.props.box.event(1,1,1)
       }
       this.props.box.action=event => {

           alert(event.currentPage)
       }
   }


    render() {
        return (
            <div className={'bsr-paginator'}>dfldlfk</div>
        );
    }

}