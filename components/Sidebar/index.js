import { withRouter } from "next/router";
import { compose } from "recompose";
import { logout } from "../../redux/actions/authAction"
import {connect} from "react-redux"
import Link from "next/link";
import { roleSelected, withAuthSync } from "../../utils/auth";
import { useEffect } from "react";

const Sidebar = (props) => {
    // console.log(`Sidebar`);
    // console.log(props);
    const {profile, router}=props;
    const {pathname}=router;
    const {role}=props.auth;
    const isTeacher=role=='teacher';
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* <script>$(`#pushMenu`).PushMenu();console.log(`TEST`);</script> */}
            {/* Brand Logo */}
            <Link href='/my-class'>
                <a href="#" className="brand-link">
                    <img src="static/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">EDQuizzes</span>
                </a>
            </Link>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src={profile.photoUrl && profile.photoUrl.substring(0,2)=="//"?"https:"+profile.photoUrl:profile.photoUrl} style={{ /*width: "4rem"*/}} className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{profile.firstName} {profile.familyName}</a>
                        <a href="#" onClick={()=>props.logout()}>Logout</a>
                    </div>
                </div>
                {/* Sidebar Menu */}
                {/* Sidebar Menu */}
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li className="nav-item">
                            <Link href='/my-class'>
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>
                                        Get Started
                                    </p>
                                </a>
                            </Link>
                        </li>
                        <li className="nav-header">GOOGLE CLASSROOM</li>
                        <li className="nav-item">
                            <Link href='/my-class'>
                                <a href="#" className={pathname==="/my-class"?"nav-link active":"nav-link"}>
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>
                                        My Classes
                                    </p>
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href='/assignment'>
                                <a href="#" className={pathname==="/assignment"?"nav-link active":"nav-link"}>
                                    <i className="nav-icon fas fa-th" />
                                    <p>
                                        Assignments
                                    </p>
                                </a>
                            </Link>
                        </li>
                        { isTeacher?
                        <>
                        <li className="nav-header">LIBRARY</li>
                        <li className="nav-item">
                            <Link href='/item'>
                                <a href="#" className={pathname==="/item"?"nav-link active":"nav-link"}>
                                    <i className="nav-icon fas fa-calendar-alt" />
                                    <p>
                                        Items
                                        <span className="badge badge-info right">2</span>
                                    </p>
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href='/test'>
                                <a href="#" className={pathname==="/test"?"nav-link active":"nav-link"}>
                                    <i className="nav-icon far fa-image" />
                                    <p>
                                        Tests
                                    </p>
                                </a>
                            </Link>
                        </li>
                        <li className="nav-header">MANAGEMENT</li>
                        <li className="nav-item">
                            <Link href='/course'>
                                <a href="#" className={pathname==="/course"?"nav-link active":"nav-link"}>
                                    <i className="nav-icon fas fa-file" />
                                    <p>Courses and Objectives</p>
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href='/manage-class'>
                                <a href="#" className={pathname==="/manage-class"?"nav-link active":"nav-link"}>
                                    <i className="fas fa-circle nav-icon" />
                                    <p>Classes</p>
                                </a>
                            </Link>
                        </li>
                        </>
                        :<></>}
                    </ul>
                </nav>
                {/* /.sidebar-menu */}
            </div>
            {/* /.sidebar */}
        </aside>
    )
}

const mapStateToProps=state=>{
    return{
        profile: state.profileReducer,
        auth: state.authReducer
    }
}

export default compose(
    connect(mapStateToProps,{logout}),
    withRouter
)(Sidebar);