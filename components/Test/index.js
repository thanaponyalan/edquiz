
import { Card, CardImg, CardBody, CardTitle, CardText, Row, Col, CardFooter } from "reactstrap";

const Test=(props)=>{
    return(
        <Col md={3} sm={4}>
            <Card className="widget-user">
                <div className="widget-user-header text-white" style={{ background: 'url("../static/dist/img/photo2.png") center center' }}>
                </div>
                <CardBody>
                    <CardTitle>{props.name}</CardTitle>
                </CardBody>
                <CardFooter style={{paddingTop: 0, backgroundColor: "white", borderBottomLeftRadius:".25rem", borderBottomRightRadius:".25rem"}}>
                    <Row>
                        <Col sm={6} className="border-right">
                            <div className="description-block">
                                <span>SUBJECT</span>
                                <h5 className="description-text">{props.subject}</h5>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="description-block">
                                <span>TOTAL ITEMS</span>
                                <h5 className="description-text">{props.qCount}</h5>
                            </div>
                        </Col>
                    </Row>
                </CardFooter>
            </Card>
        </Col>
    )
}

export default Test;