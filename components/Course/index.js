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

const CourseWidget = (props) => {
    // console.log("CourseWidget");
    // console.log(props);

    const [openModal,setOpenModal]=useState(false);
    const [recordForEdit,setRecordForEdit]=useState(null);
    const [openAddModal,setOpenAddModal]=useState(false);


    const updateOrInsertCourse=async(course)=>{
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`http://localhost:3000/api/course`
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

    const addOrEditObj=()=>{
        console.log(`Add or Edit Obj`);
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
                    updateOrInsertCourse={updateOrInsertCourse}
                    toggle={()=>setOpenModal(false)}/>
            </Modal>
            <Modal
                openModal={openAddModal}
                setOpenModal={setOpenAddModal}
                title="Add Objective">
                <AddObjectiveForm
                    addOrEdit={addOrEditObj}
                    toggle={()=>setOpenAddModal(false)}/>
            </Modal>
        </>
    );
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchCourse: bindActionCreators(fetchCourse, dispatch),
    }
}

export default compose(
    withToastManager,
    connect(null,mapDispatchToProps)
)(CourseWidget);