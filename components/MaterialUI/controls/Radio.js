import React from 'react'
import { FormControl, InputLabel, RadioGroup, MenuItem, FormHelperText, FormControlLabel, Radio as MuiRadio, FormLabel } from "@material-ui/core";

export default function Radio(props) {
    const {name, label, value, error=null, onChange, options}=props
    return (
        <FormControl
            variant="outlined"
            {...(error&&{error:true})}>
            <FormLabel id={name}>{label}</FormLabel>
            <RadioGroup
                aria-label={name}
                name={name}
                value={value}
                onChange={onChange}>
                {/* <FormControlLabel value="" control={<MuiRadio/>} label="None"/> */}
                {
                    options.map((item,i)=>
                    <>
                        <FormControlLabel value={item.id||item.choice||i} key={item.id||i} control={<MuiRadio/>} label={item.title||item.choice}/>
                        <img src="/upload/5fafa7393e953fa2512c3db7/questions.png" width="100%"/>
                    </>
                    )
                }

            </RadioGroup>
            {error&&<FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}
