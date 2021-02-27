import { Component } from "react"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import Content from "../../components/Content"
import Footer from "../../components/Footer";

class MainLayout extends Component{
    componentDidMount(){
        document.querySelector('body').classList.add("sidebar-mini");
    }
    render(){
        return(
            <div>
                <div className="wrapper">
                    <Navbar title={this.props.title} components={this.props.pageActions}/>
                    <Sidebar/>
                    <Content>
                        {this.props.children}
                    </Content>
                    {/* <Footer/> */}
                </div>
                <div id="sidebar-overlay" onClick={()=>$(`#pushMenu`).click()}></div>
            </div>
        )
    }
}

export default MainLayout;