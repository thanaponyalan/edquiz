import MainLayout from "../containers/app/mainLayout";
import { Component, useState, useEffect } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { fetchClass } from "../redux/actions/classAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from "@material-ui/core";
import useTable from "../components/MaterialUI/useTable";
import { EditOutlined, Add } from "@material-ui/icons";
import Controls from "../components/MaterialUI/controls/Controls";
import Import from "../components/Class/Import";
import { withToastManager } from "react-toast-notifications";
import { API } from "../constant/ENV";
import { _error_handler } from "../utils/errorHandler";

const headCells=[
    {id:'_id', label: '#'},
    {id:'className', label: 'Class Name'},
    {id:'gClassName', label: 'Google Classroom'},
    {id:'courseName', label: 'Course'},
    {id:'stdAmount', label: 'Student Amount'},
    {id:'actions', label: 'Actions', disableSorting:true}
]

const ManageClass=(props)=>{
    const {classes}=props;
    const [records,setRecords]=useState(classes);
    const [filterFn,setFilterFn]=useState({fn:items=>{return items;}});
    const [openDialog,setOpenDialog]=useState(false);
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPaginatingAndSorting
    }=useTable(records,headCells,filterFn);
    
    const importClass=
        <li className="nav-item">
            <Controls.Fab
                onClick={()=>setOpenDialog(true)}>
                <Add/>
            </Controls.Fab>
        </li>;

    useEffect(() => {
        if(classes!=null){
            setRecords([
                ...classes
            ])
        }
    }, [classes])

    const importClasses=async(classes)=>{
        props.toastManager.add("Creating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/class`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(classes)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchClass(props.uid,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    return (
        <>
            <MainLayout title="Classes" pageActions={importClass}>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPaginatingAndSorting().map((item,i)=>{
                                item={...item,id: i+1}
                                return(
                                <TableRow key={item._id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.className}</TableCell>
                                    <TableCell>{item.gClassName}</TableCell>
                                    <TableCell>{item.courseId.courseName}</TableCell>
                                    <TableCell>{item.students.length}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={()=>console.log(item)}>
                                            <EditOutlined fontSize="small" />
                                        </Controls.ActionButton>
                                        {/* <Controls.ActionButton
                                        color="secondary">
                                            <CloseIcon fontSize="small"/>
                                        </Controls.ActionButton> */}
                                    </TableCell>
                                </TableRow>
                            )})
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </MainLayout>
            <Import importClasses={importClasses} openDialog={openDialog} setOpenDialog={setOpenDialog} title="Import From Google Classroom"/>
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchClass: bindActionCreators(fetchClass, dispatch)
    }
}

const mapStateToProps = state => {
    return {
        classes: state.classReducer.classes,
        uid: state.authReducer.uid
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withAuthSync,
    withToastManager
)(ManageClass);