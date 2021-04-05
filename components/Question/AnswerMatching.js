import { Avatar, Card, CardActionArea, CardActions, CardHeader, CardMedia, Container, Grid, makeStyles, Typography, FormLabel, Paper } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd';

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
    stickyGrid: {
        position: "sticky",
        top: "1rem",
    },
}));

export default function AnswerMatching(props) {
    const [answeredChoices, setAnsweredChoices]=useState([]);
    const { item, handleChooseAnswer } = props;
    const [answers,setAnswers]=useState(item.choices.filter(item=>item.choice!=''||item.pict!='').map(item=>item.answer))
    const [possibleAnswers, setPossibleAnswers]=useState(answers)
    const classes = useStyles();
    const setAnswer = (sIdx, tIdx) => {
        let tempAnswers = [...answeredChoices]
        let tempPossibles = [...possibleAnswers]
        if (tempPossibles[sIdx]) {
            tempAnswers[tIdx] = { ...tempPossibles[sIdx], cardIdx: sIdx }
            tempPossibles[sIdx] = null
        } else {
            const idx = tempAnswers.findIndex(answer => answer != null && answer.cardIdx == sIdx)
            tempAnswers[tIdx] = tempAnswers[idx];
            tempAnswers[idx] = null
        }
        setAnsweredChoices(tempAnswers)
        setPossibleAnswers(tempPossibles)
    }
    useEffect(() => {
        if(answers.length==answeredChoices.filter(item=>item).length){
            let score=0;
            answers.forEach((value,idx)=>{
                score+=answeredChoices.findIndex(choice=>choice.title===value.title)===idx?1:0;
            })
            score/=answers.length
            handleChooseAnswer({score: score})
        }
    }, [answeredChoices])
    return (
        <Container maxWidth="lg" fixed>
            <Grid container spacing={3}>
                <Grid item sm={9}>
                    <Grid container spacing={2}>
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
                        <Grid item sm={12}>
                            {item.choices && item.choices.filter(item=>item.choice!='').map((item, idx) =>
                                <Grid container spacing={3} className={classes.nestedGrid}>
                                    <Grid item xs={12} sm={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title={item.choice}
                                            />
                                            {item.pict && <CardMedia className={classes.media} image={item.pict} />}
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {!answeredChoices[idx] ?
                                            <AnswerArea classes={classes} idx={idx} setAnswer={setAnswer} hasPict={item.pict} /> 
                                            :
                                            <AnswerCard pict={answeredChoices[idx].pict} classes={classes} choice={answeredChoices[idx].title} idx={answeredChoices[idx].cardIdx} />
                                        }
                                    </Grid>
                                </Grid>
                                )
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={3}>
                    <Paper className={classes.stickyGrid} elevation={0}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} xs={12}>
                                <Card>
                                    <CardHeader
                                        title={`Drag answer here.`}
                                    />
                                </Card>
                            </Grid>
                            {possibleAnswers && possibleAnswers.map((item, idx) =>
                                <Grid item xs={12} sm={12} md={12}>
                                    {item && <AnswerCard pict={item.pict} classes={classes} choice={item.title} idx={idx} />}
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

const AnswerArea = props => {
    const { classes, idx, setAnswer, hasPict } = props;
    const [{ isOver }, drop] = useDrop({
        accept: 'ANS_CARD',
        drop: (item, monitor) => {
            setAnswer(item.idx, idx)
        },
        collect: monitor => ({
            isOver: monitor.isOver()
        })
    })
    return (
        <Card variant="outlined" ref={drop} style={{ opacity: isOver ? '0.5' : '1' }}>
            <CardActionArea>
                <CardHeader
                    title={`Drop answer #${idx+1} here.`}
                />
                {hasPict&&<CardMedia className={classes.media} image='/static/dist/img/boxed-bg.png' />}
            </CardActionArea>
        </Card>
    )
}

const AnswerCard = props => {
    const { pict, choice, classes, idx } = props;
    const [{ isDragging }, drag] = useDrag({
        type: 'ANS_CARD',
        item: {
            idx: idx
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    })
    return (
        <Card ref={drag} style={{ opacity: isDragging ? '0.5' : '1' }}>
            <CardActionArea>
                <CardHeader
                    title={choice}
                />
                {pict && <CardMedia className={classes.media} image={pict} />}
            </CardActionArea>
        </Card>
    )
}
