import React from 'react'
import { Button, makeStyles } from '@material-ui/core'

const useStyles=makeStyles(theme=>({
    root:{
        minWidth: 0,
        margin: theme.spacing(0.5)
    },
    secondary:{
        backgroundColor: '#f4b5cd',//theme.palette.secondary.light,
        '&:hover':{
            backgroundColor: '#ffd5e3'
        },
        '& .MuiButton-label':{
            color: theme.palette.secondary.main
        },
        
    },
    primary:{
        backgroundColor: '#a7b5ff',//theme.palette.primary.light,
        '&:hover':{
            backgroundColor: '#e2e6ff'
        },
        '& .MuiButton-label':{
            color: theme.palette.primary.main
        },
    }
}))

export default function ActionButton(props) {
    const {color, children, onClick}=props;
    const classes=useStyles();
    return (
        <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}>
            {children}
        </Button>
    )
}
