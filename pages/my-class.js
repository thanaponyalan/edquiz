import { Grid } from '@material-ui/core'
import React, { useEffect } from 'react'
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'
import { Row } from 'reactstrap'
import { bindActionCreators, compose } from 'redux'
import Class from '../components/Class'
import MainLayout from '../containers/app/mainLayout'
import { fetchClass } from '../redux/actions/classAction'
import { withAuthSync } from '../utils/auth'

function MyClass(props) {
    
    useEffect(()=>{
        if(!props.classes){
            props.fetchClass(props.uid,props.role)
        }
    },[])

    return (
            <MainLayout title="My Classes" >
                {props.classes?
                <Grid container spacing={2}>
                    {
                        props.classes&&props.classes.map((item,i)=>
                        <Class className={item.className} courseNo={item.courseId.courseNo} key={i}/> 
                        )
                    }
                </Grid>:
                <div
                    style={{
                        width: '100%',
                        height: '100',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Loader type="TailSpin" color="#2bad60" height="100" width="100"/>
                </div>
                }
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