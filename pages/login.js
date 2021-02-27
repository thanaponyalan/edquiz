import { Component } from "react";
import nextCookie from "next-cookies";
import { Router } from "next/router";
import Layout from "../containers/app/loginLayout";
import { compose } from "recompose";
import LoginBox from "../components/Login/index"
const port=process.env.PORT||3000;
const server=`http://localhost:${port}`

class Login extends Component{
    static async getInitialProps(ctx){
        const {uid}=nextCookie(ctx);
        if(ctx.req&&uid){
            ctx.res.writeHead(302,{Location: '/my-class'});
            ctx.res.end();
            return;
        }

        if(uid)Router.push('/my-class');

        const res=await fetch(`${server}/api/googleUrl`);
        const loginUrl=await res.json();
        return{
            loginUrl: loginUrl.url
        }
    }
    render(){
        return(
            <Layout>
                <LoginBox loginUrl={this.props.loginUrl} />
            </Layout>
        )
    }
}

export default compose(

)(Login);