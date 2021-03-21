import React, { Fragment } from 'react'
import { FormControl, RadioGroup, FormHelperText, FormControlLabel, Radio as MuiRadio, FormLabel, Grid, Input} from "@material-ui/core";


export default function Radio(props) {
    const {name, label, value, error=null, onChange, options, editable=false}=props
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
                <Grid container spacing={3}>
                {
                    options.map((item,i)=>
                    <Grid item md={6} key={i}>
                        <FormControlLabel value={item.id||item.choice||i} control={<MuiRadio/>} label={editable?(item.title||item.choice):(<Input name={`choice_${i+1}`} value={item.choice}/>)}/>
                        {item.pict&&<img src={item.pict} width="100%"/>}
                    </Grid>
                    )
                }
                </Grid>
            </RadioGroup>
        </FormControl>
    )
}
