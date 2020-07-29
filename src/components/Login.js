import React, { useReducer } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withCookies } from "react-cookie";
import { CircularProgress } from "@material-ui/core";
import {
  START_FETCH,
  FETCH_SUCCESS,
  INPUT_EDIT,
  ERROR_CATCHED,
  TOGGLE_MODE,
} from "./actionTypes";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  span: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "teal",
  },
  spanError: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "fucshia",
  },
}));

const initialState = {
  isLoading: false,
  isLoginView: true,
  error: "",
  credentialLog: {
    username: "",
    password: "",
  },
  credentialReg: {
    email: "",
    password: "",
  },
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case START_FETCH: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case ERROR_CATCHED:
      return {
        ...state,
        error: "Email or Password is not correct",
        isLoading: false,
      };
    case INPUT_EDIT:
      return {
        ...state,
        [action.inputName]: action.payload,
        error: "",
      };
    case TOGGLE_MODE:
      return {
        ...state,
        isLoginView: !state.isLoginView,
      };
    default:
      return state;
  }
};

const Login = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const inputChangedLog = () => (event) => {
    const cred = state.credentialLog;
    cred[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: "state.credentialLog",
      payload: cred,
    });
  };

  const inputChangedReg = () => (event) => {
    const cred = state.credentialReg;
    cred[event.target.name] = event.target.value;
    dispatch({
      type: INPUT_EDIT,
      inputName: "state.credentialReg",
      payload: cred,
    });
  };

  const login = async (event) => {
    event.preventDefault();
    if (state.isLoginView) {
      try {
        dispatch({ type: START_FETCH });
        const res = await Axios.post(
          "http://0.0.0.0:8080/authen/",
          state.credentialLog,
          { headers: { "Content-Type": "application/json" } }
        );
        props.cookies.set("current-token", res.data.token);
        res.data.token
          ? (window.location.href = "/profiles")
          : (window.location.href = "/");
        dispatch({ type: FETCH_SUCCESS });
      } catch (error) {
        dispatch({ type: ERROR_CATCHED });
      }
    } else {
      try {
        dispatch({ type: START_FETCH });
        const res = await Axios.post(
          "http://0.0.0.0:8080/api/user/create/",
          state.credentialReg,
          { headers: { "Content-Type": "application/json" } }
        );
        props.cookies.set("current-token", res.data.token);
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: TOGGLE_MODE });
      } catch (error) {
        dispatch({ type: ERROR_CATCHED });
      }
    }
  };

  const toggleView = () => {
    dispatch({ type: TOGGLE_MODE });
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={login}>
        <div className={classes.paper}>
          {state.isLoading && <CircularProgress />}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {state.isLoginView ? "Login" : "Register"}
          </Typography>
          {state.isLoginView ? (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="username"
              value={state.credentialLog.username}
              onChange={inputChangedLog()}
              autoFocus
            />
          ) : (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={state.credentialReg.email}
              onChange={inputChangedReg()}
              autoFocus
            />
          )}
          {state.isLoginView ? (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="password"
              type="password"
              name="password"
              value={state.credentialLog.password}
              onChange={inputChangedLog()}
              autoFocus
            />
          ) : (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="password"
              type="password"
              name="password"
              value={state.credentialReg.password}
              onChange={inputChangedReg()}
              autoFocus
            />
          )}
          <span className={classes.span}>{state.error}</span>
          {state.isLoginView ? (
            !state.credentialLog.username || !state.credentialLog.password ? (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                disabled
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            ) : (
              <Button
                className={classes.submit}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            )
          ) : !state.credentialReg.email || !state.credentialReg.password ? (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              disabled
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          ) : (
            <Button
              className={classes.submit}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          )}
          <span onClick={() => toggleView()} className={classes.span}>
            {state.isLoginView ? "Create Account" : "Back to Login"}
          </span>
        </div>
      </form>
    </Container>
  );
};

export default withCookies(Login);
