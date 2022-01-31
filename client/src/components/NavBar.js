import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { Menu } from "semantic-ui-react";

// graphql
import { ME } from "../GraphQL/Queries";
import { LOGOUT } from "../GraphQL/Mutations";

// access token
import { setAccessToken } from "../accessToken";

function NavBar() {
  const [logout] = useMutation(LOGOUT);
  const { loading, data } = useQuery(ME);

  const location = useLocation();
  const navigate = useNavigate();

  let body = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = (
      <>
        <Menu.Item>logged in as: {data.me.email}</Menu.Item>
        <Link to="/">
          <Menu.Item name="home" active={location.pathname === "/"} />
        </Link>
        <Link to="/todo">
          <Menu.Item name="ToDo" active={location.pathname === "/todo"} />
        </Link>
        <Menu.Item
          name="logout"
          onClick={async () => {
            setAccessToken("");
            await logout({
              update: (cache, { data }) => {
                if (!data) {
                  return null;
                }
                cache.writeQuery({
                  query: ME,
                  data: {
                    me: null,
                  },
                });
              },
            });
            navigate("/");
          }}
        />
      </>
    );
  } else {
    body = (
      <Menu.Menu>
        <Link to="/">
          <Menu.Item name="home" active={location.pathname === "/"} />
        </Link>
        <Link to="/login">
          <Menu.Item name="login" active={location.pathname === "/login"} />
        </Link>
        <Link to="/register">
          <Menu.Item name="register" active={location.pathname === "/register"} />
        </Link>
      </Menu.Menu>
    );
  }

  return (
    <Menu pointing secondary vertical>
      {body}
    </Menu>
  );
}

export default NavBar;
