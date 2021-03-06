import React,{useEffect, useState} from 'react'
import { makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from "@material-ui/core";
import useTable from "../MaterialUI/useTable";
import Controls from "../MaterialUI/controls/Controls";
import { Search, EditOutlined } from '@material-ui/icons';
import EditObjectiveForm from "../Objective/editObjective"
import { compose, bindActionCreators } from 'redux';
import { withToastManager } from 'react-toast-notifications';
import { connect } from 'react-redux';
import { fetchCourse } from '../../redux/actions/courseAction';
import { _error_handler } from '../../utils/errorHandler';
import { API } from "../../constant/ENV";


const useStyles=makeStyles(theme=>({
    pageContent:{
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput:{
        width: '100%'
    }
}))

const headCells=[
    {id:'id', label: '#'},
    {id:'objective', label: 'objective'},
    {id:'bloomLevel', label: 'bloomLevel'},
    {id:'actions', label: 'Actions', disableSorting:true}
]

const bloom=[
    {id: 1, title: 'Remember'},
    {id: 2, title: 'Understand'},
    {id: 3, title: 'Apply'},
    {id: 4, title: 'Analyze'},
    {id: 5, title: 'Evaluate'},
    {id: 6, title: 'Create'}
]

function ObjectiveTable(props) {
    const {initRecord, courseId}=props;
    const classes=useStyles();
    const [records,setRecords]=useState(initRecord.map((obj,idx)=>({...obj, id:idx+1})));
    const [filterFn,setFilterFn]=useState({fn:items=>{return items;}});
    const [openDialog,setOpenDialog]=useState(false);
    const [recordForEdit,setRecordForEdit]=useState(null);

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPaginatingAndSorting
    }=useTable(records,headCells,filterFn);
    
    const handleSearch=e=>{
        let target=e.target;
        setFilterFn({
            fn: items=>{
                if(target.value=='')return items;
                else return items.filter(x=>x.objective.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const updateObjective=async(objective)=>{
        props.toastManager.add("Updating...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/objective`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: props.uid
                },
                body: JSON.stringify(objective)
            });
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.fetchCourse(props.uid)
                props.toastManager.add("Updated",{appearance:'success', autoDismiss:true}, ()=>setOpenDialog(false));
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }

    }

    const openInDialog=item=>{
        setRecordForEdit(item);
        setOpenDialog(true);
    }

    useEffect(()=>{
        if(props.courses)
            setRecords(props.courses.find(({_id})=>_id==props.courseId).objectives.map((obj,idx)=>({...obj, id: idx+1})))
    },[props.courses])
    
    return (
        <>
            <Toolbar>
                <Controls.Input 
                    label="Search for objectives"
                    className={classes.searchInput}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start">
                            <Search/> 
                        </InputAdornment>)
                    }}
                    onChange={handleSearch}
                />
            </Toolbar>
            <TblContainer>
                <TblHead/>
                <TableBody>
                    {
                        recordsAfterPaginatingAndSorting().map((item,i)=>{
                            return(
                            <TableRow key={item._id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.objective}</TableCell>
                                <TableCell>{bloom[item.bloomLevel-1].title}</TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                        color="primary"
                                        onClick={()=>openInDialog(item)}>
                                        <EditOutlined fontSize="small" />
                                    </Controls.ActionButton>
                                </TableCell>
                            </TableRow>
                        )})
                    }
                </TableBody>
            </TblContainer>
            <TblPagination/>
            <EditObjectiveForm
                title="Edit Objective"
                courseId={courseId}
                recordForEdit={recordForEdit}
                updateOrInsertObj={updateObjective}
                toggle={()=>setOpenDialog(false)}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}/>
        </>
    )
}

const mapDispatchToProps=dispatch=>{
    return{
        fetchCourse: bindActionCreators(fetchCourse, dispatch),
    }
}

const mapStateToProps=state=>{
    return{
        uid: state.authReducer.uid,
        courses: state.courseReducer.courses
    }
}

export default compose(
    withToastManager,
    connect(mapStateToProps,mapDispatchToProps)
)(ObjectiveTable)
