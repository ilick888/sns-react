import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Grid } from "@material-ui/core";
import { GoMail } from "react-icons/go";
import { BsFillPeopleFill } from "react-icons/bs";

const Main = () => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <div className="app-profiles"></div>
      </Grid>
      <Grid item xs={4}>
        <div className="app-details"></div>
        <h3 className="title-ask">
          <BsFillPeopleFill className="badge" />
          Approval Request List
        </h3>
        <div className="app-details"></div>
      </Grid>
      <Grid item xs={4}>
        <h3>
          <GoMail className="badge" />
          DM inbox
        </h3>
        <div className="app-dms"></div>
      </Grid>
    </Grid>
  );
};

export default Main;
