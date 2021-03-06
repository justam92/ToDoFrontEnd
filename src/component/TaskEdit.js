import React, { Component } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import './../css/component/TaskEdit.css';

import { API_URL } from './constant/ApiConstants';

export default class TaskEdit extends Component {
    constructor(props) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onReject = this.onReject.bind(this);
        this.setName = this.setName.bind(this);
        this.setDeadline = this.setDeadline.bind(this);

        this.state = {
            newTask: props.task
        };
    }

    render() {
        var task = this.props.task;

        return (
            <div className="TaskEditComponent mt-3 pb-3">
                <Row className="ml-0 mr-0 rounded">
                    <Col>
                        <input
                            className="form-control"
                            type="text"
                            placeholder={task.name}
                            onChange={this.setName}
                        />
                    </Col>
                    <Col xs={3}>
                        <DateTime
                            defaultValue={new Date(task.deadline)}
                            dateFormat="YYYY-MM-DD"
                            timeFormat="HH:mm:ss"
                            locale="pl"
                            onChange={this.setDeadline}
                        />
                    </Col>
                    <Col xs={2}>
                        <Col xs={6} className="fakeSpan">
                            <span className="confirmButton" onClick={this.onConfirm}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                        </Col>
                        <Col xs={6} className="fakeSpan">
                            <span className="rejectButton" onClick={this.onReject}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </Col>
                    </Col>
                </Row>
            </div>
        );
    }

    onConfirm() {
        const {
            task,
            refreshState,
            setIsLoaded
        } = this.props;
        const newTask = this.state.newTask;

        const isNewNameDifferentThanOldName = !!newTask.name && newTask.name !== task.name;
        const isNewDeadlineDifferentThanOldDeadline = !!newTask.deadline && newTask.deadline !== task.name;

        if (isNewNameDifferentThanOldName || isNewDeadlineDifferentThanOldDeadline) {
            setIsLoaded(false);

            fetch(API_URL + "/tasks", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTask)
            }).then(response => {
                refreshState();
            });
        }
    }

    onReject() {
        this.props.setIsEditingState(false);
    }

    setName(event) {
        var newTask = this.state.newTask;
        newTask.name = event.target.value;

        this.setState({
            newTask: newTask
        });
    }

    setDeadline(value) {
        var newTask = this.state.newTask;
        newTask.deadline = value.toDate();

        this.setState({
            newTask: newTask
        });
    }
}