export const profileActionTypes={
    SET_PROFILE: "SET_PROFILE"
}

export const setProfile=(data)=>(dispatch)=>{
    return dispatch({
        type: profileActionTypes.SET_PROFILE,
        payload: data
    })
}