import NavBar from "../Navbar";
import classes from "./NewPurchase.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRef, useState } from "react";

const NewPurchase = () => {
  const [purchaseName, setPurchaseName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [isBoughtToday, setIsBoughtToday] = useState(true);
  const [nameIsValid, setNameIsValid] = useState(true);
  const [quantityIsValid, setQuantityIsValid] = useState(true);
  const [totalIsValid, setTotalIsValid] = useState(true);
  const [dateIsValid, setDateIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameRef = useRef(null);

  const onNameChangedHandler = (e) => {
    setPurchaseName(e.target.value);
  };

  const checkNameValidity = (e) => {
    if (e.target.value.trim().length > 0) {
      setNameIsValid(true);
    } else {
      setNameIsValid(false);
    }
  };

  const checkQuantityValidity = (e) => {
    if (e.target.value.trim().length > 0 && e.target.value > 0) {
      setQuantityIsValid(true);
    } else {
      setQuantityIsValid(false);
    }
  };

  const checkTotalValidity = (e) => {
    if (e.target.value.trim().length > 0 && e.target.value > 0) {
      setTotalIsValid(true);
    } else {
      setTotalIsValid(false);
    }
  };

  const onQuantityChangedHandler = (e) => {
    setPurchaseQuantity(e.target.value);
  };

  const onTotalChangedHandler = (e) => {
    setPurchaseTotal(e.target.value);
  };

  const onDateChangedHandler = (e) => {
    const dd = e.target.value.split("-")[2];
    const mm = e.target.value.split("-")[1];
    const yyyy = e.target.value.split("-")[0];
    setPurchaseDate(`${mm}/${dd}/${yyyy}`);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (
      !nameIsValid ||
      !quantityIsValid ||
      !totalIsValid ||
      (!isBoughtToday && purchaseDate === "")
    ) {
      return;
    }

    // Now we know that data is valid
    try {
      setIsLoading(true);
      fetch("http://roaaptc.com:3000/purchase/new/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          purchaseName: purchaseName,
          purchaseQuantity: purchaseQuantity,
          purchaseTotal: purchaseTotal,
          purchaseDate: purchaseDate !== "" ? purchaseDate : null,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response);
            setIsLoading(false);
          }
          setIsLoading(false);
          setPurchaseName("");
          setPurchaseQuantity(1);
          setPurchaseTotal(0);
          setPurchaseDate("");
          nameRef.current?.focus();
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2000);
          // console.log("Purchase added successfully!");
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const checkboxHandler = (e) => {
    console.log(isBoughtToday);
    setIsBoughtToday(e.target.checked);
  };

  return (
    <>
      <NavBar />
      <div className={classes.wrapper}>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Name</Form.Label>
            <Form.Control
              ref={nameRef}
              className={!nameIsValid ? classes.invalidInput : null}
              onChange={onNameChangedHandler}
              onBlur={checkNameValidity}
              value={purchaseName}
              type="text"
              placeholder="Name"
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              className={!quantityIsValid ? classes.invalidInput : null}
              onChange={onQuantityChangedHandler}
              onBlur={checkQuantityValidity}
              value={purchaseQuantity}
              type="number"
              min={1}
              placeholder="Quantity"
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Total Price</Form.Label>
            <Form.Control
              className={!totalIsValid ? classes.invalidInput : null}
              onChange={onTotalChangedHandler}
              onBlur={checkTotalValidity}
              value={purchaseTotal}
              type="number"
              min={0}
              placeholder="Total Price"
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              onChange={onDateChangedHandler}
              type="date"
              placeholder="Total Price"
              autoComplete="off"
              disabled={isBoughtToday}
            />
          </Form.Group>

          <Form.Group>
            <Form.Check className={classes.datePickerFlex} type={"checkbox"}>
              <Form.Check.Input
                onClick={checkboxHandler}
                type={"checkbox"}
                defaultChecked={true}
              />
              <Form.Check.Label className={classes.formLabel}>
                تم شراءه اليوم
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <Button variant="primary" disabled={isLoading} type="submit">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Form>
        {success && <h1 className={classes.success}>تم الإضافــة</h1>}
      </div>
    </>
  );
};

export default NewPurchase;
