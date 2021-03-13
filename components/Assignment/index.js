import Link from "next/link";
import { Col, Card, CardHeader, CardBody, CardTitle, Table } from "reactstrap";
import Insight from "./insight";
import NewAssignment from "./newAssignment";

const AssignmentWidget = (props) => {
    console.log("CourseWidget");
    console.log(props);
    if(props.isCollapse)
        return (
            <Col md="12">
                <Card className="card-primary card-outline collapsed-card">
                    <CardHeader>
                        <CardTitle>{props.courseDetail.courseName} ({props.courseDetail.courseNo})</CardTitle>
                        <div className="card-tools">
                            <NewAssignment/>
                            <Insight/>
                            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-plus"></i></button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {/* <ObjectiveTable data={props.courseDetail.objectives}/> */}
                    </CardBody>
                </Card>
            </Col>
        );
    else
        return (
            <Col md="12">
                <Card className="card-primary card-outline">
                    <CardHeader>
                        <CardTitle>{props.courseDetail.courseName} ({props.courseDetail.courseNo})</CardTitle>
                        <div className="card-tools">
                            <NewAssignment/>
                            <Insight/>
                            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus"></i></button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {/* <ObjectiveTable data={props.courseDetail.objectives}/> */}
                    </CardBody>
                </Card>
            </Col>
        );
}

export default AssignmentWidget;