import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'reactstrap'
import { bindActionCreators, compose } from 'redux'
import Class from '../components/Class'
import MainLayout from '../containers/app/mainLayout'
import { fetchClass } from '../redux/actions/classAction'
import { withAuthSync } from '../utils/auth'

function MyClass(props) {
    console.log(props)
    return (
            <MainLayout title="My Class" >
                <Row>
                    {
                        props.classes&&props.classes.map((item,i)=>
                        <Class className={item.className} courseNo={item.courseId.courseNo} key={i}/> 
                        )
                    }
                </Row>
            </MainLayout>
    )
}
const mapDispatchToProps = dispatch => {
    return{
        fetchClass: bindActionCreators(fetchClass, dispatch)
    }
}
const mapStateToProps = state => {
    return{
        classes: state.classReducer.classes
    }
}
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withAuthSync
)(MyClass)