import { Card, Row, Col, CardTitle, Badge, Button } from "reactstrap";

const Question=(props)=>{
    return(
        <Card body itemID={props.id}>
            <Row>
                <Col sm={9}>
                    <CardTitle>{props.question}</CardTitle>
                </Col>
                <Col sm={3}>
                    <div className="float-right">
                        <Button outline className=""><i class="fas fa-eye"></i>   View</Button>
                        {' '}
                        <Button outline className="">+</Button>
                    </div>
                </Col>

            </Row>
            <Row>
                <Col sm={9}>
                    <Badge>{props.type}</Badge>
                    {' '}
                    <Badge color="dark">{props.params}</Badge>
                </Col>
            </Row>
        </Card>
    )
}

export default Question