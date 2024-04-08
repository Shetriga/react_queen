import { useEffect, useState } from "react";
import classes from "./AssetsList.module.css";
import Table from "react-bootstrap/Table";
import NavBar from "../Navbar";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const AssetsList = () => {
  const [assetsArray, setAssetsArray] = useState([]);
  const [currentArray, setCurrentArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Pagination data
  const [pageCount, setPageCount] = useState(0);
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemsOffset + itemsPerPage;
    setCurrentArray(assetsArray.slice(itemsOffset, endOffset));
    setPageCount(Math.ceil(assetsArray.length / itemsPerPage));
  }, [itemsOffset, itemsPerPage, assetsArray]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % assetsArray.length;
    setItemsOffset(newOffset);
  };
  // End Pagination data

  useEffect(() => {
    getAssets();
  }, []);

  const getAssets = () => {
    try {
      setIsLoading(true);
      fetch("http://roaaptc.com:3000/asset/all", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (!response.ok) {
            setIsLoading(false);
            console.log(response);
            return;
          }
          return response.json();
        })
        .then((data) => {
          setIsLoading(false);
          setAssetsArray(data.assets);
          setCurrentArray(data.assets);
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

  const newAssetHandler = () => {
    navigate("/new/asset");
  };

  return (
    <>
      <NavBar />
      {!isLoading && (
        <Button
          onClick={newAssetHandler}
          className={classes.addAssets}
          variant="primary"
        >
          Add New Asset
        </Button>
      )}
      {isLoading && <h1 className={classes.heading}>Loading...</h1>}
      {!isLoading && currentArray.length === 0 && (
        <h1 className={classes.heading}>لا يـوجد ممتلكات</h1>
      )}
      {!isLoading && currentArray.length > 0 && (
        <div className={classes.wrapper}>
          {currentArray.length > 0 && (
            <Table striped bordered hover className={classes.table}>
              <thead>
                <tr>
                  <th>الصنـف</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>السعر الإجمالى</th>
                  <th>تاريخ الشراء</th>
                  <th>تاريخ آخر تسجيل</th>
                </tr>
              </thead>
              <tbody>
                {currentArray.map((a) => {
                  return (
                    <>
                      <tr key={a._id}>
                        <td>{a.assetName}</td>
                        <td>{a.quantity}</td>
                        <td>{a.unitPrice}</td>
                        <td>{a.totalPrice}</td>
                        <td>{a.purchaseDate}</td>
                        <td>{a.lastUpdateDate}</td>
                      </tr>
                    </>
                  );
                })}
                <td colSpan={6}>
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
      )}
    </>
  );
};

export default AssetsList;
