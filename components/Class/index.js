import { Avatar, Card, CardContent, CardHeader, Chip, Grid, makeStyles, Typography } from "@material-ui/core";
import Link from "next/link";
import { withRouter } from "next/router";
import { useState } from "react";
import { compose } from "redux";

const useStyle=makeStyles({
    media:{
        height: 140
    }
})

const Class = (props) => {
    const [variant,setVariant]=useState('outlined')
    const classes=useStyle();
    return (
        <Grid item md={3} xs={12} sm={6}>
            <Card variant={variant} onClick={()=>{props.router.push('/assignment')}} onMouseEnter={()=>{setVariant("elevation")}} onMouseLeave={()=>{setVariant('outlined')}} style={{cursor: "pointer"}}>
                <CardHeader
                    title={props.className}
                    subheader={
                        <Chip avatar={<Avatar>No.</Avatar>}
                            label={props.courseNo}
                        />
                    }
                    style={{
                        backgroundColor: 'rgb(52, 58, 64)',
                        color: 'white'
                    }}
                />
                {/* <CardContent>
                    <Typography gutterBottom variant="body2" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        ASSIGNMENTS
                    </Typography>
                </CardContent> */}
            </Card>
        </Grid>
    );
}

export default compose(
    withRouter
)(Class);