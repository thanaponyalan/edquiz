import { Component } from "react"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import Content from "../../components/Content"
import { Router } from "next/router";

class LoginLayout extends Component{
    componentDidMount(){
        document.querySelector('body').classList.add("login-page");
    }
    render(){
        return(
                <div className="login-box">
                    <div className="login-logo">
                        <a href="/"><b>ED</b>Quizzes</a>
                    </div>
                    {this.props.children}
                </div>
        )
    }
}

export default LoginLayout;