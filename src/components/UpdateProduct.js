import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import classes from "./UpdateProduct.module.css";

const UpdateProduct = ({
  getProductId,
  getProductName,
  getQuantity,
  getUnitPrice,
  getExpiryDate,
  getOfferPrice,
  onCancel,
  onRefresh,
}) => {
  const [productName, setProductName] = useState(getProductName);
  const [quantity, setQuantity] = useState(getQuantity);
  const [unitPrice, setUnitPrice] = useState(getUnitPrice);
  const [offerPrice, setOfferPrice] = useState(getOfferPrice);
  const [expiryDate, setExpiryDate] = useState(getExpiryDate);
  const [isLoading, setIsLoading] = useState(false);

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
    if (productName.trim() === "" || productName.trim().length === 0) {
      console.log("Product name is invalid");
      return;
    }
    if (quantity <= 0) {
      console.log("Quantity is invalid");
      return;
    }
    if (unitPrice <= 0) {
      console.log("Unit Price is invalid");
      return;
    }

    // now update product
    setIsLoading(true);
    try {
      fetch(`http://146.190.156.189:3000/product/${getProductId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: productName,
          quantity: quantity,
          unitPrice: unitPrice,
          offerPrice: offerPrice,
          expiryDate: expiryDate,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          setIsLoading(false);
          if (response.ok) {
            console.log("Done");
            onRefresh();
            onCancel();
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmitHandler} className={classes.form}>
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
        <Button
          onClick={onCancel}
          className={classes.actionButton}
          variant="light"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className={classes.actionButton}
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </Form>
    </>
  );
};

export default UpdateProduct;
