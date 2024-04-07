import { useState } from "react";
import classes from "./ConfirmServiceDelete.module.css";
import Button from "react-bootstrap/Button";

const ConfirmServiceDelete = ({ onCancel, serviceId, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteHandler = () => {
    setIsLoading(true);
    try {
      fetch(`http://146.190.156.189:3000/service/${serviceId}`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          setIsLoading(false);
          if (response.ok) {
            console.log("Done");
            onRefresh();
            onCancel();
          }
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <>
      <h6 className={classes.heading}>Confirm Delete ?</h6>
      <Button
        className={classes.actionButton}
        variant="light"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        onClick={onDeleteHandler}
        className={classes.actionButton}
        variant="danger"
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </>
  );
};

export default ConfirmServiceDelete;
