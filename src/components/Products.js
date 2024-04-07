import React, { useEffect, useState } from "react";
import NavBar from "./Navbar";
import Table from "react-bootstrap/Table";
import { Button, Form } from "react-bootstrap";
import classes from "./Products.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import UpdateProduct from "./UpdateProduct";
import ReactPaginate from "react-paginate";

const Products = ({ isSelling, onProductChosen, onNextClick }) => {
  const navigate = useNavigate();
  const [productsArray, setProductsArray] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [productsIds, setProductsIds] = useState([]); // In case we are selling
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [productId, setProductId] = useState(false);
  const [params, setParams] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination data
  const [pageCount, setPageCount] = useState(0);
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemsOffset + itemsPerPage;
    setCurrentProducts(productsArray.slice(itemsOffset, endOffset));
    setPageCount(Math.ceil(productsArray.length / itemsPerPage));
  }, [itemsOffset, itemsPerPage, productsArray]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % productsArray.length;
    setItemsOffset(newOffset);
  };
  // End Pagination data

  const getProducts = () => {
    try {
      setIsLoading(true);
      fetch("http://146.190.156.189:3000/product/all/products", {
        headers: { authorization: localStorage.getItem("token") },
      })
        .then((response) => {
          // console.log(response.status);
          setIsLoading(false);
          return response.json();
        })
        .then((data) => {
          //   console.log(data.products);
          //   setProductsArray(data.products);
          //   console.log(productsArray);

          mapData(data.products);
          //   console.log(productsArray);
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

  const mapData = (dataArray) => {
    let tmpArray = [];
    dataArray.map((d) => {
      tmpArray.push({
        id: d._id,
        ...d,
      });
    });
    tmpArray.forEach((element) => {
      delete element._id;
    });
    // console.log(tmpArray);
    setProductsArray(tmpArray);
    setCurrentProducts(tmpArray);
  };

  //   getProducts();
  const goToAddProducts = () => {
    navigate("/add/product");
  };

  const confirmDeleteHandler = (productId) => {
    setConfirmDelete(true);
    setProductId(productId);
  };

  const closeDialogHandler = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
    if (isUpdating) {
      setIsUpdating(false);
    }
  };

  const updateProductHandler = (values) => {
    setParams(values);
    setIsUpdating(true);
  };

  const searchProductsHandler = (event) => {
    if (event.target.value !== "") {
      setCurrentProducts(
        productsArray.filter((p) => p.name.includes(event.target.value))
      );
    } else {
      // setCurrentProducts(productsArray.slice(0, 10));
      setCurrentProducts(productsArray.slice(itemsOffset, itemsOffset + 10));
    }
  };

  return (
    <>
      <NavBar />
      {confirmDelete && (
        <Modal onClose={closeDialogHandler}>
          <ConfirmDelete
            productId={productId}
            onCancel={closeDialogHandler}
            onRefresh={getProducts}
          />
        </Modal>
      )}
      {isUpdating && (
        <Modal onClose={closeDialogHandler}>
          <UpdateProduct
            getProductName={params.name}
            getProductId={params.productId}
            getExpiryDate={params.expiryDate}
            getQuantity={params.quantity}
            getUnitPrice={params.unitPrice}
            getOfferPrice={params.offerPrice}
            onCancel={closeDialogHandler}
            onRefresh={getProducts}
          />
        </Modal>
      )}
      <div className={classes.wrapper}>
        {localStorage.getItem("type") === "Owner" ? (
          <Button
            onClick={goToAddProducts}
            className={classes.addProducts}
            variant="primary"
          >
            Add Products
          </Button>
        ) : null}
        {isSelling && (
          <Button
            style={{
              marginTop: "15px",
              fontSize: "25px",
              fontWeight: "bold",
              padding: "10px 25px",
            }}
            onClick={onNextClick}
            className={classes.addProducts}
            variant="success"
          >
            Next
          </Button>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            onChange={searchProductsHandler}
            type="text"
            placeholder="Produt Name"
          />
        </Form.Group>
        {/* {productsArray.length > 0 && (
          <h1 style={{ color: "white" }}>
            {productsArray.length} - {productsArray[0].name}
          </h1>
        )} */}
        {isLoading && (
          <h3 style={{ color: "white", textAlign: "center" }}>Loading...</h3>
        )}
        {!isLoading && productsArray.length === 0 && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            لا يوجـد منتجات
          </h3>
        )}
        {productsArray.length > 0 && (
          <Table striped bordered hover className={classes.table}>
            <thead>
              <tr>
                <th>الإسـم</th>
                <th>الكميـة</th>
                <th>سعر الوحدة</th>
                <th>سعر العـرض</th>
                <th>تاريخ إنتهاء الصلاحية</th>
                {localStorage.getItem("type") === "Owner" ? (
                  <th>حــذف</th>
                ) : null}
                {localStorage.getItem("type") === "Owner" ? (
                  <th>تعديـل</th>
                ) : null}
                {isSelling ? <th>إختيـار</th> : null}
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => {
                return (
                  <tr key={p.id}>
                    <td
                      className={
                        productsIds.includes(p.id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.name}
                    </td>
                    <td
                      className={
                        isSelling && productsIds.includes(p.id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.quantity}
                    </td>
                    <td
                      className={
                        isSelling && productsIds.includes(p.id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.unitPrice}
                    </td>
                    <td
                      className={
                        isSelling && productsIds.includes(p.id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.offerPrice}
                    </td>
                    <td
                      className={
                        isSelling && productsIds.includes(p.id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.expiryDate}
                    </td>
                    {localStorage.getItem("type") === "Owner" ? (
                      <td
                        className={
                          isSelling && productsIds.includes(p.id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          onClick={(e) => confirmDeleteHandler(p.id)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    ) : null}
                    {localStorage.getItem("type") === "Owner" ? (
                      <td
                        className={
                          isSelling && productsIds.includes(p.id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          onClick={(e) =>
                            updateProductHandler({
                              productId: p.id,
                              name: p.name,
                              quantity: p.quantity,
                              unitPrice: p.unitPrice,
                              expiryDate: p.expiryDate,
                              offerPrice: p.offerPrice,
                            })
                          }
                          variant="primary"
                        >
                          Update
                        </Button>
                      </td>
                    ) : null}
                    {isSelling ? (
                      <td
                        className={
                          isSelling && productsIds.includes(p.id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          disabled={p.quantity === 0}
                          onClick={(e) => {
                            productsIds.includes(p.id)
                              ? setProductsIds(
                                  productsIds.filter((tmp) => tmp !== p.id)
                                )
                              : setProductsIds([...productsIds, p.id]);
                            onProductChosen(
                              p.id,
                              p.quantity,
                              p.unitPrice === 0 ? p.offerPrice : p.unitPrice,
                              p.name,
                              1,
                              p.unitPrice === 0 ? p.offerPrice : p.unitPrice
                            );
                          }}
                          variant="primary"
                        >
                          {productsIds.includes(p.id) ? "Remove" : "Choose"}
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              <td colSpan={isSelling ? 8 : 7}>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
                  containerClassName={classes.pagination}
                  pageLinkClassName={classes.pageNum}
                  previousLinkClassName={classes.pageNum}
                  nextLinkClassName={classes.pageNum}
                  activeLinkClassName={classes.active}
                />
              </td>
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default Products;
