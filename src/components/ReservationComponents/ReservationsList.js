import ReactPaginate from "react-paginate";
import NavBar from "../Navbar";
import classes from "./ReservationsList.module.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReservationsList = () => {
  const [reservationsArray, setReservationsArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const goToAddHandler = () => {
    navigate("/reservations/add");
  };

  // Pagination data
  const [pageCount, setPageCount] = useState(0);
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemsOffset + itemsPerPage;
    setCurrentArray(reservationsArray.slice(itemsOffset, endOffset));
    setPageCount(Math.ceil(reservationsArray.length / itemsPerPage));
  }, [itemsOffset, itemsPerPage, reservationsArray]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % reservationsArray.length;
    setItemsOffset(newOffset);
  };
  // End Pagination data

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = () => {
    setIsLoading(true);
    try {
      fetch("http://146.190.156.189:3000/reservation", {
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
          setReservationsArray(data.reservations);
          setCurrentArray(data.reservations);
        })
        .catch((e) => {
          setIsLoading(false);
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const confirmDeleteHandler = () => {
    setConfirmDelete(true);
  };

  const onMarkAsDoneHandler = (reservationId) => {
    try {
      setIsLoading(true);
      fetch(`http://roaaptc.com:3000/reservation/mark/done/${reservationId}`, {
        method: "PUT",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }).then((response) => {
        if (!response.ok) {
          console.log(response);
          return;
        }
        setIsLoading(false);
        getReservations();
      });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.wrapper}>
        <Button
          onClick={goToAddHandler}
          className={classes.btn}
          variant="primary"
        >
          Add New Reservations
        </Button>
        {isLoading && <h1 className={classes.loading}>Loading...</h1>}
        {!isLoading && currentArray.length === 0 && (
          <h1 className={classes.loading}>لا يوجد حجوزات</h1>
        )}
        {!isLoading && currentArray.length > 0 && (
          <Table striped bordered hover className={classes.table}>
            <thead>
              <tr>
                <th>الإسـم</th>
                <th>رقم الهاتف</th>
                <th>التاريخ</th>
                <th>الإجمالى</th>
                <th>العربون</th>
                <th>المتبقى</th>
                <th>ملاحظات</th>
                <th>حالة الحجز</th>
                <th>إكتمل</th>
              </tr>
            </thead>
            <tbody>
              {currentArray.map((r) => {
                return (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.date}</td>
                    <td>{r.total}</td>
                    <td>{r.deposite}</td>
                    <td>{r.remaining}</td>
                    <td>{r.notes}</td>
                    <td>{r.status}</td>
                    <td>
                      <Button
                        disabled={r.status === "مكتمل"}
                        onClick={(e) => onMarkAsDoneHandler(r._id)}
                        variant="success"
                      >
                        إكتمل
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <td colSpan={9}>
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

export default ReservationsList;
