import { Component } from "react";
import MainLayout from "../containers/app/loginLayout";
import { Button } from "reactstrap";
import cookie from "js-cookie";

class ChooseRole extends Component{
    constructor(props){
        super(props);
    }
    
    setRole=(role)=>{
        cookie.set('role',role,'/');
        window.location="/my-class"
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