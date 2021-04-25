import React, { useEffect } from 'react'
import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "redux";
import Popup from "../MaterialUI/Popup";
import { _error_handler } from "../../utils/errorHandler";
import { bindActionCreators } from "redux";
import { makeStyles, Card, CardContent, CardActions,  Button, CardHeader, Menu, MenuItem, Chip, Avatar } from "@material-ui/core";
import { fetchClass } from "../../redux/actions/classAction";
import { useState } from "react";
import { Class, MoreVert } from "@material-ui/icons";
import moment from "moment";
import DoAssignment from './DoAssignment';
import Insight from './insight';
import { fetchHistory } from '../../redux/actions/historyAction';
import { fetchAssignment } from '../../redux/actions/assignmentAction';

const useStyle=makeStyles({
    root:{
        maxWidth: '100%'
    },
    media:{
        height: 140
    },
    action:{
        marginTop: 'auto',
        marginBottom: 'auto'
    }
})

const AssignmentWidget=(props)=>{
    const [variant,setVariant]=useState("outlined")
    const [anchorEl,setAnchorEl]=useState(null);
    const [openDialog,setOpenDialog]=useState(false);

    const styleClasses=useStyle();
    const {assignment,role,history}=props;
    
    const handleClose=()=>{
        props.fetchAssignment(props.uid, props.role)
        setOpenDialog(false)
    }
    const [thisAssignee,setThisAssignee]=useState({})
    const [isDone,setIsDone]=useState(false)
    const [graded, setGraded]=useState(false)
    const [inProgress,setInProgress]=useState(false)
    const [score, setScore]=useState(0)
    const [totalScore, setTotalScore]=useState(0)

    if(role=='student'){
        useEffect(()=>{
            setThisAssignee(assignment.assignees.filter(item=>item.studentId==props.uid)[0])
        },[assignment])

        useEffect(()=>{
            setIsDone(thisAssignee?.status==='done')
            if(thisAssignee?.status==='in-progress'){
                setInProgress(true)
                props.fetchHistory(props.uid,assignment._id,props.toastManager)
            }
            if(thisAssignee?.status==='graded'){
                setGraded(true)
                setScore(thisAssignee.score)
                setTotalScore(thisAssignee.totalScore)
            }
        },[thisAssignee])
    }
    
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
                        graded&&
                        <Chip size="medium" style={{margin: 'auto'}} label={`${score}/${totalScore}`}/>
                    }
                    classes={{action: styleClasses.action}}
                    // action={
                    //     role==='teacher'&&
                    //         <IconButton aria-controls="assignmentMenus" onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
                    //             <MoreVert style={{color: 'white'}}/>
                    //         </IconButton>
                    // }
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
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>Insight</Button>
                            <Popup fullScreen={true} open={openDialog} handleClose={handleClose} title='Insight'>
                                <Insight assignment={assignment} quizId={assignment.quizId._id} setOpenDialog={setOpenDialog}/>
                            </Popup>
                        </>
                    }
                    {
                        role==='student'&&!isDone&&!graded&&
                        <>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={()=>setOpenDialog(true)}>{!inProgress?`start this assignment`:'continue this assignment'}</Button>
                            <Popup fullScreen={true} open={openDialog} handleClose={handleClose} title={assignment.quizId.quizName}>
                                <DoAssignment quizId={assignment.quizId._id} assignmentId={assignment._id} questionId={assignment.quizId.questionId} setOpenDialog={setOpenDialog}/>
                            </Popup>
                        </>
                    }
                    {
                        role==='student'&&(isDone||graded)&&
                        <>
                            <Button style={{marginLeft: 'auto', marginRight: 'auto'}} disabled>You've Done This Assignment</Button>
                            <div style={{width: '100%'}}></div>
                            <Chip style={{marginLeft: 'auto', marginRight: 'auto'}} label={`ON ${moment(thisAssignee.lastUpdate).format('LLL')}`}/>
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
        </>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        fetchClass: bindActionCreators(fetchClass, dispatch),
        fetchHistory: bindActionCreators(fetchHistory, dispatch),
        fetchAssignment: bindActionCreators(fetchAssignment, dispatch)
    }
}

const mapStateToProps = state => {
    return {
        uid: state.authReducer.uid,
        role: state.authReducer.role,
        classes: state.classReducer.classes,
        history: state.historyReducer.history
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(AssignmentWidget)

