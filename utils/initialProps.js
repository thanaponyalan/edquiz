import React, { Component } from "react";
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';
import Router from 'next/router';
import { destroyCookie } from 'nookies';
import { setProfile } from "../redux/actions/profileAction";
import roleReducer from "../redux/reducers/roleReducer";
import { setRole } from "../redux/actions/roleAction";
import { fetchCourse } from "../redux/actions/courseAction";

export const withInitialCourses = WrappedComponent => class extends Component {
    constructor(props) {
        super(props);
    }

    static async getInitialProps(ctx) {
        const {store}=ctx;
        const {uid}=store.getState().authReducer;
        let courses=[];
        try {
            const url=`http://localhost:3000/api/course`
            const coursesRes=await fetch(url,{
                method: 'GET',
                headers:{
                    authorization: uid
                }
            });
            courses=await coursesRes.json();
            courses=courses.data.payload
        } catch (err) {
            console.log(err);
        }
        const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
        return { ...componentProps, courses }
    }
    render() {
        return <WrappedComponent {...this.props} />
    }
}