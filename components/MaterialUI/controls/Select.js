import React from 'react'
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from "@material-ui/core";

export default function Select(props) {
    const {name, label, value, error=null, onChange, options}=props
    return (
        <FormControl
            variant="outlined"
            {...(error&&{error:true})}>
            <InputLabel id={name}>{label}</InputLabel>
            <MuiSelect
                labelId={name}
                id={name}
                value={value}
                label={label}
                onChange={onChange}
                name={name}>  
                <MenuItem value="">None</MenuItem>
                {
                    options.map(item=>
                        <MenuItem value={item.id} key={item.id}>{item.title}</MenuItem>
                    )
                }
            </MuiSelect>
            {error&&<FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
