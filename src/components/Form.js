import React from 'react';

// importing the default components
import Container from "reactstrap/es/Container";
import Form from "reactstrap/es/Form";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import FormGroup from "reactstrap/es/FormGroup";
import Input from "reactstrap/es/Input";
import Label from "reactstrap/es/Label";
import Button from "reactstrap/es/Button";

/**
 * Default class signature.
 */
export default class ApplicationForm extends React.Component {
    /**
     * Default class constructor.
     *
     * @param props
     * @return constructor.
     */
    constructor(props) {
        super(props);
        this.state = {
            id: 7, // here you change the ID according the application form sent by email.
            name: "",
            email: "",
            comments: "",
            token: "",
            phone: "",
            error: "",
            source: window.location.href,
            resume: null,
        };

        // binding the default components functions.
        this.fetchToken = this.fetchToken.bind(this);
        this.mainInputChange = this.mainInputChange.bind(this);
        this.submitProcess = this.submitProcess.bind(this);
        this._mountResume = this._mountResume.bind(this);
    }

    /**
     * Default react life cycle component.
     *
     * @return void
     */
    componentWillMount() {
        const { id = null } = this.state;
        this.fetchToken(id);
        // setting interval of 5 minutes to refresh the token
        this.interval = setInterval(() => this.fetchToken(id), 300000);
    }

    /**
     * Default react life cycle function.
     *
     * @return void
     */
    componentWillUnmount() {
        // removing the interval after the component destruction.
        clearInterval(this.interval);
    }

    /**
     * Start the submit process.
     *
     * @param event
     * @return void
     */
    submitProcess(event) {
        event.preventDefault();
        const {
            name = "",
            comments = "",
            source = window.location.href,
            phone = "",
            email = "",
            token = "",
            id = null,
            resume = null,
        } = this.state;
        this.setState({ error: "" });

        if (token === "") this.fetchToken(id);

        if (email === "" || name === "" || resume === "") {
            this.setState({ error: "Fill all the fileds" });
        } else {
            // collect the inputs data
            const sendData = JSON.stringify({
                name,
                comments,
                source,
                phone,
                email,
                token,
                posting: id,
                resume,
            });
            const me = this;

            // mount the url with the proxy
            const myUrl = 'https://app.applybyapi.com/apply/';
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const xhr = new XMLHttpRequest();


            xhr.addEventListener("load", function () {
                let { responseText = "" } = this;

                console.log(this);
                if (responseText !== "") {
                    responseText = JSON.parse(responseText);
                    // spread the response text in the state.
                    me.setState({ ...responseText });
                }
            });
            // Or post, etc
            xhr.open("POST", proxy + myUrl);


            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Postman-Token", "e11ed90e-b897-4d3a-a112-2ff2b6475c12,dde1fca5-917b-43d2-b70e-c6d0c132476b");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(sendData);
        }
    }

    /**
     * Update the state of the inputs.
     *
     * @param event
     * @return void
     */
    mainInputChange(event) {
        let files = null;
        if (event.target) {
            files = event.target.files;
        } else if (event.dataTransfer) {
            files = event.dataTransfer.files;
        }
        if (!files) this.setState({ [event.target.name]: event.target.value });
        else this._mountResume(files[0]);
    }

    /**
     * Create file data.
     *
     * @param file
     * @private
     */
    _mountResume(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                resume: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }

    /**
     * Fetch Token API.
     *
     * @param posting
     * @return void
     */
    fetchToken(posting = null) {
        // mount the api data.
        const data = JSON.stringify({
            "posting": 7
        });
        const me = this;

        // mount the url with the proxy
        const myUrl = 'https://app.applybyapi.com/gentoken/';
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const xhr = new XMLHttpRequest();


        xhr.addEventListener("load", function () {
            let { responseText = "" } = this;
            if (responseText !== "") {
                responseText = JSON.parse(responseText);
                // spread the response text in the state.
                me.setState({ ...responseText });
            }
        });
        // Or post, etc
        xhr.open("POST", proxy + myUrl);


        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "e11ed90e-b897-4d3a-a112-2ff2b6475c12,dde1fca5-917b-43d2-b70e-c6d0c132476b");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }

    /**
     * Default render function.
     *
     * @return {*}
     */
    render() {
        const {
            name = "",
            comments = "",
            source = window.location.href,
            phone = "",
            email = "",
            error = "",
        } = this.state;

        return (
            <Container>
                <h3>
                    Welcome to Rebilly application form.
                </h3>
                <Form
                    onSubmit={event => this.submitProcess(event)}
                >
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'name'}>
                                    Name
                                </Label>
                                <Input
                                    placeholder={'Your full name.'}
                                    type={'text'}
                                    name={'name'}
                                    id={'name'}
                                    value={name}
                                    onChange={event => this.mainInputChange(event)}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'email'}>
                                    Email
                                </Label>
                                <Input
                                    type={'text'}
                                    name={'email'}
                                    id={'email'}
                                    value={email}
                                    onChange={event => this.mainInputChange(event)}
                                    placeholder={"your@email.com"}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'resume'}>
                                    Resume
                                </Label>
                                <Input
                                    type={'file'}
                                    name={'resume'}
                                    id={'resume'}
                                    onChange={event => this.mainInputChange(event)}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'phone'}>
                                    Phone
                                </Label>
                                <Input
                                    type={'text'}
                                    name={'phone'}
                                    id={'phone'}
                                    value={phone}
                                    placeholder={"(xx) xxxx-xxx"}
                                    onChange={event => this.mainInputChange(event)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'source'}>
                                    Source
                                </Label>
                                <Input
                                    type={'text'}
                                    name={'source'}
                                    id={'source'}
                                    value={source}
                                    placeholder={'Source of submission.'}
                                    onChange={event => this.mainInputChange(event)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for={'comments'}>
                                    Comments
                                </Label>
                                <Input
                                    type={'textarea'}
                                    name={'comments'}
                                    id={'comments'}
                                    value={comments}
                                    onChange={event => this.mainInputChange(event)}
                                    placeholder={'Type a nice comment.'}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Button
                                    color={'primary'}
                                >
                                    Submit
                                </Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col>
                        <p>
                            {error}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <p>
                        <a href={'https://github.com/meshsias'}>Fabio William Conceição</a>
                    </p>
                </Row>
            </Container>
        );
    }
}