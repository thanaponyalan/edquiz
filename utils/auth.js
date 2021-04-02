import React, { Component } from "react";
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import Router from 'next/router';
import { destroyCookie } from 'nookies';
import { setProfile } from "../redux/actions/profileAction";
import { setCourse } from "../redux/actions/courseAction";
import { API } from "../constant/ENV";
import { setQuestion } from "../redux/actions/questionAction";
import { setQuiz } from "../redux/actions/quizAction";
import { setClass } from "../redux/actions/classAction";
import { fetchClassroom } from "../redux/actions/classroomAction";

export const withAuthSync = WrappedComponent => class extends Component {
    constructor(props) {
        super(props);
    }
    
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
        const {uid, role} = auth(ctx)||{};
        const {pathname, store}=ctx;
        let courses=[],questions,quizzes, classes;
        try {
            var url = new URL(`${API}/user`), params = { uid: uid }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            const uRes = await fetch(url);
            const user = await uRes.json();
            store.dispatch(setProfile(user));
            if(pathname=='/course'){
                url=`${API}/course`
                const coursesRes=await fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: uid
                    }
                });
                courses=await coursesRes.json();
                store.dispatch(setCourse(courses));
            }
            if(pathname=='/item'){
                url=`${API}/item`
                const questionRes=await fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: uid
                    }
                })
                questions=await questionRes.json();
                store.dispatch(setQuestion(questions));

                url=`${API}/course`
                const coursesRes=await fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: uid
                    }
                });
                courses=await coursesRes.json();
                store.dispatch(setCourse(courses));

                url=`${API}/test`
                const quizRes=await fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: uid
                    }
                })
                quizzes=await quizRes.json();
                store.dispatch(setQuiz(quizzes))
            }
            if(pathname=='/manage-class'){
                url=`${API}/class?isTeacher=1`
                const classRes=await fetch(url,{
                    method: 'GET',
                    headers:{
                        authorization: uid
                    }
                })
                classes=await classRes.json();
                store.dispatch(setClass(classes));
            }
            if(pathname=='/my-class'){
                if (role== 'student'){
                    url=`${API}/class`
                    const classRes=await fetch(url,{
                        method: 'GET',
                        headers:{
                            authorization: uid
                        }
                    })
                    classes=await classRes.json();
                    store.dispatch(setClass(classes));
                }
                else{
                    url=`${API}/class?isTeacher=1`
                    const classRes=await fetch(url,{
                        method: 'GET',
                        headers:{
                            authorization: uid
                        }
                    })
                    classes=await classRes.json();
                    store.dispatch(setClass(classes));
                }
            }
        } catch (err) {
            console.log(err);
        }
        const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
        return { ...componentProps, uid, role }
    }
    render() {
        return <WrappedComponent {...this.props} />
    }
}

export const auth = ctx => {
    const { uid, role } = nextCookie(ctx);
    if (ctx.req) {
        if(!uid){
            ctx.res.writeHead(302, { Location: '/login' });
            ctx.res.end();
            return;
        }
        if(!role){
            ctx.res.writeHead(302,{Location:'/choose-role'});
            ctx.res.end();
            return;
        }
    }
    if (!uid) {
        Router.push('/login');
    }
    if(!role){
        Router.push('/choose-role')
    }

    return {uid: uid, role: role};
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
        window.location.href="/login";
    }
}