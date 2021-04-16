import { connect } from "react-redux";
import { withToastManager } from "react-toast-notifications";
import { compose } from "redux";
import EditClassForm from "./editClassForm";
import Popup from "../MaterialUI/Popup";
import { _error_handler } from "../../utils/errorHandler";
import { bindActionCreators } from "redux";
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Card, CardMedia, CardContent, Typography, CardActions, Grid, Button, IconButton, CardActionArea, CardHeader, Menu, MenuItem, Chip, Avatar } from "@material-ui/core";
import { fetchClass } from "../../redux/actions/classAction";
import { useState } from "react";
import { MoreVert } from "@material-ui/icons";
import { API } from "../../constant/ENV";

const useStyle=makeStyles({
    root:{
        maxWidth: 345
    },
    media:{
        height: 140
    }
})
const Class=(props)=>{
    const [variant,setVariant]=useState("outlined")
    const [anchorEl,setAnchorEl]=useState(null);
    const [openDialog,setOpenDialog]=useState(false);

    const classes=useStyle();
    const {thisClass, courses}=props;
    
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
                props.fetchClass(props.uid,props.role,props.toastManager)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    const handleSave=(data)=>{
        delete data.students;
        delete data.__v;
        delete data.gClassId;
        delete data.gClassName;
        updateClass(data);
    }
    return(
        <>
            <Card className={classes.root} variant={variant} onMouseEnter={()=>{setVariant("elevation")}} onMouseLeave={()=>{setVariant('outlined')}} style={{cursor: "pointer"}}>
                <CardHeader
                    title={thisClass.className}
                    subheader={
                        <Chip onClick={()=>{if(thisClass.alternateLink)window.open(thisClass.alternateLink,'_blank')}} size="small" avatar={<Avatar>GC</Avatar>}
                            label={thisClass.gClassName}
                        />
                    }
                    action={
                        <IconButton aria-controls="classMgrMenus" onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
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
                        <label>Course :</label>
                        {` ${thisClass.courseId.courseName}`}
                    </Typography>
                    <Typography gutterBottom variant="body2">
                        <label>Student Amount :</label>
                        {` ${thisClass.students.length}`}
                    </Typography>
                </CardContent>
            </Card>
            <Menu
                id="classMgrMenus"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>{
                    setAnchorEl(null)
                }}
            >
                <MenuItem onClick={()=>{setOpenDialog(true); setAnchorEl(null)}}>Edit</MenuItem>
            </Menu>
            <Popup maxWidth="sm" fullWidth={true} open={openDialog} handleClose={handleClose} title="Edit Class">
                {
                    <EditClassForm recordForEdit={{...thisClass, courseId: thisClass.courseId._id}} courses={courses.map((item)=>({id: item._id, title: item.courseName}))} handleClose={handleClose} handleSave={handleSave} />
                }
            </Popup>
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
        uid: state.authReducer.uid,
        courses: state.courseReducer.courses,
        role: state.authReducer.role
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(Class)