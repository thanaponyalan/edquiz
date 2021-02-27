export const roleActionTypes={
    SET_ROLE: "SET_ROLE"
}

export const setRole=(data)=>(dispatch)=>{
    return dispatch({
        type: roleActionTypes.SET_ROLE,
        payload: data
    })
}