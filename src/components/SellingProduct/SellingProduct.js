import { useState } from "react";
import Products from "../Products";
import classes from "./SellingProduct.module.css";
import CustomersList from "../CustomerComponents/CustomersList";
import NavBar from "../Navbar";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const SellingProduct = () => {
  const [productIsChosen, setProductIsChosen] = useState(false);
  const [customerIsChosen, setCustomerIsChosen] = useState(false);
  const [chosenCustomer, setChosenCustomer] = useState({});
  const [chosenProductsForSelling, setChosenProductsForSelling] = useState([]); // In case we are selling
  const [productsIds, setProductsIds] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");

  const onNotesChangeHandler = (event) => {
    setNotes(event.target.value);
  };

  const onNextClickHandler = () => {
    setProductIsChosen(true);
    calculateTotal();
  };

  const productChosenForSelling = (
    productId,
    availableQuantity,
    unitPrice,
    productName,
    orderQuantity,
    totalPrice
  ) => {
    setProductsIds([...productsIds, productId]);
    if (!productsIds.includes(productId)) {
      setChosenProductsForSelling([
        ...chosenProductsForSelling,
        {
          productId,
          availableQuantity,
          unitPrice,
          productName,
          orderQuantity,
          totalPrice,
        },
      ]);
    } else {
      setProductsIds(productsIds.filter((p) => p !== productId));
      setChosenProductsForSelling(
        chosenProductsForSelling.filter((c) => c.productId !== productId)
      );
    }
  };

  const onOrderQuantityChanged = (index) => (e) => {
    if (
      e.target.value >= 0 &&
      e.target.value <= chosenProductsForSelling[index].availableQuantity
    ) {
      let tmp = [...chosenProductsForSelling];
      tmp[index].orderQuantity = e.target.value;
      tmp[index].totalPrice = e.target.value * tmp[index].unitPrice;

      setChosenProductsForSelling(tmp);
      calculateTotal();
    }
  };

  const onChooseCustomer = (customerId, customerName, customerPhone) => {
    setCustomerIsChosen(true);
    setChosenCustomer({
      name: customerName,
      id: customerId,
      phone: customerPhone,
    });
  };

  const onDeleteProduct = (index) => (e) => {
    let tmp = [...chosenProductsForSelling];
    tmp.splice(index, 1);
    setGrandTotal(grandTotal - chosenProductsForSelling[index].totalPrice);
    setChosenProductsForSelling(tmp);
  };

  const calculateTotal = () => {
    let tmpTotal = 0;
    chosenProductsForSelling.forEach((e) => {
      tmpTotal += e.totalPrice;
    });

    setGrandTotal(tmpTotal);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");
    let formArray = [];
    const tmpArray = chosenProductsForSelling.map((p) => {
      return formArray.push({
        id: p.productId,
        unitPrice: p.unitPrice,
        productName: p.productName,
        productQuantity: p.orderQuantity,
        productTotal: p.totalPrice,
      });
    });

    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/product/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          products: formArray,
          orderTotal: grandTotal,
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
      {!productIsChosen && (
        <Products
          isSelling={true}
          onNextClick={onNextClickHandler}
          onProductChosen={productChosenForSelling}
          chosenProducts={chosenProductsForSelling}
        />
      )}
      {/* {productIsChosen && (
        <CustomersList onChooseCustomer={onChooseCustomer} isChoosing={true} />
      )} */}
      {productIsChosen && (
        <>
          <NavBar />
          <div className={classes.wrapper}>
            {/* <h1>Customer</h1> */}
            {/* <div className={classes.customerInfo}>
              <h4>Name: {chosenCustomer.name}</h4>
              <h4>Phone Number: {chosenCustomer.phone}</h4>
            </div> */}
            <h1>Products</h1>
            <div className={classes.productsInfo}>
              <Table striped bordered hover className={classes.table}>
                <thead>
                  <tr>
                    <th>الصنـف</th>
                    <th>الكميـة المتاحة</th>
                    <th>الكمية المطلوبة</th>
                    <th>سعر الوحدة</th>
                    <th>إجمالى السعر</th>
                    <th>حــذف</th>
                  </tr>
                </thead>
                <tbody>
                  {chosenProductsForSelling.map((p, index) => {
                    return (
                      <tr key={p.id}>
                        <td>{p.productName}</td>
                        <td>{p.availableQuantity}</td>
                        <td>
                          <input
                            type="number"
                            value={p.orderQuantity}
                            onChange={onOrderQuantityChanged(index)}
                          />
                        </td>
                        <td>{p.unitPrice}</td>
                        <td>{p.totalPrice}</td>
                        <td>
                          <Button
                            onClick={onDeleteProduct(index)}
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

export default SellingProduct;
