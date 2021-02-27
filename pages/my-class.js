import { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { setProfile } from "../redux/actions/profileAction";
import { bindActionCreators } from 'redux'
import { withAuthSync, roleSelected } from '../utils/auth'
import MainLayout from "../containers/app/mainLayout";
import Class from "../components/Class";
import ImportGC from "../components/Class/importGC";
import { Row } from "reactstrap";


const addClass=
    <li className="nav-item">
        <ImportGC/>
    </li>

class MyClass extends Component{
    classes=[
        {
            className: "Operating System Section 1",
            courseNo: "03376812"
        },
        {
            className: "Operating System Section 2",
            courseNo: "03376812"
        },
        {
            className: "Operating System Section 3",
            courseNo: "03376812"
        },
        {
            className: "Operating System Section 4",
            courseNo: "03376812"
        }
    ];
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props);
        return(
            <MainLayout title="My Classes" pageActions={addClass}>
                <Row>
                    { 
                        this.classes&&this.classes.map((item,i)=>
                            <Class className={item.className} courseNo={item.courseNo} key={i} />
                        )
                    }
                </Row>
            </MainLayout>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setProfile: bindActionCreators(setProfile,dispatch),
        // setRole: bindActionCreators(setRole,dispatch)
    }
}

const mapStateToProps=(state)=>{
    return{
        profile: state.profileReducer
    }
}

export default compose(
    // connect(mapStateToProps,mapDispatchToProps),
    withAuthSync,
    roleSelected
)(MyClass)