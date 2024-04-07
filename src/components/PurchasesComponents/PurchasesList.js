import { useNavigate } from "react-router-dom";
import NavBar from "../Navbar";
import classes from "./PurchasesList.module.css";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

const PurchasesList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [purchasesArray, setPurchasesArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getPurchases();
  }, []);

  const getPurchases = () => {
    try {
      setIsLoading(true);
      fetch("http://roaaptc.com:3000/purchase/all", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            setIsLoading(false);
            return;
          }
          return response.json();
        })
        .then((data) => {
          setPurchasesArray(data.purchases);
          setCurrentArray(data.purchases);
          setIsLoading(false);
          // console.log(data);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const goToAddPurchaseHandler = () => {
    navigate("/new/purchase");
  };

  return (
    <>
      <NavBar />
      {!isLoading && (
        <Button
          onClick={goToAddPurchaseHandler}
          className={classes.addProducts}
          variant="primary"
        >
          Add purchase
        </Button>
      )}
      {isLoading && (
        <h1 style={{ color: "white", textAlign: "center" }}>Loading...</h1>
      )}
      {!isLoading && currentArray.length === 0 && (
        <h1 style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          لا يوجد مشتريات حتى الآن
        </h1>
      )}
      {!isLoading && currentArray.length > 0 && (
        <div className={classes.wrapper}>
          <Table striped bordered hover className={classes.table}>
            <thead>
              <tr>
                <th>الصنـف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>تاريخ الشراء</th>
              </tr>
            </thead>
            <tbody>
              {currentArray.map((p) => {
                return (
                  <>
                    <tr key={p._id}>
                      <td>{p.purchaseName}</td>
                      <td>{p.purchaseQuantity}</td>
                      <td>{p.purchaseTotal}</td>
                      <td>{p.purchaseDate}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default PurchasesList;
