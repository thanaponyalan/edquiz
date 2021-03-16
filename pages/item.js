import MainLayout from "../containers/app/mainLayout";
import { Component, useState } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import Question from "../components/Question";
import { connect } from "react-redux";
import { fetchQuestion } from "../redux/actions/questionAction";
import { bindActionCreators } from "redux";
import { Modal, Row } from "reactstrap";
import Controls from "../components/MaterialUI/controls/Controls";
import { Add } from "@material-ui/icons";
import Popup from "../components/MaterialUI/Popup";
import AddQuestion from "../components/Question/AddQuestion";

const questionType = [
    "Multiple Choice",
    "Match",
    "True or False"
]



const Item = (props) => {
    const [openDialog, setOpenDialog] = useState(false);
    console.log(props);

    const addItem =
        <li className="nav-item">
            <Controls.Fab
                onClick={() => setOpenDialog(true)}>
                <Add />
            </Controls.Fab>
        </li>;


    return (
        <>
            <MainLayout title="Items" pageActions={addItem}>
                <Row>
                    {
                        props.questions.length && props.questions.map((item, i) =>
                            <Question isCollapse={i} key={i} type={questionType[item.question.type - 1]} {...item} />
                        )
                    }
                </Row>
            </MainLayout>

                <AddQuestion openDialog={openDialog} setOpenDialog={setOpenDialog} title="Add Item" />
        </>
    )
}

// class Item extends Component{
//     render(){
//         console.log('Item');
//         console.log(this.props);
//         return(
//             <MainLayout title="Items">
//                 {
//                     this.props.
//                 }
//                 <Question id={1} type="Multiple Choice" question="What is the main purpose of exams?" params="Params: a=1, b=0.5, c=-1"/>
//                 <Question id={1} type="Multiple Choice" question="What is the main purpose of exams?" params="Params: a=1, b=0.5, c=-1"/>
//             </MainLayout>
//         )
//     }
// }

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
    }
}

const mapStateToProps = state => {
    return {
        questions: state.questionReducer.questions
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withAuthSync
)(Item);