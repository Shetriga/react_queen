import classes from "./NewAsset.module.css";
import NavBar from "../Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRef, useState } from "react";

const NewAsset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [success, setSuccess] = useState(false);

  const nameRef = useRef(null);

  const onNameChangeHandler = (e) => {
    setAssetName(e.target.value);
  };

  const onQuantityChangeHandler = (e) => {
    setQuantity(e.target.value);
  };

  const onPurchaseDateChangeHandler = (e) => {
    setPurchaseDate(e.target.value);
  };

  const onUnitPriceChangeHandler = (e) => {
    setUnitPrice(e.target.value);
  };

  const onUnitPriceBlur = () => {
    if (quantity === 1 && totalPrice === 0) {
      setTotalPrice(unitPrice);
    }
  };

  const onTotalPriceChangeHandler = (e) => {
    setTotalPrice(e.target.value);
  };

  const onExpiryDateChangeHandler = (e) => {
    setExpiryDate(e.target.value);
  };

  const clearForm = () => {
    setAssetName("");
    // setPurchaseDate("");
    setQuantity(1);
    setUnitPrice(0);
    setTotalPrice(0);
    setExpiryDate("");
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (
      assetName === "" ||
      quantity < 1 ||
      purchaseDate === "" ||
      unitPrice < 0 ||
      totalPrice < 0
    ) {
      console.log("Invalid Fields");
      return;
    }

    try {
      setIsLoading(true);
      fetch("http://roaaptc.com:3000/asset/new/asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          assetName: assetName,
          quantity: quantity,
          purchaseDate: `${purchaseDate.split("-")[2]}/${
            purchaseDate.split("-")[1]
          }/${purchaseDate.split("-")[0]}`,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          expiryDate:
            expiryDate === ""
              ? null
              : `${expiryDate.split("-")[2]}/${expiryDate.split("-")[1]}/${
                  expiryDate.split("-")[0]
                }`,
        }),
      })
        .then((response) => {
          setIsLoading(false);
          if (!response.ok) {
            console.log(response);
            return;
          }
          clearForm();
          setSuccess(true);
          nameRef.current?.focus();
          setTimeout(() => {
            setSuccess(false);
          }, 1000);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.wrapper}>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Asset Name</Form.Label>
            <Form.Control
              ref={nameRef}
              onChange={onNameChangeHandler}
              value={assetName}
              autoComplete="off"
              type="text"
              placeholder="Asset Name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              onChange={onQuantityChangeHandler}
              value={quantity}
              min={1}
              autoComplete="off"
              type="number"
              placeholder="Quantity"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Unit Price</Form.Label>
            <Form.Control
              onChange={onUnitPriceChangeHandler}
              onBlur={onUnitPriceBlur}
              value={unitPrice}
              min={0}
              autoComplete="off"
              type="number"
              placeholder="Unit Price"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Total Price</Form.Label>
            <Form.Control
              onChange={onTotalPriceChangeHandler}
              value={totalPrice}
              min={0}
              autoComplete="off"
              type="number"
              placeholder="Total Price"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              onChange={onPurchaseDateChangeHandler}
              value={purchaseDate}
              autoComplete="off"
              type="date"
              placeholder="Purchase Date"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              onChange={onExpiryDateChangeHandler}
              value={expiryDate}
              autoComplete="off"
              type="date"
              placeholder="Expiry Date"
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
          {success && <h3 className={classes.success}>Added Successfully!</h3>}
        </Form>
      </div>
    </>
  );
};

export default NewAsset;
