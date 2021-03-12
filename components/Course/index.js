import ObjectiveTable from "../Objective/ObjectiveTable";
import {useState} from "react"
import CourseForm from '../Course/editCourse';
import { CardHeader, CardTitle, CardBody, Col } from "reactstrap";
import Modal from "../ReactStrap/Modal";
import Card from "../ReactStrap/Card"
import AddObjectiveForm from "../Objective/editObjective";
import { compose } from "recompose";
import { withToastManager } from "react-toast-notifications";
import { fetchCourse } from "../../redux/actions/courseAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { _error_handler } from "../../utils/errorHandler";
import { API } from "../../constant/ENV";

const CourseWidget = (props) => {
    // console.log("CourseWidget");
    // console.log(props);

    const [openModal,setOpenModal]=useState(false);
    const [recordForEdit,setRecordForEdit]=useState(null);
    const [openAddModal,setOpenAddModal]=useState(false);


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
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenModal(false));
                props.fetchCourse(res.data.payload.owner)
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }

    const openInPopup=item=>{
        setRecordForEdit(item);
        setOpenModal(true);
    }

    const insertObj=async(objective)=>{
        // console.log(`InsertObj`);
        // console.log(objective);
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
                props.toastManager.add("Created",{appearance:'success', autoDismiss:true},()=>setOpenAddModal(false))
                props.fetchCourse(props.uid)
            }
        }catch(err){
            _error_handler(props.toastManager,err,null);
            console.log(err);
        }
    }

    const addObjective=()=>{
        setOpenAddModal(true);
    }

    return (
        <>
            <Card
                isCollapse={props.isCollapse}
                title={`${props.courseDetail.courseName} (${props.courseDetail.courseNo})`}
                editable
                editInModal={()=>openInPopup(props.courseDetail)}
                addable
                addObjective={addObjective}>
                <ObjectiveTable initRecord={props.courseDetail.objectives} courseId={props.courseDetail._id}/>
            </Card>
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Edit Course">
                <CourseForm
                    recordForEdit={recordForEdit}
                    updateOrInsertCourse={updateCourse}
                    toggle={()=>setOpenModal(false)}/>
            </Modal>
            <Modal
                openModal={openAddModal}
                setOpenModal={setOpenAddModal}
                title="Add Objective">
                <AddObjectiveForm
                    updateOrInsertObj={insertObj}
                    toggle={()=>setOpenAddModal(false)}
                    courseId={props.courseDetail._id}/>
            </Modal>
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