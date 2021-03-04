import React,{useState} from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from "@material-ui/core";
import CourseForm from '../Course/editCourse';
import useTable from "../MaterialUI/useTable";
import Controls from "../MaterialUI/controls/Controls";
import { Search, Add as AddIcon, EditOutlined, Close as CloseIcon } from '@material-ui/icons';
import Modal from "../ReactStrap/Modal";
import Popup from "../MaterialUI/Popup"
import EditObjectiveForm from "../Objective/editObjective"
import courseForm from '../Course/editCourse';


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
    {id:'_id', label: '#'},
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

export default function ObjectiveTable(props) {
    const {initRecord, courseId}=props;
    const classes=useStyles();
    const [records,setRecords]=useState(initRecord);
    const [filterFn,setFilterFn]=useState({fn:items=>{return items;}});
    const [openModal,setOpenModal]=useState(false);
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

    const addOrEdit=(course)=>{
        // insert
        console.log("addOrEdit");
        console.log(course);

    }

    const openInModal=item=>{
        setRecordForEdit(item);
        setOpenModal(true);
    }
    
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
                {/* <Controls.Button
                    text="Add New"
                    variant="outlined"
                    startIcon={<AddIcon/>}
                    onClick={()=>setOpenPopup(true)}
                /> */}
            </Toolbar>
            <TblContainer>
                <TblHead/>
                <TableBody>
                    {
                        recordsAfterPaginatingAndSorting().map(item=>(
                            <TableRow key={item._id}>
                                <TableCell>{item._id}</TableCell>
                                <TableCell>{item.objective}</TableCell>
                                <TableCell>{bloom[item.bloomLevel-1].title}</TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                        color="primary"
                                        onClick={()=>openInModal(item)}>
                                        <EditOutlined fontSize="small" />
                                    </Controls.ActionButton>
                                    {/* <Controls.ActionButton
                                    color="secondary">
                                        <CloseIcon fontSize="small"/>
                                    </Controls.ActionButton> */}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </TblContainer>
            <TblPagination/>
            <Modal
                openModal={openModal}
                setOpenModal={setOpenModal}
                title="Edit Objective">
                <EditObjectiveForm
                    courseId={courseId}
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                    toggle={()=>setOpenModal(false)}/>
            </Modal>
        </>
    )
}
