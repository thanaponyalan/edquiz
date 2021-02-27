import MainLayout from "../containers/app/mainLayout";
import { Component } from 'react';
import { compose } from "recompose";
import { roleSelected, withAuthSync } from "../utils/auth";
import { withRouter } from "next/router";
import { Table } from 'reactstrap';
import AssignmentWidget from "../components/Assignment";

class Assignment extends Component{
    classAssignment=[
        {
            courseName: "Operating System",
            courseNo: "03376812",
            objectives:[
                { no:1, obj: "Can ...", bloomLevel: "1" },
                { no:2, obj: "Explain ...", bloomLevel: "2"}
            ]
        },{
            courseName: "Course 2",
            courseNo: "03300001",
            objectives:[
                { no:1, obj: "Can ...", bloomLevel: "1" },
                { no:2, obj: "Explain ...", bloomLevel: "2"}
            ]
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
    withAuthSync,
    roleSelected
)(Assignment);