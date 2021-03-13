import { Component } from "react";
import MainLayout from "../containers/app/loginLayout";
import { Button } from "reactstrap";
import cookie from "js-cookie";
import nextCookie from "next-cookies";
import { Router } from "next/router";

class ChooseRole extends Component{
    constructor(props){
        super(props);
    }

    static getInitialProps=(ctx)=>{
        const {role}=nextCookie(ctx);
        if(role){
            if(ctx.res){
                ctx.res.writeHead(301,{Location: '/'})
                ctx.res.end()
            }else{
                Router.replace('/')
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
                            <Button onClick={()=>this.setRole('student')}>Student</Button>
                        </div>
                        <div className="social-auth-links text-center mb-3">
                            <Button onClick={()=>this.setRole('teacher')}>Teacher</Button>
                        </div>
                    </div>
                    {/* /.login-card-body */}
                </div>
            </MainLayout>
        )
    }
}

export default ChooseRole;