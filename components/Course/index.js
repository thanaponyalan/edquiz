import ObjectiveTable from "../Objective/ObjectiveTable";
import {useState} from "react"
import CourseForm from '../Course/editCourse';
import ObjectiveForm from "../Objective/editObjective";
import { withToastManager } from "react-toast-notifications";
import { fetchCourse } from "../../redux/actions/courseAction";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { _error_handler } from "../../utils/errorHandler";
import { API } from "../../constant/ENV";
import { Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton } from "@material-ui/core";
import { Create, ExpandMore, PlaylistAdd } from "@material-ui/icons";
import Popup from "../MaterialUI/Popup";

const CourseWidget = (props) => {
    const [recordForEdit,setRecordForEdit]=useState(null);
    const {courseDetail, onClick}=props;
    const {course,isExpand}=courseDetail
    const [openEditCourse, setOpenEditCourse]=useState(false)
    const [openAddObj, setOpenAddObj]=useState(false)


    const updateCourse=async(course)=>{
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/course`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: course.owner
                },
                body: JSON.stringify(course)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenEditCourse(false));
                props.fetchCourse(res.data.payload.owner)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const insertObj=async(objective)=>{
        delete objective._id;
        props.toastManager.add("Creating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/objective`
            const result=await fetch(url,{
                method: 'POST',
                body: JSON.stringify(objective)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true},()=>setOpenAddObj(false))
                props.fetchCourse(props.uid)
            }
        }catch(err){
            _error_handler(props.toastManager,err,null);
            console.log(err);
        }
    }

    return (
        <>
            <Card>
                <CardHeader
                    title={`${course.courseName} (${course.courseNo})`}
                    style={{
                        backgroundColor: 'rgb(52, 58, 64)',
                        color: 'white'
                    }}
                    action={
                        <>
                        <IconButton style={{color: 'white'}} onClick={()=>setOpenAddObj(true)}>
                            <PlaylistAdd/>
                        </IconButton>
                        <IconButton style={{color: 'white'}} onClick={()=>{setRecordForEdit(course);setOpenEditCourse(true);}}>
                            <Create/>
                        </IconButton>
                        </>
                    }
                />
                <Collapse in={!isExpand}>
                    <CardActions>
                        <IconButton onClick={onClick} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                            <ExpandMore/>
                        </IconButton>
                    </CardActions>
                </Collapse>
                <Collapse in={isExpand}>
                    <CardContent>
                        <ObjectiveTable initRecord={course.objectives} courseId={course._id}/>
                    </CardContent>
                </Collapse>
            </Card>
            <CourseForm
                title="Edit Course"
                recordForEdit={recordForEdit}
                updateOrInsertCourse={updateCourse}
                toggle={()=>setOpenEditCourse(false)}
                openDialog={openEditCourse}
                setOpenDialog={setOpenEditCourse}
            />
            <ObjectiveForm
                title="Add Objective"
                updateOrInsertObj={insertObj}
                toggle={()=>setOpenAddObj(false)}
                courseId={course._id}
                openDialog={openAddObj}
                setOpenDialog={setOpenAddObj}
                />
        </>
    );
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchCourse: bindActionCreators(fetchCourse, dispatch),
    }
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
    }
}

export default compose(
    withToastManager,
    connect(mapStateToProps,mapDispatchToProps)
)(CourseWidget);