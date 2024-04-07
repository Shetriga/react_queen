import Form from "react-bootstrap/Form";
import classes from "./NewCustomer.module.css";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const NewCustomer = ({
  onRefresh,
  onClose,
  isEditing,
  customerName,
  customerPhone,
  getCustomerId,
}) => {
  const [name, setName] = useState(isEditing ? customerName : "");
  const [phone, setPhone] = useState(isEditing ? customerPhone : "");
  const [customerId, setCustomerId] = useState(isEditing ? getCustomerId : "");
  const [formIsValid, setFormIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // if (isEditing === true) {
  //   setName(customerName);
  //   setPhone(customerPhone);
  //   setCustomerId(getCustomerId);
  // }

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (name.trim().length === 0 || name.trim() === null) {
      setFormIsValid(false);
      return;
    }
    if (phone.trim().length !== 11) {
      setFormIsValid(false);
      return;
    }
    // Form is valid now
    setIsLoading(true);
    if (!formIsValid) {
      setFormIsValid(true);
    }
    try {
      const url = isEditing
        ? `http://146.190.156.189:3000/customer/${customerId}`
        : "http://146.190.156.189:3000/customer/new/customer";
      fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify({
          name: name,
          phone: phone,
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
          onClose();
          onRefresh();
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {!formIsValid && <h5 className={classes.invalid}>Invalid Fields!</h5>}
      <Form onSubmit={onSubmitHandler}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={nameChangeHandler}
            value={name}
            type="text"
            placeholder="Name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            onChange={phoneChangeHandler}
            value={phone}
            type="text"
            placeholder="Phone"
          />
        </Form.Group>
        <Button disabled={isLoading} variant="primary" type="submit">
          {isEditing ? "Update" : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default NewCustomer;
