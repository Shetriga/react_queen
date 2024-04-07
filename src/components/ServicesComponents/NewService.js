import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import classes from "./NewService.module.css";
import { useState } from "react";

const NewService = ({
  isUpdating,
  serviceName,
  serviceFee,
  serviceOfferFee,
  getserviceId,
  onClose,
  onRefresh,
}) => {
  const [name, setName] = useState(isUpdating ? serviceName : "");
  const [fee, setFee] = useState(isUpdating ? serviceFee : 0);
  const [offerFee, setOfferFee] = useState(isUpdating ? serviceOfferFee : 0);
  const [serviceId, setServiceId] = useState(isUpdating ? getserviceId : "");
  const [formIsValid, setFormIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (name.trim() === null || name.trim() === "") {
      setFormIsValid(false);
      return;
    }
    if (fee < 0) {
      setFormIsValid(false);
      return;
    }
    if (offerFee < 0) {
      setFormIsValid(false);
      return;
    }

    setFormIsValid(true);
    const url = isUpdating
      ? `http://roaaptc.com:3000/service/${getserviceId}`
      : "http://roaaptc.com:3000/service/new/service";
    try {
      setIsLoading(true);
      fetch(url, {
        method: isUpdating ? "PUT" : "POST",
        body: JSON.stringify({
          name: name,
          fee: fee,
          offerFee: offerFee,
          serviceId: isUpdating ? getserviceId : null,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          setIsLoading(false);
          if (!response.ok) {
            console.log(response);
          }
          onRefresh();
          onClose();
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const feeHandler = (event) => {
    setFee(event.target.value);
  };

  const offerFeeHandler = (event) => {
    setOfferFee(event.target.value);
  };

  return (
    <>
      {!formIsValid && <h5 className={classes.invalid}>Invalid Fields!</h5>}
      <Form onSubmit={onSubmitHandler}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Service Name</Form.Label>
          <Form.Control
            onChange={nameHandler}
            value={name}
            type="text"
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Fee</Form.Label>
          <Form.Control
            onChange={feeHandler}
            value={fee}
            type="number"
            placeholder="Fee"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Offer Fee</Form.Label>
          <Form.Control
            value={offerFee}
            onChange={offerFeeHandler}
            type="number"
            placeholder="Offer Fee"
          />
        </Form.Group>
        <Button className={classes.btn} onClick={onClose} variant="light">
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className={classes.btn}
          variant="primary"
          type="submit"
        >
          {isUpdating
            ? isLoading
              ? "Updating..."
              : "Update"
            : isLoading
            ? "Submitting..."
            : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default NewService;
