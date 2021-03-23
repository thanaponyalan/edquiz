import React, { useState } from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { Grid, makeStyles, Card, CardActionArea, CardMedia, CardActions, Button, FormHelperText, FormControl, FormLabel, CardHeader, CardContent, Typography } from "@material-ui/core";
import { AddPhotoAlternate } from "@material-ui/icons";
import { useDrag, useDrop } from 'react-dnd';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    fullHeightCard: {
        height: '100%'
    },
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    addImg: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    card: {
        margin: '8px',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            margin: '8px 0',
        }
    },
    formControlLabel: {
        width: '100%',
        '& span:nth-of-type(2)': {
            width: '100%'
        }
    },
    nestedGrid: {
        margin: 0
        // [theme.breakpoints.down('sm')]: {
        //     margin: 0,
        // }
    }
}));

export default function Match(props) {
    const { values, imageHandler, clearImage, handleInputChange, errors, setChoices, choices, previewMode, answeredChoices, setAnsweredChoices } = props;
    const [possibleAnswers, setPossibleAnswers] = useState(choices.map(item => (item.answer)))
    const classes = useStyles()
    if(!previewMode){
        if(choices.length<4){
            const elem=Array(4-choices.length).fill({choice: '', pict:'', answer:{title: '', pict: ''}})
            setChoices([...choices, ...elem])
        }
    }
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
    return (
        <>
            <Controls.Input
                label="Question : Matching"
                name="question.title"
                value={values.question.title}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={errors.question}
                inputProps={{
                    readOnly: previewMode
                }}
                style={{
                    margin: '8px 0'
                }}
            />
            <Card className={classes.card}>
                <CardActionArea disabled={previewMode} component="label" htmlFor="uploadQuestionImage">
                    <CardMedia
                        className={classes.media}
                        image={values.question.pict || '/static/dist/img/boxed-bg.png'}
                        style={values.question.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                    >
                    </CardMedia>
                    {!values.question.pict && <AddPhotoAlternate className={classes.addImg} />}
                </CardActionArea>
                <CardActions>
                    <Button disabled={previewMode} onClick={clearImage} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                </CardActions>
            </Card>
            <FormControl variant="outlined" {...errors.choices && { error: true }}>
                <FormLabel>Choices</FormLabel>
                {errors.choices && <FormHelperText>{errors.choices}</FormHelperText>}
                <Grid container spacing={2}>
                    {choices && choices.map((item, idx) =>
                        <>
                            <Grid container spacing={2} className={classes.nestedGrid}>
                                <Grid item xs={12} sm={6}>
                                    {!previewMode && <>
                                        <Controls.Input
                                            label={`Choice ${idx + 1}`}
                                            name={`choice_${idx}`}
                                            value={item.choice}
                                            onChange={(e) => {
                                                setChoices(choices.map((item, i) => {
                                                    return { ...item, choice: i == e.target.name.split('_')[1] ? e.target.value : item.choice }
                                                }))
                                            }}
                                            inputProps={{
                                                readOnly: previewMode
                                            }}
                                            style={{
                                                margin: '8px 0'
                                            }}
                                        />
                                        <Card className={classes.card}>
                                            <CardActionArea disabled={previewMode} component="label" htmlFor={`choiceImg_${idx}`}>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.pict || '/static/dist/img/boxed-bg.png'}
                                                    style={item.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                                                >
                                                </CardMedia>
                                                {!item.pict && <AddPhotoAlternate className={classes.addImg} />}
                                            </CardActionArea>
                                            <CardActions>
                                                <Button disabled={previewMode} onClick={() => clearImage(idx)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                            </CardActions>
                                        </Card>
                                    </>}
                                    {previewMode && <>
                                        <Card>
                                            {item.pict && <CardMedia className={classes.media} image={item.pict} />}
                                            <CardActions>
                                                <Typography gutterBottom variant="inherit" component="label">
                                                    {item.choice}
                                                </Typography>
                                            </CardActions>
                                        </Card>
                                    </>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {!previewMode && <>
                                        <Controls.Input
                                            label={`Answer ${idx + 1}`}
                                            name={`answer_${idx}`}
                                            value={item.answer.title}
                                            onChange={(e) => {
                                                setChoices(choices.map((item, i) => {
                                                    return { ...item, answer: { title: i == e.target.name.split('_')[1] ? e.target.value : item.answer.title, pict: item.answer.pict } }
                                                }))
                                            }}
                                            inputProps={{
                                                readOnly: previewMode
                                            }}
                                        />
                                        <Card className={classes.card}>
                                            <CardActionArea disabled={previewMode} component="label" htmlFor={`choice.answer_${idx}`}>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.answer.pict || '/static/dist/img/boxed-bg.png'}
                                                    style={item.answer.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                                                >
                                                </CardMedia>
                                                {!item.answer.pict && <AddPhotoAlternate className={classes.addImg} />}
                                            </CardActionArea>
                                            <CardActions>
                                                <Button disabled={previewMode} onClick={() => clearImage(`choice.answer_${idx}`)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                            </CardActions>
                                        </Card>
                                    </>}
                                    {previewMode && !answeredChoices[idx] ?
                                        <AnswerArea classes={classes} idx={idx} setAnswer={setAnswer} /> :
                                        previewMode && <AnswerCard pict={answeredChoices[idx].pict} classes={classes} choice={answeredChoices[idx].title} idx={answeredChoices[idx].cardIdx} />
                                    }
                                </Grid>
                                {previewMode&&possibleAnswers.every(e => e != null) ?
                                    <FormLabel component="legend">Drag the answer here.</FormLabel> :
                                    <></>
                                }
                                {previewMode&&possibleAnswers && possibleAnswers.map((item, idx) =>
                                    <Grid item xs={12} sm={6} md={3}>
                                        {item && <AnswerCard pict={item.pict} classes={classes} choice={item.title} idx={idx} />}
                                    </Grid>
                                )}
                            </Grid>
                        </>)
                    }
                </Grid>
            </FormControl>
            <input
                type="file"
                id="uploadQuestionImage"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_0"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_1"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_2"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choiceImg_3"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choice.answer_0"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choice.answer_1"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choice.answer_2"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
            <input
                type="file"
                id="choice.answer_3"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
        </>
    )
}

const AnswerArea = props => {
    const { classes, idx, setAnswer } = props;
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
        <Card ref={drop} style={{ opacity: isOver ? '0.5' : '1' }}>
            <CardActionArea>
                {<CardMedia className={classes.media} image='/static/dist/img/boxed-bg.png' />}
                <CardActions>
                    <Typography gutterBottom variant="label" component="label">
                        Drop answer{`#${idx + 1}`} here
                    </Typography>
                </CardActions>
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
                {pict && <CardMedia className={classes.media} image={pict} />}
                <CardActions>
                    <Typography gutterBottom variant="label" component="label">
                        {choice}
                    </Typography>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}
