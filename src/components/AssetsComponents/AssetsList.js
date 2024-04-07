import { useEffect, useState } from "react";
import classes from "./AssetsList.module.css";
import Table from "react-bootstrap/Table";
import NavBar from "../Navbar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const AssetsList = () => {
  const [assetsArray, setAssetsArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAssets();
  });

  const getAssets = () => {
    try {
      fetch("http://roaaptc.com:3000/asset")
        .then((response) => {
          if (!response.ok) {
            setIsLoading(false);
            console.log(response);
            return;
          }
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          console.log(data.assets);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <NavBar />
      {!isLoading && (
        <Button className={classes.addAssets} variant="contained">
          Contained
        </Button>
      )}
      {!isLoading && (
        <div className={classes.wrapper}>
          {currentArray.length > 0 && (
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
          )}
        </div>
      )}
    </>
  );
};

export default AssetsList;
