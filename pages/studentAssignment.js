import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { Table } from 'reactstrap';
import AssignmentWidget from "../components/Assignment/StudentAssignment";

class Assignment extends Component{
    classAssignment=[
        {
            courseName: "Operating System",
            courseNo: "03376812",
                    },{
            courseName: "Course 2",
            courseNo: "03300001",
          }
    ]
    render(){
        console.log('Assignment');
        console.log(this.props);
        return(
            <MainLayout title="Assignments">
                {
                    this.classAssignment&&this.classAssignment.map((item,i)=>
                        <AssignmentWidget key={i} courseDetail={item} isCollapse={i}/>
                    )
                }
            </MainLayout>
        )
    }
}

export default compose(
    withAuthSync
)(Assignment);