import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Card } from "semantic-ui-react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { ADDTODO, UPDATETODO } from "../GraphQL/Mutations";
import { TODO } from "../GraphQL/Queries";

function ToDo() {
  const [todo, setTodo] = useState("");
  const { data, refetch } = useQuery(TODO);
  const [addToDo] = useMutation(ADDTODO);
  const [updateToDo] = useMutation(UPDATETODO);

  const handleSubmit = async (e) => {
    e.preventDefault();

    addToDo({
      variables: {
        todo,
      },
    }).then(() => {
      refetch();
      setTodo("");
    });
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={6}>
          <Card color="orange">
            <Form
              onSubmit={handleSubmit}
              style={{ maxWidth: "400px", margin: "auto", maxHeight: "500px" }}
            >
              <h2>ToDo</h2>
              <Form.Field>
                <label htmlFor="Zadanko">Zadanko</label>
                <input
                  type="text"
                  name="Zadanko"
                  required
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                />
              </Form.Field>
              <Button type="submit">OK</Button>
            </Form>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card color="orange">
            {data && data.toDo ? (
              data.toDo.map(({ todo, state }) => {
                if (state === "todo")
                  return (
                    <Grid container spacing={1} key={todo}>
                      <Grid item xs={2} style={{ textAlign: "center" }}>
                        🌼
                      </Grid>
                      <Grid item xs={4}>
                        {todo}
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() =>
                            updateToDo({
                              variables: {
                                todo,
                              },
                            }).then(() => {
                              refetch();
                            })
                          }
                        >
                          OK
                        </Button>
                        <Button
                          onClick={() =>
                            updateToDo({
                              variables: {
                                todo,
                                option: "DEL",
                              },
                            }).then(() => {
                              refetch();
                            })
                          }
                        >
                          DEL
                        </Button>
                      </Grid>
                    </Grid>
                  );
                return null;
              })
            ) : (
              <div>🌼 null</div>
            )}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card color="orange">
            {data && data.toDo ? (
              data.toDo.map(({ todo, state }) => {
                if (state === "done")
                  return (
                    <Grid container spacing={1} key={todo}>
                      <Grid item xs={2} style={{ textAlign: "center" }}>
                        🐝
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ textDecoration: "line-through" }}
                      >
                        {todo}
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() =>
                            updateToDo({
                              variables: {
                                todo,
                                option: "DEL",
                              },
                            }).then(() => {
                              refetch();
                            })
                          }
                        >
                          DEL
                        </Button>
                        <Button
                          onClick={() =>
                            updateToDo({
                              variables: {
                                todo,
                                option: "RES",
                              },
                            }).then(() => {
                              refetch();
                            })
                          }
                        >
                          RES
                        </Button>
                      </Grid>
                    </Grid>
                  );
                return null;
              })
            ) : (
              <div>🐝 null</div>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ToDo;
