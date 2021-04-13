import React from 'react';
import { Fab as MuiFab, Tooltip } from "@material-ui/core";

export default function Fab(props) {
    const {size,color,label,onClick,children,title,placement,...other} = props;
    return(
    <Tooltip title={title} placement={placement || 'bottom'}>
        <MuiFab
            size={size||'small'}
            color={color || "primary"} 
            aria-label={label} 
            onClick={onClick}
            {...other}
        >
            {children}
        </MuiFab>
    </Tooltip>
    )
}