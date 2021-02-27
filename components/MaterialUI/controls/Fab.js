import React from 'react';
import { Fab as MuiFab } from "@material-ui/core";

export default function Fab(props) {
    const {size,color,label,onClick,children,...other} = props;
    return (
        <MuiFab 
            size={size || "small"} 
            color={color || "primary"} 
            aria-label={label} 
            onClick={onClick}>
                {children}
        </MuiFab>
    )
}