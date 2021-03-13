import React, { Fragment } from 'react'
import { FormControl, RadioGroup, FormHelperText, FormControlLabel, Radio as MuiRadio, FormLabel } from "@material-ui/core";

export default function Radio(props) {
    const {name, label, value, error=null, onChange, options}=props
    return (
        <FormControl
            variant="outlined"
            {...(error&&{error:true})}>
            <FormLabel id={name}>{label}</FormLabel>
            {error&&<FormHelperText>{error}</FormHelperText>}
            <RadioGroup
                aria-label={name}
                name={name}
                value={value}
                onChange={onChange}>
                {
                    options.map((item,i)=>
                    <Fragment key={i}>
                        <FormControlLabel value={item.id||item.choice||i} control={<MuiRadio/>} label={item.title||item.choice}/>
                        {item.pict&&<img src={item.pict} width="100%"/>}
                    </Fragment>
                    )
                }
            </RadioGroup>
        </FormControl>
    )
}
