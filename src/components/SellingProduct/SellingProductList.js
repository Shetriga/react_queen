import classes from "./SellingProductList.module.css";
import NavBar from "../Navbar";
import Table from "react-bootstrap/Table";
import butotn from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const SellingProductList = ({ isIncomeReport, incomeDate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productSales, setProductSales] = useState([]);
  const [currentProductSales, setCurrentProductSales] = useState([]);
  const [listDate, setListDate] = useState("");
  const [filterByDate, setFilterByDate] = useState(false);
  const [dateTotal, setDateTotal] = useState(-1);

  useEffect(() => {
    getProductSales();
  }, [incomeDate]);

  useEffect(() => {
    calculateDateTotal(currentProductSales);
  }, [currentProductSales]);

  const getProductSales = () => {
    setIsLoading(true);
    fetch("http://roaaptc.com:3000/product/all/sales", {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          setIsLoading(false);
          console.log(response);
          return;
        }
        return response.json();
      })
      .then((data) => {
        setProductSales(data.productSales);
        setCurrentProductSales(data.productSales);
        if (isIncomeReport) {
          setCurrentProductSales(
            data.productSales.filter((ps) => ps.orderDate === incomeDate)
          );
          setIsLoading(false);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
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
      setCurrentProductSales(
        currentProductSales.filter((ss) => ss.orderDate === today)
      );
    } else if (e.target.checked && listDate !== "") {
      setCurrentProductSales(
        currentProductSales.filter((ss) => ss.orderDate === listDate)
      );
    } else {
      setCurrentProductSales(productSales);
      setListDate("");
    }
  };

  const onDateChangedHandler = (e) => {
    console.log(e.target.value);
    const dd = e.target.value.split("-")[2];
    const mm = e.target.value.split("-")[1];
    const yyyy = e.target.value.split("-")[0];
    setListDate(`${mm}/${dd}/${yyyy}`);
    setCurrentProductSales(
      productSales.filter((ss) => ss.orderDate === `${mm}/${dd}/${yyyy}`)
    );
  };

  const calculateDateTotal = (arr) => {
    let sum = 0;
    arr.forEach((ss) => {
      sum += ss.orderTotal;
    });
    setDateTotal(sum);
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
        {!isLoading && currentProductSales.length === 0 && (
          <h3 style={{ textAlign: "center" }}>لا يوجـد منتجات تم بيعها</h3>
        )}
        {!isLoading && isIncomeReport && currentProductSales.length > 0 && (
          <h3
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            المنتجات التى تم بيعها
          </h3>
        )}
        {!isLoading &&
          currentProductSales.length > 0 &&
          currentProductSales.map((ps) => {
            return (
              <div className={classes.productSalesInfo} key={ps._id}>
                <h4>- {ps.orderDate}</h4>
                <div className={classes.innerInfo}>
                  <Table striped bordered hover className={classes.table}>
                    <thead>
                      <tr>
                        <th>الصنـف</th>
                        <th>الكمية</th>
                        <th>سعر الوحدة</th>
                        <th>إحمالى السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ps.products.map((p) => {
                        return (
                          <>
                            <tr key={p._id}>
                              <td>{p.productName}</td>
                              <td>{p.productQuantity}</td>
                              <td>{p.unitPrice}</td>
                              <td>{p.productTotal}</td>
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

export default SellingProductList;
