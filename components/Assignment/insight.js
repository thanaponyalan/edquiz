import { Avatar, Button, Card, CardActionArea, CardHeader, Chip, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withToastManager } from 'react-toast-notifications';
import { bindActionCreators, compose } from 'redux'
import { fetchQuestionByQuizId, setQuestion } from '../../redux/actions/questionAction';
import { Bar } from 'react-chartjs-2'
import Popup from '../MaterialUI/Popup';
import { API } from '../../constant/ENV';
import { _error_handler } from '../../utils/errorHandler';
import { fetchAssignment } from '../../redux/actions/assignmentAction';

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
            },
            title: {
                text: 'Catagorized by question',
                display: true
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
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `Correct: ${context.formattedValue}%`
                    }
                }
            },
            title: {
                text: `Catagorized by Bloom's Taxonomy`,
                display: true
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
    const [currentIndex, setCurrentIndex] = useState(-1)


    useEffect(() => {
        props.fetchQuestionByQuizId(quizId, uid)
    }, []);

    useEffect(()=>{
        if(assignment){
            setAssigneesState(states.map(state => ({
                title: state === 'assigned' ? 'Assigned' : (state === 'done' ? 'Turned in' : (state === 'graded' ? 'Graded' : 'In progress')),
                length: assignment.assignees.filter(assignee => assignee.status === state).length,
                isExpand: false,
                students: assignment.assignees.filter(assignee => assignee.status === state).map(assignee => ({
                    _id: assignee.studentId._id,
                    email: assignee.studentId.email,
                    familyName: assignee.studentId.familyName,
                    firstName: assignee.studentId.firstName,
                    photoUrl: assignee.studentId.photoUrl.substring(0, 2) == "//" ? "https:" + assignee.studentId.photoUrl : assignee.studentId.photoUrl
                }))
            }))
            )
        }
    }, [assignment])

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
            console.log(studentsInDetail);
            const allBloom = studentsInDetail.filter(student=>assigneesState[0].students.findIndex(thisStudent=>thisStudent.email==student.email)==-1&&assigneesState[1].students.findIndex(thisStudent=>thisStudent.email==student.email)==-1).map(student => student.bloomDetails.map(bloom => bloom.average));
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

    useEffect(() => {
        if (averageBloom) {
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
    }, [averageBloom])

    useEffect(() => {
        if (sumQuestion) {
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
    }, [sumQuestion])

    const handleChange = (idx) => {
        setCurrentIndex(idx)
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
                    },
                    title: {
                        text: 'Catagorized by question',
                        display: true
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
                        data: questionDetails.map(question => assigneesState[0].students.findIndex(student=>student.email==studentsInDetail[idx].email)<0? 1:0),
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
                                return context.dataset.isCorrect[context.dataIndex] ? 'Correct' : 'Incorrect'
                            }
                        }
                    },
                    title: {
                        text: 'Catagorized by question',
                        display: true
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

    const handleExpand=(idx,assignee)=>{
        const tempExpanded = assigneesState.map(assignee => ({ ...assignee, isExpand: false }))
        tempExpanded[idx].isExpand = Boolean(assignee.length) && !assigneesState[idx].isExpand;
        setAssigneesState(tempExpanded)
    }

    const annouceScore=async(userId)=>{
        const payload={
            assignmentId: assignment._id,
            courseId: assignment.classId.gClassId,
            courseWorkId: assignment.courseWorkId,
            state: 'returnAndPatch',
            userId
        }
        props.toastManager.add("Annoucing...",{appearance: 'info', autoDismiss: true})
        try{
            const url=`${API}/assignment`
            const result=await fetch(url,{
                method: 'PUT',
                headers:{
                    authorization: uid
                },
                body: JSON.stringify(payload)
            })
            const res=await result.json();
            if(res.statusCode==200||res.statusCode==204){
                props.setQuestion({data:{payload: null}})
                props.fetchQuestionByQuizId(quizId, uid)
                props.fetchAssignment(uid,props.role)
                props.toastManager.add("Annouced",{appearance:'success', autoDismiss:true});
            }
        }catch(err){
            _error_handler(null,err,null);
            console.log(err);
        }
    }
    
    return (
        assigneesState && studentsInDetail && sumQuestion && averageBloom ?
            <>
                <Grid container spacing={2}>
                    {assigneesState && assigneesState.map((assignee, idx) =>
                        <Grid item xs={12} sm={24 / assigneesState.length} md={12 / assigneesState.length} key={idx}>
                            <Card variant="outlined">
                                <CardActionArea onClick={()=>handleExpand(idx,assignee)}>
                                    <CardHeader
                                        avatar={
                                            <Avatar>
                                                {assignee.length}
                                            </Avatar>
                                        }
                                        title={assignee.title}
                                    />
                                </CardActionArea>
                                <Popup maxWidth="sm" fullWidth open={assignee.isExpand} handleClose={()=>handleExpand(idx,assignee)} title={assignee.title} popupAction={
                                    assignee.title==='Turned in'&&
                                    <Button variant="outlined" onClick={()=>{
                                        handleExpand(idx,assignee);
                                        annouceScore(assignee.students.map(student=>({
                                            email: student.email, 
                                            _id: student._id,
                                            score: studentsInDetail[studentsInDetail.findIndex(thisStudent=>thisStudent.email==student.email)]?.questionDetails?.reduce((prev,curr)=>(prev+curr.isTrue),0)
                                        })))
                                    }}>
                                        Annouce score
                                    </Button>
                                }>
                                        <List dense>
                                            {assignee.students.map((student, index) =>
                                                {
                                                    const questionDetails = studentsInDetail[studentsInDetail.findIndex(thisStudent=>thisStudent.email==student.email)]?.questionDetails;
                                                    return( 
                                                        <ListItem key={index} button onClick={()=>{handleExpand(idx,assignee);handleChange(studentsInDetail.findIndex(thisStudent=>thisStudent.email==student.email))}}>
                                                            <ListItemAvatar>
                                                                <Avatar alt={`${student.firstName} ${student.familyName}`} src={student.photoUrl} />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={`${student.firstName} ${student.familyName}`}
                                                            />
                                                            {assignee.title!='Assigned'&&assignee.title!='In progress'&&
                                                                <ListItemSecondaryAction>
                                                                    <Chip label={`${questionDetails?.reduce((prev,curr)=>(prev+curr.isTrue),0)}/${questionDetails?.length}`}/>
                                                                </ListItemSecondaryAction>
                                                            }
                                                        </ListItem>
                                                    )
                                                }    
                                            )
                                            }
                                        </List>
                                </Popup>
                                {/* <Collapse in={assignee.isExpand} timeout="auto" unmountOnExit>
                                    <CardContent>
                                    </CardContent>
                                </Collapse> */}
                            </Card>
                        </Grid>
                    )}
                </Grid>
                {studentsInDetail &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <List dense>
                                <ListItem button onClick={() => handleChange(-1)} style={{backgroundColor: currentIndex==-1?'grey':'', borderRadius: '25px', color: currentIndex==-1?'white':'black'}}>
                                    <ListItemAvatar>
                                        <Avatar>S</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="SUMMARY" />
                                </ListItem>
                                {studentsInDetail.map((student, idx) =>
                                    <ListItem key={idx} button onClick={() => handleChange(idx)} style={{backgroundColor: currentIndex==idx?'grey':'', borderRadius: '25px', color: currentIndex==idx?'white':'black'}}>
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
        uid: state.authReducer.uid,
        role: state.authReducer.role
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchQuestionByQuizId: bindActionCreators(fetchQuestionByQuizId, dispatch),
        setQuestion: bindActionCreators(setQuestion, dispatch),
        fetchAssignment: bindActionCreators(fetchAssignment, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withToastManager
)(Insight)
