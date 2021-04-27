import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux'
import { fetchClassroom } from '../../redux/actions/classroomAction';
import Popup from '../MaterialUI/Popup';
import Controls from '../MaterialUI/controls/Controls'
import { Form, useForm } from '../MaterialUI/useForm';
import Loader from 'react-loader-spinner'
import { Button, Checkbox, Grid, Hidden } from '@material-ui/core';
import { fetchCourse } from '../../redux/actions/courseAction';
import { withToastManager } from 'react-toast-notifications';
import { _error_handler } from '../../utils/errorHandler';
import { API } from '../../constant/ENV';
import { fetchClass } from '../../redux/actions/classAction';

const Import=(props)=>{
    const {openDialog,title,setOpenDialog, googleClasses,courses,importClasses}=props;
    const [classes,setClasses]=useState([]);
    const [isFetched,setIsFetched]=useState(false)
    const [disabledSave,setDisabledSave]=useState(true);
    const handleClose=()=>{
        setOpenDialog(false);
        setClasses([])
        setIsFetched(false)
    }
    const handleSave=()=>{
        const insertingClasses=classes.filter(item=>item.selected).map(item=>({className: item.className, courseId: item.courseId, gClassId: item.gClassId, gClassName: item.gClassName, alternateLink: item.alternateLink}));
        if(insertingClasses.length){
            importClasses(insertingClasses)
        }
        handleClose();
    }
    
    if(openDialog&&!isFetched){
        props.fetchClassroom(props.uid);
        props.fetchCourse(props.uid);
    }
    useEffect(() => {
        if(googleClasses){
            setClasses(googleClasses.map((item)=>({selected: false, className:'', gClassId: item.id, gClassName: item.name, courseId: '', alternateLink: item.alternateLink})))
            setIsFetched(true);
        }
    }, [googleClasses])
    return (
        <Popup maxWidth="md" fullWidth={true} open={openDialog} handleClose={handleClose} handleSave={handleSave} title={title} disabledSave={disabledSave} popupAction={
            <>
                <Button disabled={disabledSave} variant="outlined" onClick={handleSave} color="primary">Submit</Button>
                {' '}
                <Button onClick={handleClose} variant="outlined" color="secondary">Cancel</Button>
            </>
        }>
                {
                    classes.length>0&&courses&&classes.map((item,idx)=>
                        <Form key={idx}><ClassInput key={idx} courses={courses} recordForEdit={item} idx={idx} setClasses={setClasses} classes={classes} setDisabledSave={setDisabledSave} /></Form>
                    )
                }
            {
                (classes.length==0&&!isFetched)?
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
                    </div>:
                    (classes.length==0&&isFetched)?
                    <div
                        style={{
                            width: '100%',
                            height: '100',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        NOT FOUND
                    </div>:''
            }
        </Popup>
    )
}

const initialValues={
    selected: false,
    className: '',
    courseId: '',
    gClassId: '',
    gClassName: '',
    alternateLink: ''
}

const ClassInput=(props)=>{
    const {recordForEdit,idx,setClasses,classes,courses,setDisabledSave}=props;
    const mappedCourses=courses.map((item)=>({id: item._id, title: `${item.courseName} (${item.courseNo})`}))

    const validate=(fieldValues=values)=>{
        let temp={...errors}
        if('courseId' in fieldValues)
            temp.courseId=fieldValues.courseId?"":"This field is required"        
        if('className' in fieldValues)
            temp.className=fieldValues.className?"":"This field is required"
        setErrors({
            ...temp
        })
        if(fieldValues==values)
            return Object.values(temp).every(x=>x=="");
    }

    const{
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    }=useForm(initialValues,true,validate)
    

    useEffect(() => {
        if(recordForEdit!=null){
            setValues({
                ...recordForEdit
            })
        }
    }, [recordForEdit])

    useEffect(()=>{
        if(values.selected){
            if(validate())setDisabledSave(false);
            else setDisabledSave(true);
        }else{
            setErrors({})
            setDisabledSave(true)
        }
    },[values])

    return(
        <Grid container spacing={2}>
            <Grid item md={1} sm={1}>
                <Checkbox
                    name="selected"
                    checked={values.selected}
                    onChange={(e)=>{
                        setValues({
                            ...values,
                            selected: e.target.checked
                        })
                        let items=[...classes]
                        let item={...items[idx],selected: e.target.checked}
                        items[idx]=item;
                        setClasses(items);
                    }}
                />
            </Grid>
            <Grid item md={4} sm={4}>
                <Controls.Input
                    label="Class Name"
                    name="className"
                    value={values.className}
                    onChange={(e)=>{
                        handleInputChange(e);
                        let items=[...classes]
                        let item={...items[idx],className: e.target.value, selected: e.target.value!=''?true:items[idx].selected}
                        items[idx]=item;
                        setClasses(items)
                    }}
                    error={errors.className}
                />
            </Grid>
            <Hidden only={['xs','sm','md','lg','xl']}>
                <Controls.Input
                    type="hidden"
                    name="gClassId"
                    value={values.gClassId}
                />
            </Hidden>
            <Grid item md={4} sm={4}>
                <Controls.Input
                    label="Google Classroom Name"
                    name="gClassName"
                    value={values.gClassName}
                    disabled
                />
            </Grid>
            <Grid item md={3} sm={3}>
                <Controls.Select
                    name="courseId"
                    label="Course"
                    value={values.courseId}
                    onChange={(e)=>{
                        handleInputChange(e)
                        let items=[...classes]
                        let item={...items[idx],courseId: e.target.value, selected: e.target.value!=''?true:items[idx].selected}
                        items[idx]=item;
                        setClasses(items);
                    }}
                    options={mappedCourses}
                    error={errors.courseId}
                />
            </Grid>
        </Grid>
    )
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
        googleClasses: state.classroomReducer.data,
        courses: state.courseReducer.courses
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchClassroom: bindActionCreators(fetchClassroom, dispatch),
        fetchCourse: bindActionCreators(fetchCourse, dispatch),
        fetchClass: bindActionCreators(fetchClass,dispatch)
    }
}

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withToastManager
)(Import);