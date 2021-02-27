import ObjectiveTable from "../Objective/ObjectiveTable";
import {useState} from "react"
import CourseForm from '../Course/editCourse';
import { CardHeader, CardTitle, CardBody, Col } from "reactstrap";
import Modal from "../ReactStrap/Modal";
import Card from "../ReactStrap/Card"
import AddObjectiveForm from "../Objective/editObjective";

const CourseWidget = (props) => {
    // console.log("CourseWidget");
    // console.log(props);

    const [openModal,setOpenModal]=useState(false);
    const [recordForEdit,setRecordForEdit]=useState(null);
    const [openAddModal,setOpenAddModal]=useState(false);


    const addOrEdit=(course)=>{
        // insert
        console.log("addOrEdit");
        console.log(course);
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
                    addOrEdit={addOrEdit}
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

export default CourseWidget;