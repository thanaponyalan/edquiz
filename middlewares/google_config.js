const port=process.env.PORT||3000;
export default{
    google:{
        client_id: '316027740377-35ebs88ek2nto6ke48kv8hqngn3dmobn.apps.googleusercontent.com',
        client_secret: 'iUuBE-j84zIMX8UV_ztD_DlV',
        redirect_uri: `http://localhost:${port}/api/accessToken`
    }
}