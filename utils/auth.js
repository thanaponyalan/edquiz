import React, { Component } from "react";
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import Router from 'next/router';
import { destroyCookie } from 'nookies';
import { setProfile } from "../redux/actions/profileAction";
import roleReducer from "../redux/reducers/roleReducer";
import { setRole } from "../redux/actions/roleAction";
import { setCourse } from "../redux/actions/courseAction";

let server = 'http://localhost:3000'

export const withAuthSync = WrappedComponent => class extends Component {
    constructor(props) {
        super(props);
        // this.syncLogout=this.syncLogout.bind(this)
    }
    // syncLogout(event){
    //     if(event.key==='logout'){
    //         Router.push('/login')
    //     }
    // }
    componentDidMount() {
        this.layoutHeight();
    }
    
    layoutHeight=()=>{
        var Selector = {
            HEADER: '.main-header',
            SIDEBAR: '.main-sidebar .sidebar',
            CONTENT: '.content-wrapper',
            FOOTER: '.main-footer',
        };
        var heights = {
            window: $(window).height(),
            header: $(Selector.HEADER).length !== 0 ? $(Selector.HEADER).outerHeight() : 0,
            footer: $(Selector.FOOTER).length !== 0 ? $(Selector.FOOTER).outerHeight() : 0,
            sidebar: $(Selector.SIDEBAR).length !== 0 ? $(Selector.SIDEBAR).height() : 0
        };
        var keys = Object.keys(heights);
        var max = heights[keys[0]];
        var i;
    
        for (i = 1; i < keys.length; i++) {
            var value = heights[keys[i]];
            if (value > max) max = value;
        }
        if (max == heights.control_sidebar) {
            $(Selector.CONTENT).css('min-height', max);
        } else if (max == heights.window) {
            $(Selector.CONTENT).css('min-height', max - heights.header - heights.footer);
        } else {
            $(Selector.CONTENT).css('min-height', max - heights.header);
        }
    }

    static async getInitialProps(ctx) {
        const uid = auth(ctx);
        const {pathname, store}=ctx;
        let courses=[], ret;
        try {
            var url = new URL(`${server}/api/user`), params = { uid: uid }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            const uRes = await fetch(url);
            const user = await uRes.json();
            ctx.store.dispatch(setProfile(user));
            // if(pathname=='/course'){
            //     url=`http://localhost:3000/api/course`
            //     const coursesRes=await fetch(url,{
            //         method: 'GET',
            //         headers:{
            //             authorization: uid
            //         }
            //     });
            //     courses=await coursesRes.json();
            //     console.log(courses.data.payload);
            //     // store.dispatch(setCourse(courses));
            // }
            // ret={
            //     uid: uid,
            //     courses: courses.data.payload
            // }
            // console.log(ret);
        } catch (err) {
            console.log(err);
        }
        const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
        return { ...componentProps, uid }
    }
    render() {
        return <WrappedComponent {...this.props} />
    }
}

export const auth = ctx => {
    const { uid } = nextCookie(ctx);
    if (ctx.req && !uid) {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
        return;
    }
    if (!uid) {
        Router.push('/login');
    }

    return uid;
}

export const logout = (ctx = null) => {
    if (ctx && ctx.req) {
        destroyCookie(ctx, 'uid');
        destroyCookie(ctx, 'role');
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
    } else {
        cookie.remove('uid');
        cookie.remove('role')
        window.localStorage.setItem('logout', Date.now());
        Router.push('/login');
        window.location.reload();
    }
}

export const roleSelected=WrappedComponent=>class extends Component{
    constructor(props){
        super(props);
    }
    static async getInitialProps(ctx) {
        const role=getRole(ctx);
        ctx.store.dispatch(setRole(role))
        const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
        return { ...componentProps, role }
    }
    render() {
        return <WrappedComponent {...this.props} />
    }
}

const getRole=ctx=>{
    const { role }=nextCookie(ctx);
    if(!role&&ctx.req){
        ctx.res.writeHead(302,{Location:'/choose-role'});
        ctx.res.end();
        return;
    }
    if(!role)Router.push('/choose-role');
    return role;
}