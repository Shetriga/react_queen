import React, { useState } from "react";
import classes from "./AddProduct.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavBar from "./Navbar";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [formIsValid, setFormIsValid] = useState(true);

  //   Handlers
  const nameHandler = (event) => {
    setProductName(event.target.value);
  };

  const quantityHandler = (event) => {
    setQuantity(event.target.value);
  };

  const unitPriceHandler = (event) => {
    setUnitPrice(event.target.value);
  };

  const expiryDateHandler = (event) => {
    setExpiryDate(event.target.value);
  };

  const offerPriceHandler = (event) => {
    setOfferPrice(event.target.value);
  };

  //   Submit Handler
  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Check and validate inputs
    if (productName.trim() === "" || productName.trim().length === 0) {
      console.log("Product name is invalid");
      setFormIsValid(false);
      return;
    }
    if (quantity <= 0) {
      console.log("Quantity is invalid");
      setFormIsValid(false);
      return;
    }
    if (unitPrice <= 0) {
      console.log("Unit Price is invalid");
      setFormIsValid(false);
      return;
    }

    // Now we send to api
    if (!formIsValid) {
      setFormIsValid(true);
    }
    try {
      fetch("http://146.190.156.189:3000/product/product", {
        method: "POST",
        body: JSON.stringify({
          name: productName,
          quantity: quantity,
          unitPrice: unitPrice,
          expiryDate: expiryDate,
          offerPrice: offerPrice,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.ok) {
            setProductName("");
            setQuantity(0);
            setUnitPrice(0);
            setOfferPrice(0);
            setExpiryDate("");
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 2000);
          }
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.wrapper}>
        {success && <p className={classes.successMsg}>Added successfully</p>}
        {!formIsValid && <p className={classes.dangerMsg}>Invalid Fields!</p>}
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              onChange={nameHandler}
              value={productName}
              type="text"
              placeholder="Produt Name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              onChange={quantityHandler}
              value={quantity}
              type="number"
              placeholder="Quantity"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control
              onChange={unitPriceHandler}
              value={unitPrice}
              type="number"
              placeholder="Unit Price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Offer Price</Form.Label>
            <Form.Control
              onChange={offerPriceHandler}
              value={offerPrice}
              type="number"
              placeholder="Offer Price"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              onChange={expiryDateHandler}
              value={expiryDate}
              type="date"
              placeholder="Expiry Date"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;
