import MainLayout from "../containers/app/mainLayout";
import { Component, useState, useEffect } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { fetchClass } from "../redux/actions/classAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Card, CardMedia, CardContent, Typography, CardActions, Grid, Button, IconButton, CardActionArea, CardHeader, Menu, MenuItem, Chip, Avatar } from "@material-ui/core";
import { EditOutlined, Add, ExpandMore, MoreVert, Label } from "@material-ui/icons";
import Controls from "../components/MaterialUI/controls/Controls";
import Import from "../components/Class/Import";
import { withToastManager } from "react-toast-notifications";
import { API } from "../constant/ENV";
import { _error_handler } from "../utils/errorHandler";
import Class from "../components/Class/EditClass"
import { fetchCourse } from "../redux/actions/courseAction";
import Loader from "react-loader-spinner";

const ManageClass=(props)=>{
    const [openDialog,setOpenDialog]=useState(false);
    
    const importClass=
        <li className="nav-item">
            <Controls.Fab
                onClick={()=>setOpenDialog(true)}
                title="Import Class">
                <Add/>
            </Controls.Fab>
        </li>;

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

    useEffect(()=>{
        if(!props.classes){
            props.fetchClass(props.uid,props.role)
        }
        if(!props.courses){
            props.fetchCourse(props.uid)
        }
    }, [])

    return (
        <>
            <MainLayout title="Classes" pageActions={importClass}>
                {props.classes&&props.courses?
                <Grid container spacing={3}>
                    {
                        props.classes.map((item,idx)=>
                            <Grid key={idx} item xs={12} sm={4} md={3}>
                                <Class thisClass={item} key={idx}/>
                            </Grid>
                        )
                    }
                    <Import importClasses={importClasses} openDialog={openDialog} setOpenDialog={setOpenDialog} title="Import From Google Classroom"/>
                </Grid>:
                <div
                    style={{
                        width: '100%',
                        height: '100',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Loader type="TailSpin" color="#2bad60" height="100" width="100"/>
                </div>
                }
            </MainLayout>
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchClass: bindActionCreators(fetchClass, dispatch),
        fetchCourse: bindActionCreators(fetchCourse, dispatch)
    }
}

const mapStateToProps = state => {
    return {
        classes: state.classReducer.classes,
        courses: state.courseReducer.courses
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withAuthSync,
    withToastManager
)(ManageClass);