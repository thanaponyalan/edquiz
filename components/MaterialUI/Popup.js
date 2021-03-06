import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, AppBar, IconButton, Button, Toolbar, DialogActions } from "@material-ui/core";
import Controls from "../MaterialUI/controls/Controls";
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';


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
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
}))

export default function Popup(props) {
    const {title, children, open, handleClose, fullScreen, handleSave, checkAnswer, toggleEdit, maxWidth, fullWidth, disabledSave=false, bgColor, popupAction, scroll}=props;
    const classes=useStyles();
    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth={fullWidth} scroll={scroll}>
            {fullScreen?
            <AppBar className={classes.appBar}>
                <Toolbar style={{backgroundColor: bgColor}}>
                    {
                        handleClose&&
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    }
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    {
                        handleSave&&
                        <Button disabled={disabledSave} color="inherit" onClick={handleSave}>
                            save
                        </Button>
                    }
                    {
                        checkAnswer&&
                        <>
                            <Button color="inherit" onClick={checkAnswer}>
                                Check Answer
                            </Button>
                            <IconButton color="inherit" aria-label="edit" onClick={toggleEdit}>
                                <EditIcon/>
                            </IconButton>
                        </>
                    }
                    {
                        popupAction&&popupAction
                    }
                </Toolbar>
            </AppBar>
            :
            <DialogTitle disableTypography>
                <Typography variant="h6">{title}</Typography>
                {handleClose?(
                    <IconButton edge="start" color="inherit" className={classes.closeButton} onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                ):null}
            </DialogTitle>
            }
            <DialogContent dividers={!fullScreen}>
                {children}
            </DialogContent>
            {popupAction&&!fullScreen?(
                <DialogActions>
                    {popupAction}
                </DialogActions>
            ):null}
        </Dialog>
    )
}
