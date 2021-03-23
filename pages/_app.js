import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/MaterialUI/theme';
import { wrapper } from '../redux/store';
import nextCookie from 'next-cookies';
import {login} from '../redux/actions/authAction';
import { ToastProvider } from 'react-toast-notifications';
import dynamic from 'next/dynamic'
import { DndProvider } from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend'

const TopProgressBar=dynamic(
    ()=>import("../components/TopProgressBar"),
    {ssr: false}
)

function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <TopProgressBar/>
        <CssBaseline />
        <DndProvider backend={HTML5Backend}>
        <ToastProvider placement={'bottom-center'} autoDismissTimeout={3000} components={{ Toast: Snack}}>
            <Component {...pageProps} />
        </ToastProvider>
        </DndProvider>
      </ThemeProvider>
  );
}

MyApp.getInitialProps=async ({Component, ctx})=>{
    const nCookie=nextCookie(ctx);
    if(nCookie['uid']&&nCookie['role']){
        ctx.store.dispatch(login({uid: nCookie['uid'], role: nCookie['role']}))
    }
    return{
        pageProps:{
            ...(Component.getInitialProps?await Component.getInitialProps(ctx):{}),
            pathname: ctx.pathname
        }
    }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export const Snack=({
    appearance,
    children,
    transitionDuration,
    onDismiss
})=>{
    let bgColor='#fffffff8';
    switch (appearance) {
        case 'error':
            bgColor='#bb595df8';
            break;
        case 'info':
            bgColor='#17a2b8f8';
            break;
        case 'success':
            bgColor="#45a88df8";
            break;
        case 'warning':
            bgColor='#ffc107f8';
            break;
        default:
            break;
    }

    return(
        <div
            onClick={onDismiss}
            style={{
                alignItems:'center',
                backgroundColor: bgColor,
                borderRadius:4,
                boxShadow:`
                    0px 3px 5px -1px rgba(128,128,128,0.2),
                    0px 6px 10px 0px rgba(128,128,128,0.14),
                    0px 1px 18px 0px rgba(128,128,128,0.12)
                `,
                color: '#fff',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: 8,
                minWidth: 288,
                maxWidth: 568,
                padding: '4px 24px',
                pointerEvents: 'initial',
                transitionProperty: 'transfrom',
                transitionDuration: `${transitionDuration}ms`,
                transitionTimingFunction: `cubic-bezier(0.2,0,0,1)`,
                transformOrigin: 'bottom',
                cursor: 'pointer',
                zIndex: 999
            }}>
                <div style={{
                    padding: '8px 0',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {children}
                </div>
        </div>
    )
}

export default wrapper.withRedux(MyApp);