import React from 'react'
import { Card as MuiCard, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, makeStyles, Menu, MenuItem, Chip } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

const useStyles=makeStyles(theme=>({
    card:{
        width: '100%'
    }
}))

export default function Card(props) {
    const {title,type, menuId, setAnchorEl}=props
    const classes=useStyles();
    return (
        <MuiCard className={classes.card}>
            <CardHeader 
                action={
                    <IconButton aria-controls={menuId} onClick={(e)=>setAnchorEl(e.currentTarget)} aria-label="actions">
                        <MoreVert/>
                    </IconButton>
                }
                title={title}
                subheader={<Chip label={type}/>}
            />
        </MuiCard>
    )
}
