import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import Question from "../components/Question";
import { connect } from "react-redux";
import { fetchQuestion } from "../redux/actions/questionAction";
import { bindActionCreators } from "redux";
import { Row } from "reactstrap";

const questionType=[
    "Multiple Choice",
    "Match",
    "True or False"
]

const Item=(props)=>{
console.log(props);
    return(
        <MainLayout title="Items">
            <Row>
                {
                    props.questions.length&&props.questions.map((item,i)=>
                        <Question isCollapse={i} key={i} type={questionType[item.questionDetail.type-1]} {...item}/>
                    )
                }
            </Row>
        </MainLayout>
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

const mapDispatchToProps=dispatch=>{
    return{
        fetchQuestion: bindActionCreators(fetchQuestion, dispatch),
    }
}

const mapStateToProps=state=>{
    return{
        questions: state.questionReducer.questions
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withAuthSync
)(Item);