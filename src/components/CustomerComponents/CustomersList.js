import { useEffect, useState } from "react";
import NavBar from "../Navbar";
import classes from "./CustomerList.module.css";
import Button from "react-bootstrap/Button";
import NewCustomer from "./NewCustomer";
import Modal from "../Modal";
import Form from "react-bootstrap/Form";

const CustomersList = ({ isChoosing, onChooseCustomer }) => {
  const [customersArray, setCustomersArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addCustomer, setAddCustomer] = useState(false);
  const [editCustomer, setEditCustomer] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = () => {
    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/customer/", {
        headers: { authorization: localStorage.getItem("token") },
      })
        .then((response) => {
          setIsLoading(false);
          if (!response.ok) {
            console.log(response);
            return;
          }
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          setCustomersArray(data.users);
          setCurrentArray(data.users);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const addNewCustomerHandler = () => {
    setAddCustomer(true);
  };

  const updateCustomerHandler = (name, phone, id) => {
    setEditCustomer(true);
    setValues({
      name: name,
      phone: phone,
      id: id,
    });
  };

  const closeDialogHandler = () => {
    if (addCustomer) {
      setAddCustomer(false);
    }
    if (editCustomer) {
      setEditCustomer(false);
    }
  };

  const searchCustomersHandler = (event) => {
    setCurrentArray(
      customersArray.filter((p) => p.name.includes(event.target.value))
    );
  };

  const searchCustomerPhoneHandler = (event) => {
    setCurrentArray(
      customersArray.filter((p) => p.phone.includes(event.target.value))
    );
  };

  return (
    <>
      <NavBar />
      {addCustomer && (
        <Modal onClose={closeDialogHandler}>
          <NewCustomer onClose={closeDialogHandler} onRefresh={getCustomers} />
        </Modal>
      )}
      {editCustomer && (
        <Modal onClose={closeDialogHandler}>
          <NewCustomer
            onClose={closeDialogHandler}
            onRefresh={getCustomers}
            isEditing={true}
            customerName={values.name}
            customerPhone={values.phone}
            getCustomerId={values.id}
          />
        </Modal>
      )}
      <div className={classes.wrapper}>
        {!isLoading && (
          <>
            <Button
              onClick={addNewCustomerHandler}
              className={classes.addCustomer}
              variant="primary"
            >
              Add New Customer
            </Button>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={searchCustomersHandler}
                type="text"
                placeholder="Customer Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                onChange={searchCustomerPhoneHandler}
                type="phone"
                placeholder="Phone Number"
              />
            </Form.Group>
          </>
        )}
        {isLoading && <h1 className={classes.loading}>Loading...</h1>}
        {!isLoading && (
          <div className={classes.gridParent}>
            {currentArray.map((c) => (
              <>
                <div key={c._id} className={classes.gridItem}>
                  <img
                    style={{ width: "60px", margin: "auto 10px" }}
                    src={require("../assets/user.png")}
                  />
                  <div className={classes.subGrid}>
                    <h3>{c.name}</h3>
                    <h4>{c.phone}</h4>
                    <div className={classes.innerFlex}>
                      <Button
                        onClick={(e) =>
                          updateCustomerHandler(c.name, c.phone, c._id)
                        }
                        variant="primary"
                        style={isChoosing && { marginRight: "15px" }}
                      >
                        Update data
                      </Button>
                      {isChoosing && (
                        <Button
                          onClick={(e) =>
                            onChooseCustomer(c._id, c.name, c.phone)
                          }
                          variant="primary"
                        >
                          Choose
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CustomersList;
