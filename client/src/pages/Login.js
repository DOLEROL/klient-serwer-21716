import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Form, Card } from "semantic-ui-react";

import { LOGIN } from "../GraphQL/Mutations";
import { setAccessToken } from "../accessToken";
import { ME } from "../GraphQL/Queries";

function Login() {
  const [login] = useMutation(LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login({
      variables: {
        email: email,
        password: password,
      },
      update: (cache, { data }) => {
        if (!data) {
          return null;
        }
        cache.writeQuery({
          query: ME,
          data: {
            me: data.login.user,
          },
        });
      },
    })
      .then(({ data }) => {
        const accessToken = data.login.accessToken;
        setAccessToken(accessToken);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card color="orange">
      <Form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "auto", maxHeight: "500px" }}
      >
        <h2>Log in</h2>
        <Form.Field>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Field>

        <Form.Field>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Field>

        <Button type="submit">OK</Button>
      </Form>
    </Card>
  );
}

export default Login;
