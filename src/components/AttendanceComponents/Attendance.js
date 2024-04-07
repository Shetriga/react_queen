import { FormControl, InputLabel, MenuItem } from "@mui/material";
import NavBar from "../Navbar";
import classes from "./Attendance.module.css";
import Select from "@mui/material/Select";
import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const Attendance = () => {
  const [staffMember, setStaffMember] = useState("");
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onStaffMemberChanged = (e) => {
    setStaffMember(e.target.value);
  };

  const onConditionChanged = (e) => {
    setCondition(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(staffMember);
    console.log(condition);
    if (staffMember === "" || condition === "") {
      console.log("Invalid inputs");
      return;
    }

    try {
      setIsLoading(true);
      fetch("http://roaaptc.com:3000/attendance/new/attendance", {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: staffMember,
          status: condition,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            setIsLoading(false);
            console.log(response);
            return;
          }
          setIsLoading(false);
          setStaffMember("");
          setCondition("");
          console.log("Done!!!");
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.wrapper}>
        <h1 className={classes.heading}>حضـور وإنصـراف</h1>
        <div className={classes.formDiv}>
          <FormControl className={classes.form} sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-standard-label">
              العامل
            </InputLabel>
            <Select
              value={staffMember}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              onChange={onStaffMemberChanged}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Nada"}>ندى</MenuItem>
              <MenuItem value={"basant"}>بسنت</MenuItem>
              <MenuItem value={"rahma"}>رحمة</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.form} sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-standard-label">
              الحالة
            </InputLabel>
            <Select
              value={condition}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              onChange={onConditionChanged}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"حضور"}>حضور</MenuItem>
              <MenuItem value={"إنصراف"}>إنصراف</MenuItem>
              <MenuItem value={"غياب"}>غياب</MenuItem>
            </Select>
          </FormControl>
          <Stack className={classes.stack} spacing={2} direction="column">
            <Button onClick={onSubmitHandler} variant="contained">
              {isLoading ? (
                <CircularProgress color="inherit" size={30} />
              ) : (
                "Submit"
              )}
            </Button>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Attendance;
