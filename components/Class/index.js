import Link from "next/link";

const Class = (props) => {
    return (
        <div className="col-md-3">
            {/* Widget: user widget style 1 */}
            <div className="card card-widget widget-user">
                {/* Add the bg color to the header using any of the bg-* classes */}
                <div className="widget-user-header text-white" style={{ background: 'url("../static/dist/img/photo1.png") center center' }}>
                    <h3 className="widget-user-username text-right">{props.className}</h3>
                    <h5 className="widget-user-desc text-right">{props.courseNo}</h5>
                </div>
                <div className="card-footer" style={{paddingTop: 20}}>
                    <div className="row">
                        <div className="col-sm-12">
                            <Link href="/assignment">
                                <a href="#">Assignments</a>    
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className="card-footer">
                    <div className="row">
                        <div className="col-sm-4 border-right">
                            <div className="description-block">
                                <h5 className="description-header">3,200</h5>
                                <span className="description-text">SALES</span>
                            </div>
                        </div>
                        <div className="col-sm-4 border-right">
                            <div className="description-block">
                                <h5 className="description-header">13,000</h5>
                                <span className="description-text">FOLLOWERS</span>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="description-block">
                                <h5 className="description-header">35</h5>
                                <span className="description-text">PRODUCTS</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default Class;