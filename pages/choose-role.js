import { Component } from "react";
import MainLayout from "../containers/app/loginLayout";
import cookie from "js-cookie";
import nextCookie from "next-cookies";
import { Router } from "next/router";
import { Button } from "@material-ui/core";

class ChooseRole extends Component{
    constructor(props){
        super(props);
    }

    static getInitialProps=(ctx)=>{
        const {role, uid}=nextCookie(ctx);
        if(!uid){
            if(ctx.res){
                ctx.res.writeHead(301,{Location: '/'})
                ctx.res.end()
            }else{
                Router.replace('/')
            }
        }
        if(role){
            if(ctx.res){
                ctx.res.writeHead(301,{Location: role=='student'?'/my-class':'/course'})
                ctx.res.end()
            }else{
                Router.replace(role=='student'?'/my-class':'/course')
            }
        }
    }
    
    setRole=(role)=>{
        cookie.set('role',role,'/');
        window.location="/"
    }
    
    render(){
        return(
            <MainLayout>
                <div className="card">
                    <div className="card-body login-card-body">
                        <h3 className="login-box-msg">Select Role</h3>
                        <div className="social-auth-links text-center mb-3">
                            <Button onClick={()=>this.setRole('student')} variant="outlined">Student</Button>
                        </div>
                        <div className="social-auth-links text-center mb-3">
                            <Button onClick={()=>this.setRole('teacher')} variant="outlined">Teacher</Button>
                        </div>
                    </div>
                    {/* /.login-card-body */}
                </div>
            </MainLayout>
        )
    }
}

export default ChooseRole;