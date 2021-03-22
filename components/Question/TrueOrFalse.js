import React from 'react'
import Controls from "../MaterialUI/controls/Controls";
import { makeStyles, Card, CardActionArea, CardMedia, CardActions, Button, FormHelperText, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
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

export default function TrueOrFalse(props){
    const { values, handleInputChange, imageHandler, clearImage, choices, setChoices, errors, validate } = props;
    const classes = useStyles();
    return (
        <>
            <Controls.Input
                label="Question : True or False"
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
                        image={values.question.pict||'/static/dist/img/boxed-bg.png'}
                        style={values.question.pict&&{ backgroundSize: 'contain' }||{backgroundSize: 'cover'}}
                    >
                    </CardMedia>
                    {!values.question.pict && <AddPhotoAlternate className={classes.addImg} />}
                </CardActionArea>
                <CardActions>
                    <Button onClick={clearImage} size="small" color="primary" style={{ marginLeft: 'auto' }}>Clear Image</Button>
                </CardActions>
            </Card>
            <FormControl variant="outlined" {...errors.choices && { error: true }}>
                <FormLabel>Choices</FormLabel>
                {errors.choices && <FormHelperText>{errors.choices}</FormHelperText>}
                <RadioGroup
                    onChange={(e) => {
                        setChoices(choices.map((item, i) => {
                            return { ...item, isTrue: i == e.target.value }
                        }))
                    }}
                >
                    {
                        choices.map((item, i) =>
                            <FormControlLabel key={i} className={classes.formControlLabel} value={i} control={<Radio />} label={item.choice} checked={item.isTrue} />
                        )
                    }
                </RadioGroup>
            </FormControl>
            <input
                type="file"
                id="uploadQuestionImage"
                style={{ display: 'none' }}
                onChange={imageHandler}
            />
        </>
    )
}
