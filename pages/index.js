import { Component } from 'react'
import nextCookie from "next-cookies";
import { Router } from 'next/router'

class Index extends Component{
    static async getInitialProps(ctx) {
        const {role,uid}=nextCookie(ctx)
        if(role&&uid){
            if(ctx.req){
                ctx.res.writeHead(302, { Location: role=='student'?'/my-class':'/course' });
                ctx.res.end();
                return;
            }else{
                Router.push(role=='student'?'/my-class':'/course')
            }
        }else if(uid){
            if(ctx.req){
                ctx.res.writeHead(302, {Location: '/choose-role'})
                ctx.res.end()
            }else{
                Router.push('/choose-role')
            }
        }else{
            if(ctx.req){
                ctx.res.writeHead(302, { Location: '/login' });
                ctx.res.end();
                return;
            }else if(!ctx.req){
                Router.push('/login');
            }
        }

        return;
    }
    render(){
        return(
            <div>
                <h1>HelloWorld</h1>
            </div>
        )
    }
}

export default Index