import React from 'react'
import { Card as ReactStrapCard, Col, CardHeader, CardTitle, CardBody } from "reactstrap";
import { PlaylistAdd, Visibility } from "@material-ui/icons";

export default function Card(props) {
    const {isCollapse,title,children,editable,editInModal,addable,addObjective,collapsable,viewable,viewInModal} = props;
    return (
        <Col md="12">
            <ReactStrapCard className={`card-primary card-outline ${isCollapse||!collapsable?'collapsed-card':''}`}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <div className="card-tools">
                        {viewable?<button type="button" className="btn btn-tool" onClick={viewInModal}><Visibility/></button>:""}
                        {addable?<button type="button" className="btn btn-tool" onClick={addObjective}><PlaylistAdd/></button>:""}
                        {editable?<button type="button" className="btn btn-tool" onClick={editInModal}><i className="fas fa-pencil-alt"></i></button>:""}
                        {collapsable?<button type="button" className="btn btn-tool" data-card-widget="collapse"><i className={`fas ${isCollapse?'fa-plus':'fa-minus'}`}></i></button>:""}
                    </div>
                </CardHeader>
                <CardBody>
                    {children}
                </CardBody>
            </ReactStrapCard>
        </Col>
    )
}
