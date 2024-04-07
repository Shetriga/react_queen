import { useState } from "react";
import classes from "./NewReservation.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavBar from "../Navbar";
import { useNavigate } from "react-router-dom";

const NewReservation = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [action, setAction] = useState("");
  const [deposite, setDeposite] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [notes, setNotes] = useState("");
  const [formIsValid, setFormIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const phoneHandler = (event) => {
    setPhone(event.target.value);
  };

  const dateHandler = (event) => {
    setDate(event.target.value);
  };

  const actionHandler = (event) => {
    setAction(event.target.value);
  };

  const depositeHandler = (event) => {
    setDeposite(event.target.value);
  };

  const remainingHandler = (event) => {
    setRemaining(event.target.value);
  };

  const totalHandler = (event) => {
    setTotal(event.target.value);
  };

  const notesHandler = (event) => {
    setNotes(event.target.value);
  };

  const calculateRemaining = () => {
    setRemaining(total - deposite);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(true);

    if (name.trim() === "" || name.trim() === "") {
      setFormIsValid(false);
      return;
    }
    if (date.trim() === null || date.trim() === "") {
      setFormIsValid(false);
      return;
    }
    if (action.trim() === null || action.trim() === "") {
      setFormIsValid(false);
      return;
    }
    if (total <= 0) {
      setFormIsValid(false);
      return;
    }
    if (deposite <= 0) {
      setFormIsValid(false);
      return;
    }
    if (remaining <= 0) {
      setFormIsValid(false);
      return;
    }

    // Now we know that form is valid
    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/reservation/new/reservation", {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: phone.trim() ?? null,
          date: date,
          action: action,
          total: total,
          deposite: deposite,
          remaining: remaining,
          notes: notes.trim() ?? null,
        }),
      })
        .then((response) => {
          setIsLoading(false);
          if (!response.ok) {
            console.log(response);
            return;
          }
          navigate("/reservations");
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
      <NavBar />
      <div className={classes.wrapper}>
        <Form className={classes.form} onSubmit={onSubmitHandler}>
          {!formIsValid && <h5 className={classes.invalid}>Invalid Fields!</h5>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>الإسـم</Form.Label>
            <Form.Control
              onChange={nameHandler}
              value={name}
              type="text"
              placeholder="Name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>رقم الهاتف</Form.Label>
            <Form.Control
              onChange={phoneHandler}
              value={phone}
              type="number"
              placeholder="Phone Number"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>التاريخ</Form.Label>
            <Form.Control
              onChange={dateHandler}
              value={date}
              type="date"
              placeholder="Date"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>ما تم حجزه</Form.Label>
            <Form.Control
              onChange={actionHandler}
              value={action}
              type="text"
              placeholder="Action"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>الإجمالى</Form.Label>
            <Form.Control
              onChange={totalHandler}
              value={total}
              type="number"
              placeholder="Total"
              onBlur={calculateRemaining}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>العربون</Form.Label>
            <Form.Control
              onChange={depositeHandler}
              value={deposite}
              type="number"
              placeholder="Deposite"
              onBlur={calculateRemaining}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>المتبقى</Form.Label>
            <Form.Control
              onChange={remainingHandler}
              value={remaining}
              type="number"
              placeholder="Remaining"
              readOnly={true}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>ملاحظات</Form.Label>
            <Form.Control
              onChange={notesHandler}
              value={notes}
              type="text"
              placeholder="Notes"
            />
          </Form.Group>
          <Button disabled={isLoading} variant="primary" type="submit">
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default NewReservation;
