import { Avatar, Card, CardActionArea, CardHeader, CardMedia, Container, Grid, makeStyles } from '@material-ui/core';
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: 'red',
    },
}));

export default function AnswerQuestion(props) {
    const { item, handleChooseAnswer } = props;
    const classes = useStyles();
    return (
        <Container maxWidth="md">
            <Grid container spacing={3} style={{/*maxWidth: 1024, margin: '0 auto'*/}}>
                <Grid item sm={12} xs={12}>
                    <Card>
                        <CardHeader
                            title={item.question.title}
                        />
                        {
                            item.question.pict &&
                            <CardMedia
                                className={classes.media}
                                image={item.question.pict}
                                style={item.question.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                            />
                        }
                    </Card>
                </Grid>
                <Grid container spacing={3}>
                    {shuffle(item.choices).filter(item=>item.choice!='').map((item, idx) => (
                        <Grid key={idx} item sm={6} xs={12}>
                            <Card variant="outlined">
                                <CardActionArea onClick={()=>{handleChooseAnswer(item)}}>
                                    <CardHeader
                                        avatar={
                                            <Avatar>
                                                {idx+1}
                                            </Avatar>
                                        }
                                        title={item.choice}
                                    />
                                    {
                                        item.pict &&
                                        <CardMedia
                                            className={classes.media}
                                            image={item.pict}
                                            style={item.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                                        />
                                    }
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Grid>
        </Container>
    )
}

const shuffle=(arr)=>{
    var currentIndex=arr.length, tempValue, randIndex;
    while(0!==currentIndex){
        randIndex=Math.floor(Math.random()*currentIndex);
        currentIndex-=1;
        tempValue=arr[currentIndex];
        arr[currentIndex]=arr[randIndex];
        arr[randIndex]=tempValue
    }
    return arr
}
