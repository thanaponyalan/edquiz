import React from 'react'
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "redux";
import Popup from "../MaterialUI/Popup";
import { _error_handler } from "../../utils/errorHandler";
import { bindActionCreators } from "redux";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Card, CardMedia, CardContent, Typography, CardActions, Grid, Button, IconButton, CardActionArea, CardHeader, Menu, MenuItem, Chip, Avatar } from "@material-ui/core";
import { fetchClass } from "../../redux/actions/classAction";
import { useState } from "react";
import { Class, MoreVert } from "@material-ui/icons";
import { API } from "../../constant/ENV";
import AssignPopup from '../Assignment/assignPopup';
import moment from "moment";

const useStyle=makeStyles({
    root:{
        maxWidth: 345
    },
    media:{
        height: 140
    }
})

const TestWidget=(props)=>{
    const [variant,setVariant]=useState("outlined")
    const [anchorEl,setAnchorEl]=useState(null);
    const [openDialog,setOpenDialog]=useState(false);

    const styleClasses=useStyle();
    const {test,classes}=props;
    
    const handleClose=()=>{
        setOpenDialog(false)
    }
    const updateClass=async(thisClass)=>{
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/class`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(thisClass)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchClass(props.uid,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    const handleSave=async(data)=>{
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/assignment`
            const result=await fetch(url,{
                method: 'POST',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(data)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
                props.fetchClass(props.uid,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    return(
        <>
            <Card className={styleClasses.root} variant={variant} onMouseEnter={()=>{setVariant("elevation")}} onMouseLeave={()=>{setVariant('outlined')}} style={{cursor: "pointer"}}>
                <CardHeader
                    title={test.quizName}
                    subheader={
                        <Chip size="small" avatar={<Avatar><Class/></Avatar>}
                            label={test.courseId.courseName}
                        />
                    }
                    action={
                        <IconButton aria-controls="testMenus" onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
                            <MoreVert style={{color: 'white'}}/>
                        </IconButton>
                    }
                    style={{
                        backgroundColor: 'black',
                        color: 'white'
                    }}
                />
                <CardContent>
                    <Typography gutterBottom variant="body2">
                        <label>Items Amount :</label>
                        {` ${test.questionId.length}`}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>assign</Button>
                    <Button style={{marginLeft: 'auto', marginRight: 'auto'}}>show items</Button>
                </CardActions>
            </Card>
            <Menu
                id="testMenus"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>{
                    setAnchorEl(null)
                }}
            >
                <MenuItem>Edit</MenuItem>
            </Menu>
            <Popup maxWidth="sm" fullWidth={true} open={openDialog} handleClose={handleClose} title="Assign Test">
                {
                    <AssignPopup setOpenDialog={setOpenDialog} recordForEdit={{quizName: test.quizName, quizId: test._id, classId: '', dueDate: moment(new Date()).format()}} classes={classes.map((item)=>({id: item._id, title: item.className}))} handleClose={handleClose} handleSave={handleSave} />
                }
            </Popup>
            {/* <Popup maxWidth="sm" fullWidth={true} open={openDialog} handleClose={handleClose} title="Edit Class">
                {
                    <EditClassForm recordForEdit={{...thisClass, courseId: thisClass.courseId._id}} courses={courses.map((item)=>({id: item._id, title: item.courseName}))} handleClose={handleClose} handleSave={handleSave} />
                }
            </Popup> */}
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
        uid: state.authReducer.uid,
        classes: state.classReducer.classes
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(TestWidget)
