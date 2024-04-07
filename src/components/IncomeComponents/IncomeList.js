import { useEffect, useState } from "react";
import NavBar from "../Navbar";
import Form from "react-bootstrap/Form";
import SellingServicesList from "../ServicesComponents/SellingServicesList";
import classes from "./IncomeList.module.css";
import SellingProductList from "../SellingProduct/SellingProductList";

let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

today = mm + "/" + dd + "/" + yyyy;

const IncomeList = () => {
  const [incomeDate, setIncomeDate] = useState(today);

  // useEffect(() => {
  //   setIncomeDate(today);
  // }, []);

  const onDateChangeHandler = (event) => {
    const [year, month, day] = event.target.value.split("-");
    setIncomeDate(`${month}/${day}/${year}`);
  };

  return (
    <>
      <NavBar />
      <Form.Control
        className={classes.datePicker}
        type="date"
        onChange={onDateChangeHandler}
      />
      <SellingServicesList isIncomeReport={true} incomeDate={incomeDate} />
      <SellingProductList isIncomeReport={true} incomeDate={incomeDate} />
    </>
  );
};

export default IncomeList;
