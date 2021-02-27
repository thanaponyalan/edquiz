const Navbar = (props) => {
    // console.log(props);
    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light" >
            <ul className="navbar-nav" >
                <li className="nav-item">
                    <a className="nav-link" id="pushMenu" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                </li>
                <li className="nav-item  d-sm-inline-block">
                    <b className="nav-link">{props.title}</b>
                </li>
                {/*
                <li className="nav-item d-none d-sm-inline-block">
                    <a href="#" className="nav-link">Contact</a>
                </li> */}
            </ul>
           {/* <a>{props.title}</a> */}
            < ul className="navbar-nav ml-auto" >
                {props.components}
            </ul >
        </nav >
    )
}

export default Navbar;