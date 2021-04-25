import { Avatar, Card, CardActionArea, CardContent, CardHeader, Collapse, Grid, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId, setQuestion } from '../../redux/actions/questionAction';
import { Bar } from 'react-chartjs-2'

const Insight = (props) => {
    const { assignment, quizId, uid, questions } = props;
    const states = ['assigned', 'in-progress', 'done', 'graded']
    const bloomLevel = [
        { title: 'Remember', level: 1 },
        { title: "Understand", level: 2 },
        { title: "Apply", level: 3 },
        { title: "Analyze", level: 4 },
        { title: "Evaluate", level: 5 },
        { title: "Create", level: 6 }
    ]
    const [assigneesState, setAssigneesState] = useState([])
    const [tempStudentsInDetail, setTempStudentsInDetail] = useState([])
    const [studentsInDetail, setStudentsInDetail] = useState([])
    const [sumQuestion, setSumQuestion] = useState([])
    const [averageBloom, setAverageBloom] = useState([])
    const [dataByQuestion, setDataByQuestion] = useState({})
    const [questionOptions, setQuestionOptions] = useState({
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                usePointStyle: true,
                callbacks: {
                    title: (context) => {
                        return `${context[0].label}: ${context[0].dataset.questions[context[0].dataIndex]}`
                    },
                    label: (context) => {
                        return `Correct: ${context.formattedValue} people.`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                    display: false
                }
            }
        }
    })
    const [dataByBloom, setDataByBloom] = useState({})
    const [bloomOptions, setBloomOptions] = useState({
        plugins: {
            legend: {
                display: false
            },
            tooltip:{
                callbacks:{
                    label: (context)=>{
                        return `Correct: ${context.formattedValue}%`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                }
            }
        }
    })


    useEffect(() => {
        props.fetchQuestionByQuizId(quizId, uid)
        setAssigneesState(states.map(state => ({
            title: state === 'assigned' ? 'Assigned' : (state === 'done' ? 'Turned in' : (state === 'graded' ? 'Graded' : 'In progress')),
            length: assignment.assignees.filter(assignee => assignee.status === state).length,
            isExpand: false,
            students: assignment.assignees.filter(assignee => assignee.status === state).map(assignee => ({
                email: assignee.studentId.email,
                familyName: assignee.studentId.familyName,
                firstName: assignee.studentId.firstName,
                photoUrl: assignee.studentId.photoUrl.substring(0, 2) == "//" ? "https:" + assignee.studentId.photoUrl : assignee.studentId.photoUrl
            }))
        }))
        )
    }, []);

    useEffect(() => {
        if (questions) {
            setTempStudentsInDetail(assignment.assignees.map(assignee => ({
                email: assignee.studentId.email,
                familyName: assignee.studentId.familyName,
                firstName: assignee.studentId.firstName,
                photoUrl: assignee.studentId.photoUrl.substring(0, 2) == "//" ? "https:" + assignee.studentId.photoUrl : assignee.studentId.photoUrl,
                questionDetails: questions.map(question => ({
                    id: question._id,
                    title: question.question.title,
                    isTrue: assignee.historyId?.questions.filter(q => q.questionId == question._id)[0].score || 0
                })),
                bloomDetails: bloomLevel.map(bloom => ({
                    title: bloom.title,
                    questions: questions.filter(question => question.objectiveId.some(obj => obj.bloomLevel == bloom.level)).map(question => ({
                        id: question._id,
                        title: question.question.title,
                        isTrue: assignee.historyId?.questions.filter(q => q.questionId == question._id)[0].score || 0
                    }))
                }))
            }))
            )
        }
    }, [questions])

    useEffect(() => {
        if (tempStudentsInDetail) {
            setStudentsInDetail(tempStudentsInDetail.map(detail => ({
                ...detail,
                bloomDetails: detail.bloomDetails.map(bloom => ({ ...bloom, average: bloom.questions.reduce((prev, cur) => (prev + cur.isTrue), 0) / bloom.questions.length * 100 || 0 }))
            }))
            );
        }
    }, [tempStudentsInDetail])

    useEffect(() => {
        if (studentsInDetail.length) {
            const allBloom = studentsInDetail.map(student => student.bloomDetails.map(bloom => bloom.average));
            const sumBloom = []
            allBloom.forEach(sub => {
                sub.forEach((num, idx) => {
                    if (sumBloom[idx]) sumBloom[idx] += num;
                    else sumBloom[idx] = num;
                })
            })
            setAverageBloom(sumBloom.map(sum => sum / allBloom.length))

            const allQuestion = studentsInDetail.map(student => student.questionDetails.map(question => ({ isTrue: question.isTrue, title: question.title })));
            const tempSumQuestion = []
            allQuestion.forEach(sub => {
                sub.forEach((data, idx) => {
                    if (tempSumQuestion[idx]) tempSumQuestion[idx].sum += data.isTrue;
                    else tempSumQuestion[idx] = { sum: data.isTrue, title: data.title };
                })
            })
            setSumQuestion(tempSumQuestion)
        }
    }, [studentsInDetail])

    useEffect(()=>{
        if(averageBloom){
            const tempDataByBloom = {
                labels: bloomLevel.map(bloom => bloom.title),
                datasets: [
                    {
                        data: averageBloom,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
            setDataByBloom(tempDataByBloom)
        }
    },[averageBloom])

    useEffect(()=>{
        if(sumQuestion){
            const tempDataByQuestion = {
                labels: sumQuestion.map((question, idx) => `Q${idx + 1}`),
                datasets: [
                    {
                        data: sumQuestion.map(question => question.sum),
                        questions: sumQuestion.map(question => question.title),
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
            setDataByQuestion(tempDataByQuestion)
        }
    },[sumQuestion])

    const handleChange = (idx) => {
        if (idx == -1) {
            const tempDataByQuestion = {
                labels: sumQuestion.map((question, idx) => `Q${idx + 1}`),
                datasets: [
                    {
                        data: sumQuestion.map(question => question.sum),
                        questions: sumQuestion.map(question => question.title),
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
            setDataByQuestion(tempDataByQuestion)
            setQuestionOptions({
                ...questionOptions,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        usePointStyle: true,
                        callbacks: {
                            title: (context) => {
                                return `${context[0].label}: ${context[0].dataset.questions[context[0].dataIndex]}`
                            },
                            label: (context) => {
                                return `Correct: ${context.formattedValue} people.`
                            }
                        }
                    }
                },
            })

            const tempDataByBloom = {
                labels: bloomLevel.map(bloom => bloom.title),
                datasets: [
                    {
                        data: averageBloom,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
            setDataByBloom(tempDataByBloom)
        } else {
            const questionDetails = studentsInDetail[idx].questionDetails
            const tempDataByQuestion = {
                labels: questionDetails.map((quesion, idx) => `Q${idx + 1}`),
                datasets: [
                    {
                        data: questionDetails.map(question => 1),
                        questions: questionDetails.map(question => question.title),
                        isCorrect: questionDetails.map(question => question.isTrue),
                        backgroundColor: questionDetails.map(question => question.isTrue ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
                        borderColor: questionDetails.map(question => question.isTrue ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                        borderWidth: 1
                    }
                ]
            }
            setDataByQuestion(tempDataByQuestion)
            setQuestionOptions({
                ...questionOptions,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        usePointStyle: true,
                        callbacks: {
                            title: (context) => {
                                return context[0].dataset.questions[context[0].dataIndex]
                            },
                            label: (context) => {
                                return context.dataset.isCorrect[context.dataIndex]?'Correct':'Incorrect'
                            }
                        }
                    }
                }
            })

            const bloomDetails = studentsInDetail[idx].bloomDetails
            const tempDataByBloom = {
                labels: bloomLevel.map(bloom => bloom.title),
                datasets: [
                    {
                        data: bloomDetails.map(bloom => bloom.average),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            }
            setDataByBloom(tempDataByBloom)
        }
    }

    return (
        assigneesState && studentsInDetail && sumQuestion && averageBloom ?
            <>
                <Grid container spacing={2}>
                    {assigneesState && assigneesState.map((assignee, idx) =>
                        <Grid item xs={12} sm={24 / assigneesState.length} md={12 / assigneesState.length} key={idx}>
                            <Card variant="outlined">
                                <CardActionArea onClick={() => {
                                    const tempExpanded = assigneesState.map(assignee => ({ ...assignee, isExpand: false }))
                                    tempExpanded[idx].isExpand = Boolean(assignee.length) && !assigneesState[idx].isExpand;
                                    setAssigneesState(tempExpanded)
                                }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar>
                                                {assignee.length}
                                            </Avatar>
                                        }
                                        title={assignee.title}
                                    />
                                </CardActionArea>
                                <Collapse in={assignee.isExpand} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <List dense>
                                            {assignee.students.map((student, idx) =>
                                                <ListItem key={idx}>
                                                    <ListItemAvatar>
                                                        <Avatar alt={`${student.firstName} ${student.familyName}`} src={student.photoUrl} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={`${student.firstName} ${student.familyName}`}
                                                    />
                                                </ListItem>
                                            )
                                            }
                                        </List>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>
                    )}
                </Grid>
                {studentsInDetail &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <List dense>
                                <ListItem button onClick={() => handleChange(-1)}>
                                    <ListItemAvatar>
                                        <Avatar>S</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="SUMMARY" />
                                </ListItem>
                                {studentsInDetail.map((student, idx) =>
                                    <ListItem key={idx} button onClick={() => handleChange(idx)}>
                                        <ListItemAvatar>
                                            <Avatar alt={`${student.firstName} ${student.familyName}`} src={student.photoUrl} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${student.firstName} ${student.familyName}`}
                                        />
                                    </ListItem>
                                )
                                }
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Bar data={dataByQuestion} options={questionOptions} />
                            <Bar data={dataByBloom} options={bloomOptions} />
                        </Grid>
                    </Grid>

                }
            </>
            :
            <></>
    )
}

const mapStateToProps = state => {
    return {
        questions: state.questionReducer.questions,
        uid: state.authReducer.uid
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestionByQuizId: bindActionCreators(fetchQuestionByQuizId, dispatch),
        setQuestion: bindActionCreators(setQuestion, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withToastManager
)(Insight)
