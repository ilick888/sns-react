import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";
import { withCookies } from "react-cookie";

export const ApiContext = createContext();

const ApiContextProvider = (props) => {
  const token = props.cookies.get("current-token");
  const [profile, setProfile] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [editedProfile, setEditedProfile] = useState({ id: "", nickName: "" });
  const [askList, setAskList] = useState([]);
  const [askListFull, setAskListFull] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [cover, setCover] = useState([]);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const resmy = await Axios.get(
          "http://0.0.0.0:8080/api/user/myprofile",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const res = await Axios.get(
          "http://0.0.0.0:8080/api/user/create/approval",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        resmy.data[0] && setProfile(res.data[0]);
        resmy.data[0] &&
          setEditedProfile({
            id: res.data[0].id,
            nickName: res.data[0].nickName,
          });
        resmy.data[0] &&
          setAskList(
            res.data.filter((ask) => {
              return res.data[0].userPro === ask.askTo;
            })
          );
        setAskListFull(res.data);
      } catch (error) {
        console.log("Error");
      }
    };

    const getProfile = async () => {
      try {
        const res = await Axios.get("http://0.0.0.0:8080/api/user/profile", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProfiles(res.data);
      } catch (error) {
        console.log("Error");
      }
    };

    const getInbox = async () => {
      try {
        const res = await Axios.get("http://0.0.0.0:8080/api/dm/inbox", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setInbox(res.data);
      } catch (error) {
        console.log("Error");
      }
    };
    getMyProfile();
    getProfile();
    getInbox();
  }, [token, profile.id]);

  const createProfile = async () => {
    const fdata = new FormData();
    fdata.append("nickName", editedProfile.nickName);
    cover.name && fdata.append("img", cover, cover.name);
    try {
      const res = await Axios.post(
        "http://0.0.0.0:8080/api/user/profile/",
        fdata,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setProfile(res.data);
      setEditedProfile({ id: res.data.id, nickName: res.data.nickName });
    } catch (error) {}
  };

  const deleteProfile = async () => {
    Axios.delete(`http://0.0.0.0:8080/api/user/profile/${profile.id}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    setProfiles(profiles.filter((dev) => dev.id !== profile.id));
    setProfile([]);
    setEditedProfile({ id: "", nickName: "" });
    setAskListFull([]);
  };

  return <div></div>;
};

export default withCookies(ApiContextProvider);
