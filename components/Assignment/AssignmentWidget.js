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
import DoAssignment from './DoAssignment';

const useStyle=makeStyles({
    root:{
        maxWidth: '100%'
    },
    media:{
        height: 140
    }
})

const AssignmentWidget=(props)=>{
    const [variant,setVariant]=useState("outlined")
    const [anchorEl,setAnchorEl]=useState(null);
    const [openDialog,setOpenDialog]=useState(false);

    const styleClasses=useStyle();
    const {assignment,role}=props;
    
    const handleClose=()=>{
        setOpenDialog(false)
    }

    const handleSave=async(data)=>{
        // props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        // try{
        //     const url=`${API}/assignment`
        //     const result=await fetch(url,{
        //         method: 'POST',
        //         headers:{
        //             authorization: props.uid
        //         },
        //         body: JSON.stringify(data)
        //     })
        //     const res=await result.json();
        //     if(res.statusCode==200||res.statusCode==204){
        //         props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
        //         props.fetchClass(props.uid,props.toastManager)
        //     }
        // }catch(err){
        //     _error_handler(null,err,null);
        //     console.log(err);
        // }
        console.log(data);
    }

    const thisAssignee=assignment.assignees.filter(item=>item.studentId==props.uid)
    const isDone=thisAssignee[0].status==='done';

    return(
        <>
            <Card className={styleClasses.root} variant={variant} onMouseEnter={()=>{setVariant("elevation")}} onMouseLeave={()=>{setVariant('outlined')}}>
                <CardHeader
                    title={assignment.quizId.quizName}
                    subheader={
                        <Chip size="small" avatar={<Avatar><Class/></Avatar>}
                            label={assignment.classId.className}
                        />
                    }
                    action={
                        role==='teacher'&&
                            <IconButton aria-controls="assignmentMenus" onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
                                <MoreVert style={{color: 'white'}}/>
                            </IconButton>
                    }
                    style={{
                        backgroundColor: 'black',
                        color: 'white'
                    }}
                />
                <CardContent>
                    <div>
                        <label>Assigned Date :</label><br/>
                        <Chip label={moment(assignment.assignedDate).format('LLL')}/>
                    </div>
                    <div>
                        <label>Due Date :</label><br/>
                        <Chip label={moment(assignment.dueDate).format('LLL')}/>
                    </div>
                </CardContent>
                <CardActions style={{flexWrap: 'wrap'}}>
                    {
                        role==='teacher'&&
                        <>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>assign</Button>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}}>show items</Button>
                        </>
                    }
                    {
                        role==='student'&&!isDone&&
                        <>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>start this assignment</Button>
                            <Popup fullScreen={true} open={openDialog} handleClose={handleClose} title="Assign Test">
                                <DoAssignment quizId={assignment.quizId._id} assignmentId={assignment._id} setOpenDialog={setOpenDialog}/>
                            </Popup>
                        </>
                    }
                    {
                        role==='student'&&isDone&&
                        <>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} disabled>You've Done This Assignment</Button>
                            <div style={{width: '100%'}}></div>
                            <Chip style={{marginLeft: 'auto', marginRight: 'auto'}} label={`ON ${moment(thisAssignee[0].lastUpdate).format('LLL')}`}/>
                        </> 
                    }
                </CardActions>
            </Card>
            {
                role==='teacher'&&
                    <Menu
                        id="assignmentMenus"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={()=>{
                            setAnchorEl(null)
                        }}
                    >
                        <MenuItem>Edit</MenuItem>
                    </Menu>
            }
            {/* <Popup maxWidth="sm" fullWidth={true} open={openDialog} handleClose={handleClose} title="Assign Test">
                {
                    <AssignPopup setOpenDialog={setOpenDialog} recordForEdit={{quizName: test.quizName, quizId: test._id, classId: '', dueDate: moment(new Date()).format()}} classes={classes.map((item)=>({id: item._id, title: item.className}))} handleClose={handleClose} handleSave={handleSave} />
                }
            </Popup> */}
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
        role: state.authReducer.role,
        classes: state.classReducer.classes
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(AssignmentWidget)

