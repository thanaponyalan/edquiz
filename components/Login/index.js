const LoginBox = (props) => {
    return (
        <div className="card">
            <div className="card-body login-card-body">
                <p className="login-box-msg">Sign in to start your session</p>
                <div className="social-auth-links text-center mb-3">
                    {/* <p>- OR -</p>
                    <a href="#" className="btn btn-block btn-primary">
                        <i className="fab fa-facebook mr-2" /> Sign in using Facebook</a> */}
                    <a href={props.loginUrl} className="btn btn-block btn-danger">
                        <i className="fab fa-google-plus mr-2" /> Sign in using Google+</a>
                </div>
            </div>
            {/* /.login-card-body */}
        </div>

    )
}

export default LoginBox;