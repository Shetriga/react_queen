import { useState } from "react";
import classes from "./SellingService.module.css";
import ServicesList from "./ServicesList";
import CustomersList from "../CustomerComponents/CustomersList";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import NavBar from "../Navbar";
import { useNavigate } from "react-router-dom";

const SellingService = () => {
  const [serviceIsChosen, setServiceIsChosen] = useState(false);
  const [customerIsChosen, setCustomerIsChosen] = useState(false);
  const [chosenCustomer, setChosenCustomer] = useState({});
  const [chosenServicesForSelling, setChosenServicesForSelling] = useState([]); // In case we are selling
  const [servicesIds, setServicesIds] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const onNotesChangeHandler = (event) => {
    setNotes(event.target.value);
  };

  const onDeleteService = (index) => (e) => {
    let tmp = [...chosenServicesForSelling];
    tmp.splice(index, 1);
    setGrandTotal(grandTotal - chosenServicesForSelling[index].unitPrice);
    setChosenServicesForSelling(tmp);
  };

  const calculateTotal = () => {
    let tmpTotal = 0;
    chosenServicesForSelling.forEach((e) => {
      tmpTotal += e.unitPrice;
    });

    setGrandTotal(tmpTotal);
  };

  const onNextClick = () => {
    setServiceIsChosen(true);
    calculateTotal();
  };

  const serviceChosenForSelling = (serviceId, serviceName, unitPrice) => {
    if (servicesIds.includes(serviceId)) {
      setServicesIds(servicesIds.filter((s) => s !== serviceId));
      setChosenServicesForSelling(
        chosenServicesForSelling.filter((s) => s.serviceId !== serviceId)
      );
    } else {
      setServicesIds([...servicesIds, serviceId]);
      setChosenServicesForSelling([
        ...chosenServicesForSelling,
        {
          serviceName,
          serviceId,
          unitPrice,
        },
      ]);
    }
    console.log(chosenServicesForSelling[0]);
  };

  const onChooseCustomer = (customerId, customerName, customerPhone) => {
    setCustomerIsChosen(true);
    setChosenCustomer({
      name: customerName,
      id: customerId,
      phone: customerPhone,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // console.log("Submitted");
    let formArray = [];
    const tmpArray = chosenServicesForSelling.map((s) => {
      return formArray.push({
        id: s.serviceId,
        serviceName: s.serviceName,
        serviceFee: s.unitPrice,
      });
    });
    console.log(formArray);

    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/service/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          services: formArray,
          orderTotal: grandTotal,
          customerId: chosenCustomer.id,
          notes: notes ? notes : null,
        }),
      })
        .then((response) => {
          setIsLoading(false);
          if (!response.ok) {
            console.log(response);
            return;
          }
          console.log("Saved");
          navigate("/home");
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
      {!serviceIsChosen && (
        <ServicesList
          isSelling={true}
          onServiceChosen={serviceChosenForSelling}
          onNextClick={onNextClick}
        />
      )}
      {serviceIsChosen && !customerIsChosen && (
        <CustomersList isChoosing={true} onChooseCustomer={onChooseCustomer} />
      )}
      {serviceIsChosen && customerIsChosen && (
        <>
          <NavBar />
          <div className={classes.wrapper}>
            <h1>Customer</h1>
            <div className={classes.customerInfo}>
              <h4>{chosenCustomer.name}</h4>
              <h4>{chosenCustomer.phone}</h4>
            </div>
            <h1>Services</h1>
            <div className={classes.servicesInfo}>
              <Table striped bordered hover className={classes.table}>
                <thead>
                  <tr>
                    <th>الصنـف</th>
                    <th>السعــر</th>
                    <th>حـذف</th>
                  </tr>
                </thead>
                <tbody>
                  {chosenServicesForSelling.map((s, index) => {
                    return (
                      <tr key={s._id}>
                        <td>{s.serviceName}</td>
                        <td>{s.unitPrice}</td>
                        <td>
                          <Button
                            onClick={onDeleteService(index)}
                            variant="danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <textarea
                value={notes}
                onChange={onNotesChangeHandler}
                placeholder="Notes"
                rows={6}
                cols={60}
              ></textarea>
              <h1>Total: {grandTotal}</h1>
              <Button
                className={classes.submitBtn}
                onClick={onSubmit}
                variant="primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SellingService;
