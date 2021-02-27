//GC stands for Google Classroom

import React,{Component} from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import axios from "axios";
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {fetchClassroom} from '../../redux/actions/classroomAction';
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../../utils/errorHandler';
import { Fab } from "@material-ui/core/";
import { Add } from "@material-ui/icons";

class ImportGC extends Component{
    constructor(props){
        super(props);
        this.state={
            open: false
        }
    }

    static async getInitialProps(ctx){
        
    }
    
    toggle=()=>{
        if(!this.state.open){
            setTimeout(() => {
                this.setState({open:!this.state.open})
            }, 3000);
        }else this.setState({open:!this.state.open})
    }

    fetch=async()=>{
        this.props.fetchClassroom(this.props.uid,this.props.toastManager);
        this.props.toastManager.add("Fetching...",{appearance:'success', autoDismiss:true}, this.toggle);

    }

    render(){
        // console.log(this.props);
        const {classes}=this.props;
        return(
            <div>
            <Fab size="small" color="primary" aria-label="add" onClick={this.fetch}><Add/></Fab>
            {/* <Button onClick={()=>{this.fetch();}}>Import GoogleClassroom</Button> */}
            <Modal isOpen={this.state.open} toggle={this.toggle} size='lg'>
                <ModalHeader toggle={this.toggle}>Header</ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                            <tr>
                                <td>CLASS NAME</td>
                                <td>STH</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classes.data&&classes.data.map((item,i)=>(
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.ttt}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter style={{ alignItems: 'stretch'}}>
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    <Button color="primary" onClick={()=>{}}>Save</Button>
                </ModalFooter>
            </Modal>
            </div>
        )
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchClassroom: bindActionCreators(fetchClassroom, dispatch),
    }
}

export default compose(
    connect(store=>{
        return{
            uid: store.authReducer.uid,
            classes: store.classroomReducer
        }
    },mapDispatchToProps),
    withToastManager
)(ImportGC);