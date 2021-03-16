import React from 'react'
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete'
import { TextField } from "@material-ui/core";

const filter=createFilterOptions();

export default function AutoComplete(props) {
    const {value, setValue, options, label, handleInputChange, createAble, ...others}=props
    return (
        <Autocomplete
            {...others}
            value={value}
            // onChange={(newValue)=>{
            //     if(typeof newValue==='string'){
            //         setValue({
            //             title: newValue
            //         })
            //     }else if(newValue&&newValue.inputValue){
            //         setValue({
            //             title: newValue.inputValue
            //         })
            //     }else{
            //         setValue(newValue);
            //     }
            // }}
            onChange={handleInputChange}
            filterOptions={(options, params)=>{
                const filtered=filter(options,params);
                if(createAble&&params.inputValue!==''){
                    filtered.push({
                        inputValue: params.inputValue,
                        title: `Add "${params.inputValue}"`
                    })
                }
                return filtered
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={options}
            getOptionLabel={(option)=>{
                if(typeof option==='string')return option;
                if(option.inputValue)return option.inputValue
                return option.title
            }}
            getOptionSelected={(option,value)=>option.id===value.id}
            renderOption={(option)=>option.title}
            renderInput={(params)=>(
                <TextField {...params} label={label} variant="outlined"/>
            )}
        />
    )
}