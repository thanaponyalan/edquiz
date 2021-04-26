import React from 'react'
import { Button, makeStyles } from '@material-ui/core'

const useStyles=makeStyles(theme=>({
    root:{
        minWidth: 0,
        margin: theme.spacing(0.5)
    },
    primary:{
        backgroundColor: 'rgb(52, 58, 64)',
        '&:hover':{
            backgroundColor: 'rgba(52, 58, 64, 0.6)'
        },
        '& .MuiButton-label':{
            color: 'white',
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
