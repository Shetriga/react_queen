import { useEffect, useState } from "react";
import NavBar from "../Navbar";
import Table from "react-bootstrap/Table";
import classes from "./SellingServicesList.module.css";
import Form from "react-bootstrap/Form";

const SellingServicesList = ({ isIncomeReport, incomeDate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceSales, setServiceSales] = useState([]);
  const [currentServiceSales, setCurrentServiceSales] = useState([]);
  const [listDate, setListDate] = useState("");
  const [filterByDate, setFilterByDate] = useState(false);
  const [dateTotal, setDateTotal] = useState(-1);

  useEffect(() => {
    getServiceSales();
  }, [incomeDate]);

  useEffect(() => {
    calculateDateTotal(currentServiceSales);
  }, [currentServiceSales]);

  const getServiceSales = () => {
    setIsLoading(true);
    fetch("http://roaaptc.com:3000/service/all/sales", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setServiceSales(data.serviceSales);
        setCurrentServiceSales(data.serviceSales);
        if (isIncomeReport) {
          let content = data.serviceSales.filter(
            (s) => s.orderDate === incomeDate
          );
          setCurrentServiceSales(content);
          setIsLoading(false);
          // calculateDateTotal(currentServiceSales);
          // return;
        }
        setIsLoading(false);
        // calculateDateTotal(currentServiceSales);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const calculateDateTotal = (arr) => {
    let sum = 0;
    arr.forEach((ss) => {
      sum += ss.orderTotal;
    });
    setDateTotal(sum);
  };

  const checkboxHandler = (e) => {
    console.log(e.target.checked);
    setFilterByDate(e.target.checked);
    if (e.target.checked && listDate === "") {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      today = mm + "/" + dd + "/" + yyyy;
      setListDate(today);
      setCurrentServiceSales(
        currentServiceSales.filter((ss) => ss.orderDate === today)
      );
    } else if (e.target.checked && listDate !== "") {
      setCurrentServiceSales(
        currentServiceSales.filter((ss) => ss.orderDate === listDate)
      );
    } else {
      setCurrentServiceSales(serviceSales);
      setListDate("");
    }
  };

  const onDateChangedHandler = (e) => {
    console.log(e.target.value);
    const dd = e.target.value.split("-")[2];
    const mm = e.target.value.split("-")[1];
    const yyyy = e.target.value.split("-")[0];
    setListDate(`${mm}/${dd}/${yyyy}`);
    setCurrentServiceSales(
      serviceSales.filter((ss) => ss.orderDate === `${mm}/${dd}/${yyyy}`)
    );
  };

  return (
    <>
      {!isIncomeReport && <NavBar />}
      <div className={classes.wrapper}>
        {!isIncomeReport && !isLoading && (
          <div className={classes.formDiv}>
            <Form.Group>
              <Form.Check className={classes.datePickerFlex} type={"checkbox"}>
                <Form.Check.Input
                  onClick={checkboxHandler}
                  type={"checkbox"}
                  defaultChecked={false}
                />
                <Form.Check.Label className={classes.formLabel}>
                  عرض تاريخ معين
                </Form.Check.Label>
              </Form.Check>
              {filterByDate && (
                <Form.Control
                  onChange={onDateChangedHandler}
                  className={classes.datePicker}
                  type="date"
                />
              )}
            </Form.Group>
          </div>
        )}
        {!isLoading && dateTotal > 0 && (
          <h1 style={{ textAlign: "center" }}>Total Income: {dateTotal}</h1>
        )}
        {isLoading && <h3 style={{ textAlign: "center" }}>Loading...</h3>}
        {!isLoading && currentServiceSales.length === 0 && (
          <h3 style={{ textAlign: "center" }}>لا يوجـد خدمات</h3>
        )}
        {!isLoading && isIncomeReport && currentServiceSales.length > 0 && (
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            الخدمات التى تم تقديمها
          </h3>
        )}
        {!isLoading &&
          currentServiceSales.length > 0 &&
          currentServiceSales.map((ps) => {
            return (
              <div className={classes.productSalesInfo} key={ps._id}>
                <h4>- {ps.orderDate}</h4>
                <div className={classes.innerInfo}>
                  <h4>{ps.customerId.name}</h4>
                  <h4>{ps.customerId.phone}</h4>
                  <Table striped bordered hover className={classes.table}>
                    <thead>
                      <tr>
                        <th>الصنـف</th>
                        <th>السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ps.services.map((p) => {
                        return (
                          <>
                            <tr key={p._id}>
                              <td>{p.serviceName}</td>
                              <td>{p.serviceFee}</td>
                            </tr>
                          </>
                        );
                      })}
                      <tr>
                        <td
                          colSpan={4}
                          style={{ fontWeight: "bold", fontSize: "20px" }}
                        >
                          Total: {ps.orderTotal}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  {ps.notes && <h4>ملاحظات: {ps.notes}</h4>}
                </div>
                <hr />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default SellingServicesList;
