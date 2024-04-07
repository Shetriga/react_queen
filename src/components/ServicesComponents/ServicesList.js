import classes from "./ServicesList.module.css";
import NavBar from "../Navbar";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import Modal from "../Modal";
import ConfirmServiceDelete from "./ConfirmServiceDelete";
import NewService from "./NewService";

const ServicesList = ({ isSelling, onServiceChosen, onNextClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [servicesArray, setServicesArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addService, setAddService] = useState(false);
  const [sellingServicesIds, setSellingServicesIds] = useState([]);
  const [updateParams, setUpdateParams] = useState({});
  const [updating, setUpdating] = useState(false);

  // Pagination data
  const [pageCount, setPageCount] = useState(0);
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemsOffset + itemsPerPage;
    setCurrentArray(servicesArray.slice(itemsOffset, endOffset));
    setPageCount(Math.ceil(servicesArray.length / itemsPerPage));
  }, [itemsOffset, itemsPerPage, servicesArray]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % servicesArray.length;
    setItemsOffset(newOffset);
  };
  // End Pagination data

  useEffect(() => {
    getServices();
  }, []);

  const getServices = () => {
    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/service", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
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
          setServicesArray(data.services);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDeleteHandler = (serviceId) => {
    setConfirmDelete(true);
    setServiceId(serviceId);
  };

  const addServiceHandler = () => {
    setAddService(true);
  };

  const onCloseModal = () => {
    if (addService) {
      setAddService(false);
      return;
    }
    if (confirmDelete) {
      setConfirmDelete(false);
      return;
    }
    if (updating) {
      setUpdating(false);
      return;
    }
  };

  const onUpdateServiceHandler = (
    serviceName,
    serviceFee,
    serviceOfferFee,
    serviceId
  ) => {
    setUpdateParams({
      serviceName: serviceName,
      serviceFee: serviceFee,
      serviceOfferFee: serviceOfferFee,
      serviceId: serviceId,
    });
    setUpdating(true);
  };

  return (
    <>
      <NavBar />
      {confirmDelete && (
        <Modal onClose={onCloseModal}>
          <ConfirmServiceDelete
            serviceId={serviceId}
            onCancel={onCloseModal}
            onRefresh={getServices}
          />
        </Modal>
      )}

      {updating && (
        <Modal onClose={onCloseModal}>
          <NewService
            isUpdating={true}
            serviceName={updateParams.serviceName}
            serviceFee={updateParams.serviceFee}
            serviceOfferFee={updateParams.serviceOfferFee}
            getserviceId={updateParams.serviceId}
            onRefresh={getServices}
            onClose={onCloseModal}
          />
        </Modal>
      )}

      {addService && (
        <Modal onClose={onCloseModal}>
          <NewService onClose={onCloseModal} onRefresh={getServices} />
        </Modal>
      )}

      {!isLoading && localStorage.getItem("type") === "Owner" && (
        <Button
          onClick={addServiceHandler}
          className={classes.add}
          variant="primary"
        >
          Add New Service
        </Button>
      )}
      {!isLoading && isSelling && (
        <Button
          style={{ fontWeight: "bold", fontSize: "25px", padding: "5px 25px" }}
          onClick={onNextClick}
          className={classes.add}
          variant="success"
        >
          Next
        </Button>
      )}
      <div className={classes.wrapper}>
        {currentArray.length === 0 && !isLoading && (
          <h1 className={classes.empty}>لا يــوجد خدمات</h1>
        )}
        {isLoading && <h1 className={classes.heading}>Loading...</h1>}
        {currentArray.length > 0 && (
          <Table striped bordered hover className={classes.table}>
            <thead>
              <tr>
                <th>الإسـم</th>
                <th>سعر الخدمة</th>
                <th>سعر العـرض</th>
                {localStorage.getItem("type") === "Owner" ? (
                  <th>حــذف</th>
                ) : null}
                {localStorage.getItem("type") === "Owner" ? (
                  <th>تعديـل</th>
                ) : null}
                {isSelling && <th>إختيـار</th>}
                {/* {localStorage.getItem("type") === "Owner" ? (
                <th>تعديـل</th>
              ) : null} */}
              </tr>
            </thead>
            <tbody>
              {currentArray.map((p) => {
                return (
                  <tr key={p._id}>
                    <td
                      className={
                        isSelling && sellingServicesIds.includes(p._id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.serviceName}
                    </td>
                    <td
                      className={
                        isSelling && sellingServicesIds.includes(p._id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.fee}
                    </td>
                    <td
                      className={
                        isSelling && sellingServicesIds.includes(p._id)
                          ? classes.chosenForSelling
                          : null
                      }
                    >
                      {p.offerFee}
                    </td>
                    {localStorage.getItem("type") === "Owner" ? (
                      <td
                        className={
                          isSelling && sellingServicesIds.includes(p._id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          onClick={(e) => confirmDeleteHandler(p._id)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    ) : null}
                    {localStorage.getItem("type") === "Owner" ? (
                      <td
                        className={
                          isSelling && sellingServicesIds.includes(p._id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          onClick={(e) =>
                            onUpdateServiceHandler(
                              p.serviceName,
                              p.fee,
                              p.offerFee,
                              p._id
                            )
                          }
                          variant="primary"
                        >
                          Update
                        </Button>
                      </td>
                    ) : null}
                    {isSelling && (
                      <td
                        className={
                          isSelling && sellingServicesIds.includes(p._id)
                            ? classes.chosenForSelling
                            : null
                        }
                      >
                        <Button
                          onClick={(e) => {
                            if (sellingServicesIds.includes(p._id)) {
                              setSellingServicesIds(
                                sellingServicesIds.filter((s) => s !== p._id)
                              );
                            } else {
                              setSellingServicesIds([
                                ...sellingServicesIds,
                                p._id,
                              ]);
                            }
                            onServiceChosen(
                              p._id,
                              p.serviceName,
                              p.fee === 0 ? p.offerFee : p.fee
                            );
                          }}
                          variant="primary"
                        >
                          {sellingServicesIds.includes(p._id)
                            ? "Remove"
                            : "Choose"}
                        </Button>
                      </td>
                    )}
                    {/* {localStorage.getItem("type") === "Owner" ? (
                    <td>
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
                  ) : null} */}
                  </tr>
                );
              })}
              <td colSpan={7}>
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

export default ServicesList;
