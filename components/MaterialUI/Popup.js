import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, AppBar, IconButton, Button, Toolbar } from "@material-ui/core";
import Controls from "../MaterialUI/controls/Controls";
import { Close as CloseIcon } from '@material-ui/icons';


const useStyles=makeStyles(theme=>({
    dialogWrapper:{
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle:{
        paddingRight: '0px'
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}))

export default function Popup(props) {
    const {title, children, open, handleClose, fullScreen, handleSave}=props;
    const classes=useStyles();
    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    {
                        handleSave&&
                        <Button color="inherit" onClick={handleSave}>
                            save
                        </Button>

                    }
                </Toolbar>
            </AppBar>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
