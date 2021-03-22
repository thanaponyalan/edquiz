import React from 'react'
import { AddPhotoAlternate } from "@material-ui/icons";
import { Button, Grid, makeStyles, Card, CardActionArea, CardMedia, CardActions, FormLabel, FormControl, Radio, RadioGroup, FormControlLabel, FormHelperText } from "@material-ui/core";
import Controls from '../MaterialUI/controls/Controls'

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

export default function MultipleChoice(props) {
    const { values, handleInputChange, imageHandler, clearImage, choices, setChoices, errors, validate, previewMode, selectedChoices, setSelectedChoices } = props;
    const classes = useStyles();
    return (
        <>
            <Controls.Input
                label="Question : MultipleChoice"
                name="question.title"
                value={values.question.title}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={errors.question}
                InputProps={{
                    readOnly: previewMode
                }}
            />
            <Card className={classes.card}>
                <CardActionArea disabled={previewMode} component="label" htmlFor="uploadQuestionImage">
                    <CardMedia
                        className={classes.media}
                        image={values.question.pict||'/static/dist/img/boxed-bg.png'}
                        style={values.question.pict&&{ backgroundSize: 'contain' }||{backgroundSize: 'cover'}}
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
                <RadioGroup
                    onChange={(e) => {
                        if(previewMode){
                            setSelectedChoices(choices.map((item,i)=>{
                                return {...item, isTrue: i==e.target.value}
                            }))
                        }else{
                            setChoices(choices.map((item, i) => {
                                return { ...item, isTrue: i == e.target.value }
                            }))
                        }
                    }}
                >
                    <Grid container spacing={3}>
                        {
                            choices.map((item, i) =>
                                <Grid item xs={12} sm={6} key={i}>
                                    <FormControlLabel className={classes.formControlLabel} value={i} control={<Radio />} label={<Controls.Input inputProps={{readOnly: previewMode}} label={`Choice ${i + 1}`} name={`choice_${i}`} value={item.choice} onChange={(e) => {
                                        setChoices(choices.map((item, i) => {
                                            return { ...item, choice: i == e.target.name.split('_')[1] ? e.target.value : item.choice }
                                        }))
                                    }} />} checked={!previewMode?item.isTrue:selectedChoices[i].isTrue} />
                                    <Card className={classes.card}>
                                        <CardActionArea disabled={previewMode} component="label" htmlFor={`choiceImg_${i}`}>
                                            <CardMedia
                                                className={classes.media}
                                                image={item.pict||'/static/dist/img/boxed-bg.png'}
                                                style={item.pict&&{ backgroundSize: 'contain' }||{backgroundSize: 'cover'}}
                                            >
                                            </CardMedia>
                                            {!item.pict && <AddPhotoAlternate className={classes.addImg} />}
                                        </CardActionArea>
                                        <CardActions>
                                            <Button disabled={previewMode} onClick={() => clearImage(i)} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        }
                    </Grid>
                </RadioGroup>
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
        </>
    )
}
