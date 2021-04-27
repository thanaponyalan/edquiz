import { Button } from "@material-ui/core";

const LoginBox = (props) => {
    return (
        <div className="card">
            <div className="card-body login-card-body">
                <p className="login-box-msg">Sign in to start your session</p>
                <div className="social-auth-links text-center mb-3">
                    <Button href={props.loginUrl} variant="outlined">
                        <img width="20px" style={{ marginBottom: '3px', marginRight: '5px' }} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                        Login with Google
                    </Button>
                </div>
            </div>
        </div>

    )
}

export default LoginBox;