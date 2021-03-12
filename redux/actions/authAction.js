export const authActionTypes={
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
}

export const login=(data)=>dispatch=>{
    // console.log("logged in");
    return dispatch({
        type: authActionTypes.LOGIN,
        payload: data
    })
}

export const logout=()=>dispatch=>{
    // console.log("logged out");
    return dispatch({
        type: authActionTypes.LOGOUT
    })
}