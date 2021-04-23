import { FormLabel } from '@material-ui/core';
import React from 'react'
import Controls from '../MaterialUI/controls/Controls'

export default function QuestionParameters(props) {
    const {
        values,
        setQuizzes,
        quizzes,
        quizOptions,
        setCourse,
        courses,
        courseOptions,
        disabledCourse,
        setDisabledCourse,
        objectives,
        setObjectives,
        objectiveOptions,
        setObjectiveOptions,
        errors,
        validate,
        previewMode
    } = props;
    return (
        <>
            <FormLabel component="legend">Question Meta</FormLabel>
            <Controls.AutoComplete
                disabled={previewMode}
                multiple
                name="quizzes"
                label="Quizzes"
                id="quizzesSelector-quizzes.title"
                value={quizzes}
                handleInputChange={(event, newValue) => {
                    setQuizzes(newValue.map(value=>({id:value.id?value.id:0, title:value.inputValue?value.inputValue:value.title})))
                }}
                options={quizOptions}
                freeSolo
                createAble
            />
            {/* <Controls.AutoComplete
                disabled={previewMode}
                name="test"
                label="Test"
                id="testSelector-quiz.title"
                value={values.quiz}
                handleInputChange={(event, newValue) => {
                    if (!newValue) {
                        setQuiz({
                            title: 'Not In Test',
                            id: -1
                        })
                        setDisabledCourse(false);
                        setCourse({
                            id: -1,
                            title: 'No Course Selected'
                        })
                        setObjectives([])
                        setObjectiveOptions([])
                    } else if (newValue.inputValue) {
                        setQuiz({
                            title: newValue.inputValue,
                            id: 0
                        })
                    } else {
                        setQuiz({
                            ...newValue
                        })
                        if (newValue.id == -1) {
                            setDisabledCourse(false);
                            setCourse({
                                id: -1,
                                title: 'No Course Selected'
                            })
                            setObjectives([])
                            setObjectiveOptions([])
                        } else {
                            const { _id, courseName } = quizzes.filter(quiz => quiz._id == newValue.id)[0].courseId;
                            setCourse({ id: _id, title: courseName })
                            setDisabledCourse(true)
                            setObjectives([])
                            setObjectiveOptions(courses.filter(course => course._id == _id)[0].objectives.map((item, idx) => {
                                return { id: item._id, title: item.objective }
                            }));
                        }
                    }
                }}
                options={[{ id: -1, title: 'Not In Test' }, ...quizOptions]}
                freeSolo
                createAble
            /> */}
            <Controls.AutoComplete
                error={errors.course}
                disabled={disabledCourse||previewMode}
                name="course"
                label="Course"
                id="courseSelector-course.title"
                value={values.course}
                handleInputChange={(event, newValue) => {
                    if (!newValue) {
                        setCourse({
                            id: -1,
                            title: 'No Course Selected'
                        })
                        setObjectives([])
                        setObjectiveOptions([])
                    } else {
                        setCourse({
                            ...newValue
                        })
                        validate({ course: newValue })
                        setObjectives([])
                        if (newValue.id == -1) {
                            setObjectiveOptions([])
                        } else {
                            setObjectiveOptions(courses.filter(course => course._id == newValue.id)[0].objectives.map((item, idx) => {
                                return { id: item._id, title: item.objective }
                            }));
                        }
                    }
                }}
                options={[{ id: -1, title: 'No Course Selected' }, ...courseOptions]}
                freeSolo={false}
            />
            <Controls.AutoComplete
                disabled={previewMode}
                error={errors.objectives}
                multiple
                name="objectives"
                label="Objectives"
                id="objectivesSelector-objectives.title"
                value={objectives}
                handleInputChange={(event, newValue) => {
                    setObjectives([
                        ...newValue
                    ])
                    validate({ objectives: [...newValue] })
                }}
                options={objectiveOptions}
                freeSolo={false}
            />
        </>
    )
}
