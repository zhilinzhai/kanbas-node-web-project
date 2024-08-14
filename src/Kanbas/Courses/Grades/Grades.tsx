import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Container, Row, Col, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaFileImport, FaFileExport } from 'react-icons/fa';
import { TbFilterSearch } from 'react-icons/tb';
import { IoSettingsSharp } from 'react-icons/io5';
import { BsSearch } from 'react-icons/bs';
import '../../styles.css';

import { useParams } from 'react-router';

import { grades,enrollments,users,assignments } from '../../Database';

export default function Grades() {
    const {cid} = useParams();
    const currentCourseAssignments = assignments.filter(a => a.course == cid)
    const enrolledUsersId = enrollments.filter(e => e.course === cid).map(e => e.user);
    const enrolledUsers = users.filter(u => enrolledUsersId.includes(u._id));
    const userGrades = grades.filter(g => enrolledUsersId.includes(g.student));
    const updatedUsers = enrolledUsers.map(user => {
        const currUserGrade = userGrades.filter(g => g.student === user._id);
    
        const assignmentGrades = currUserGrade.reduce((acc, grade) => {
            acc[grade.assignment] = grade.grade;
            return acc;
        }, {} as { [key: string]: any });
    
        return {
            ...user,
            assignment_grades: assignmentGrades,
        };
    });

    return (
        <Container fluid className="p-3">
            <Row className="mb-3">
                <Col className="d-flex justify-content-end align-items-center">
                    <Button variant="secondary" className="btn me-2">
                        <FaFileImport /> Import
                    </Button>
                    <Dropdown className="me-2">
                        <Dropdown.Toggle variant="secondary" id="dropdown-export-button">
                            <FaFileExport /> Export
                        </Dropdown.Toggle>
                    </Dropdown>
                    <Button variant="outline-secondary" className="btn">
                        <IoSettingsSharp />
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12} md={5} className="mb-2 mb-md-0">
                    <Form.Group>
                        <Form.Label className="fw-bold">Student Names</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><BsSearch /></InputGroup.Text>
                            <Form.Control type="text" placeholder="Search Students" className="form-control" />
                            <DropdownButton
                                variant="outline-secondary"
                                title=""
                                id="input-group-dropdown-students"
                                className="btn"
                            >
                                <div></div>
                            </DropdownButton>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col xs={12} md={5} className="mb-2 mb-md-0">
                    <Form.Group>
                        <Form.Label className="fw-bold">Assignment Names</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><BsSearch /></InputGroup.Text>
                            <Form.Control type="text" placeholder="Search Assignments" className="form-control" />
                            <DropdownButton
                                variant="outline-secondary"
                                title=""
                                id="input-group-dropdown-assignments"
                                className="btn"
                            >
                                <div></div>
                            </DropdownButton>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col xs={12} className="d-flex justify-content-md-start">
                    <Button variant="secondary" className="btn">
                        <TbFilterSearch /> Apply Filters
                    </Button>
                </Col>
            </Row>

            <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            {
                                currentCourseAssignments.map(ca =>{
                                    return(
                                        <th>{ca._id} <br/> {ca.title} <br />Out of 100</th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
    {/* [
    [
        {
            "_id": "1",
            "student": "121",
            "assignment": "A101",
            "grade": "90"
        },
        {
            "_id": "4",
            "student": "121",
            "assignment": "A102",
            "grade": "92"
        }
    ],
    [
        {
            "_id": "2",
            "student": "122",
            "assignment": "A101",
            "grade": "91"
        },
        {
            "_id": "5",
            "student": "122",
            "assignment": "A102",
            "grade": "91"
        }
    ],
    [
        {
            "_id": "3",
            "student": "123",
            "assignment": "A101",
            "grade": "92"
        },
        {
            "_id": "6",
            "student": "123",
            "assignment": "A102",
            "grade": "90"
        }
    ]
] */}


                        {
                            updatedUsers.map(user => {
                                    return (<tr>
                                        <td className="red-text">{user.username}</td>
                                        {currentCourseAssignments.map(ca =>{
                                            console.log(ca)
                                            return (
                                                <td>
                                                    {user.assignment_grades[ca._id] ? user.assignment_grades[ca._id] : "-"}
                                                </td> 
                                            )
                                        })
                                        }
                                     </tr>)
                                })
                        }
                    </tbody>

                    </Table>
            </div>
            {/* <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>A1 SETUP<br />Out of 100</th>
                            <th>A2 HTML<br />Out of 100</th>
                            <th>A3 CSS<br />Out of 100</th>
                            <th>A4 BOOTSTRAP<br />Out of 100</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="red-text">Jane Adams</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>66.22%</td>
                        </tr>
                        <tr>
                            <td className="red-text">Christina Allen</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>92.18%</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td className="red-text">Sameera Ansari</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td className="red-text">Han Bao</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    defaultValue="88.03%"
                                    className="form-control p-1"
                                />
                            </td>
                            <td>98.99%</td>
                        </tr>
                        <tr>
                            <td className="red-text">Mahi Sai Srinivas Bobbili</td>
                            <td>100%</td>
                            <td>96.67%</td>
                            <td>98.37%</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td className="red-text">Siran Cao</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>100%</td>
                            <td>100%</td>
                        </tr>
                    </tbody>
                </Table>
            </div> */}
        </Container>
    );
}
