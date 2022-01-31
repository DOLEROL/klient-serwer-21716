import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import validator from "validator";
import { Button, Form, Message, Input, Card } from "semantic-ui-react";

import { REGISTER } from "../GraphQL/Mutations";

function Signup() {
  //form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // form data validation
  const [equal, setEqual] = useState(true);
  const [strongPassword, setStrongPassword] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [errorAccount, setErrorAccount] = useState(true);

  // mutation register
  const [register] = useMutation(REGISTER);

  // redirect user
  const navigate = useNavigate();

  const sendForm = async () => {
    // data validation
    let isequal = validator.equals(password, confirmPassword);
    let isstrong = validator.isStrongPassword(password);
    let isemail = validator.isEmail(email);

    if (isequal && isstrong && isemail) {
      register({
        variables: {
          email: email,
          password: password,
        },
      })
        .then(({ data }) => {
          navigate("/");
        })
        .catch((err) => {
          console.error(err)
          setErrorAccount(false);
        });
    }

    setEqual(isequal);
    setStrongPassword(isstrong);
    setValidEmail(isemail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendForm();
  };

  return (
    <Card color="orange">
      <Form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "auto" }}
      >
        <h2>Register</h2>
        <Form.Field>
          <label htmlFor="email">Email</label>
          <Input
            placeholder="Email"
            size="small"
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Field>
        {validEmail ? null : (
          <Message color="red" header="Email is not valid" />
        )}
        <Form.Field>
          <label color="teal" htmlFor="password">
            Password
          </label>
          <Input
            placeholder="Password"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Field>

        <Form.Field>
          <label color="teal" htmlFor="confirm password">
            Confirm Password
          </label>
          <Input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Field>

        {strongPassword ? null : (
          <Message color="red">
            <Message.Header>Password is not strong enaugh:</Message.Header>
            <Message.Content>
              <ul>
                <li>min length: 8</li>
                <li>max length: 20</li>
                {equal ? null : <li>passwords must match</li>}
              </ul>
            </Message.Content>
          </Message>
        )}
        {errorAccount ? null : (
          <Message color="red">
            <Message.Header>Error while creating the account</Message.Header>
          </Message>
        )}

        <Button type="submit">OK</Button>
      </Form>
    </Card>
  );
}

export default Signup;
