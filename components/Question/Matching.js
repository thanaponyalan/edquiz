import React from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { Grid, makeStyles, Card, CardActionArea, CardMedia, CardActions, Button, FormHelperText, FormControl, FormLabel } from "@material-ui/core";
import { AddPhotoAlternate } from "@material-ui/icons";

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
        width: '100%'
    },
    formControlLabel: {
        width: '100%',
        '& span:nth-of-type(2)': {
            width: '100%'
        }
    }
}));

export default function Match (props){
    const { values, imageHandler, clearImage, handleInputChange, errors, setChoices, choices } = props;
    const classes = useStyles()
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
            />
            <Card className={classes.card}>
                <CardActionArea component="label" htmlFor="uploadQuestionImage">
                    <CardMedia
                        className={classes.media}
                        image={values.question.pict || '/static/dist/img/boxed-bg.png'}
                        style={values.question.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                    >
                    </CardMedia>
                    {!values.question.pict && <AddPhotoAlternate className={classes.addImg} />}
                </CardActionArea>
                <CardActions>
                    <Button onClick={clearImage} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                </CardActions>
            </Card>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" {...errors.choices && { error: true }}>
                        <FormLabel>Choices</FormLabel>
                        {errors.choices && <FormHelperText>{errors.choices}</FormHelperText>}
                        {values.choices && values.choices.map((item, idx) =>
                            <Grid key={idx} item xs={12}>
                                <Controls.Input
                                    label={`Choice ${idx + 1}`}
                                    name={`choice_${idx}`}
                                    value={item.choice}
                                    onChange={(e) => {
                                        setChoices(choices.map((item, i) => {
                                            return { ...item, choice: i == e.target.name.split('_')[1] ? e.target.value : item.choice }
                                        }))
                                    }}
                                />
                                <Card className={classes.card}>
                                    <CardActionArea component="label" htmlFor={`choiceImg_${idx}`}>
                                        <CardMedia
                                            className={classes.media}
                                            image={item.pict || '/static/dist/img/boxed-bg.png'}
                                            style={item.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                                        >
                                        </CardMedia>
                                        {!item.pict && <AddPhotoAlternate className={classes.addImg} />}
                                    </CardActionArea>
                                    <CardActions>
                                        <Button onClick={() => clearImage(idx)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <FormControl variant="outlined" {...errors.choices && { error: true }}>
                        <FormLabel>Answers</FormLabel>
                        {errors.choices && <FormHelperText>{errors.choices}</FormHelperText>}
                        {values.choices && values.choices.map((item, idx) =>
                            <Grid item xs={12}>
                                <Controls.Input
                                    label={`Answer ${idx + 1}`}
                                    name={`answer_${idx}`}
                                    value={item.answer.title}
                                    onChange={(e) => {
                                        setChoices(choices.map((item, i) => {
                                            return { ...item, answer: { title: i == e.target.name.split('_')[1] ? e.target.value : item.answer.title, pict: item.answer.pict } }
                                        }))
                                    }}
                                />
                                <Card className={classes.card}>
                                    <CardActionArea component="label" htmlFor={`choice.answer_${idx}`}>
                                        <CardMedia
                                            className={classes.media}
                                            image={item.answer.pict || '/static/dist/img/boxed-bg.png'}
                                            style={item.answer.pict && { backgroundSize: 'contain' } || { backgroundSize: 'cover' }}
                                        >
                                        </CardMedia>
                                        {!item.answer.pict && <AddPhotoAlternate className={classes.addImg} />}
                                    </CardActionArea>
                                    <CardActions>
                                        <Button onClick={() => clearImage(`choice.answer_${idx}`)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </FormControl>
                </Grid>
            </Grid>
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
