// import { Card, Row, Col, CardTitle, Badge, Button } from "reactstrap";

import { FormControlLabel, FormControl, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import { Label } from "@material-ui/icons";
import { useState } from "react";
import Card from "../ReactStrap/Card";
import Modal from "../ReactStrap/Modal";
import QuestionDetail from "./questionDetail";

// const Question=(props)=>{
//     const {params}=props;
//     const paramsStr=`Params: a=${params.a}, b=${params.b}, c=${params.c}`;
//     return(
//         <Col md={12}>
//             <Card body>
//                 <Row>
//                     <Col sm={9}>
//                         <CardTitle>{props.question}</CardTitle>
//                     </Col>
//                     <Col sm={3}>
//                         <div className="float-right">
//                             <Button outline className=""><i className="fas fa-eye"></i>   View</Button>
//                             {' '}
//                             <Button outline className="">+</Button>
//                         </div>
//                     </Col>

//                 </Row>
//                 <Row>
//                     <Col sm={9}>
//                         <Badge>{props.type}</Badge>
//                         {' '}
//                         <Badge color="dark">{paramsStr}</Badge>
//                     </Col>
//                 </Row>
//             </Card>
//         </Col>
//     )
// }

const QuestionWidget=(props)=>{
    const [openModal,setOpenModal]=useState(false);
    const {isCollapse, question}=props;
    
    return(
        <>
            <Card 
                isCollapse={isCollapse}
                title={question.title}
                viewable
                viewInModal={()=>setOpenModal(true)}
                >
            </Card>
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Preview">
                    <QuestionDetail {...props} toggle={()=>setOpenModal(false)} recordForEdit={{question: question.title, choice: ""}}/>
            </Modal>
        </>
    )
}

export default QuestionWidget;