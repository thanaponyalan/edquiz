import { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setProfile } from '../redux/actions/profileAction'
import { compose } from 'recompose'

class Index extends Component{
    static async getInitialProps(ctx) {
        if (ctx.req) {
            ctx.res.writeHead(302, { Location: '/my-class' });
            ctx.res.end();
            return;
        }

        if (!ctx.req) {
            Router.push('/my-class');
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

export default compose(
    // connect(mapStateToProps, mapDispatchToProps),
) (Index)