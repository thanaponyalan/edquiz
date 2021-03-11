import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import React from "react";

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    {/* <title>AdminLTE 3 | Dashboard 3</title> */}
                    <link rel="stylesheet" href="static/plugins/fontawesome-free/css/all.min.css" />
                    <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
                    <link rel="stylesheet" href="static/dist/css/adminlte.min.css" />
                    <link rel="stylesheet" href="static/dist/css/myStyle.css" />
                    <link rel="stylesheet" href="static/dist/css/nprogress.css"/>
                    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet" />
                    <script src="static/plugins/jquery/jquery.min.js"></script>
                    <script src="static/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
                    <script src="static/dist/js/adminlte.js"></script>
                </Head>
                <body className="hold-transition sidebar-mini">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps=async(ctx)=>{
    const sheets=new ServerStyleSheets();
    const originalRenderPage=ctx.renderPage;

    ctx.renderPage=()=>
        originalRenderPage({
            enhanceApp: (App)=>(props)=>sheets.collect(<App {...props}/>),
        });

    const initialProps=await Document.getInitialProps(ctx);

    return{
        ...initialProps,
        styles:[...React.Children.toArray(initialProps.styles),sheets.getStyleElement()],
    }
}