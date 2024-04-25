import React from "react";
import NavBar from "./Navbar";
import classes from './Home.module.css'
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const reservationsHandler = () => {
        navigate('/reservations');
    }

    const customersHandler = () => {
        navigate('/customers');
    }

    const sellingHandler = () => {
        navigate('/selling');
    }

    const sellingServicesHandler = () => {
        navigate('/selling/services');
    }

    const sellingProductListHandler = () => {
        navigate('/sellingproductlist')
    }

    const sellingServicesListHandler = () => {
        navigate('/sellingserviceslist')
    }

    const incomeListHandler = () => {
        navigate('/income')
    }

    const purchasesHandler = () => {
        navigate('/purchases')
    }

    const attendanceHandler = () => {
        navigate('/attendance')
    }

    const assetsHandler = () => {
        navigate('/assets')
    }

    React.useEffect(() => {

        console.log("PRIVAYE ROUTES");
    }, []);
    return (
        <>
            <NavBar />
            <div className={classes.wrapper}>
                <div className={classes.flexParent}>
                    <div onClick={reservationsHandler} className={classes.flexItem}>
                        <img src={require('./assets/reservations.png')} />
                        <h1>الحجــوزات</h1>
                    </div>
                    <div onClick={customersHandler} className={classes.flexItem}>
                        <img src={require('./assets/customers.png')} />
                        <h1>الزبائـن</h1>
                    </div>
                    <div onClick={sellingHandler} className={classes.flexItem}>
                        <img src={require('./assets/cart.png')} />
                        <h1>بيع منتجات</h1>
                    </div>
                    <div onClick={sellingServicesHandler} className={classes.flexItem}>
                        <img src={require('./assets/services.png')} />
                        <h1>خدمـات</h1>
                    </div>
                    <div onClick={sellingProductListHandler} className={classes.flexItem}>
                        <img src={require('./assets/cart.png')} />
                        <h1>المنتجات التى تم بيعها</h1>
                    </div>
                    <div onClick={sellingServicesListHandler} className={classes.flexItem}>
                        <img src={require('./assets/services.png')} />
                        <h1>الخدمات التى تم تقديمها</h1>
                    </div>
                    {localStorage.getItem('type') === 'Owner' && <div onClick={incomeListHandler} className={classes.flexItem}>
                        <img src={require('./assets/Income.png')} />
                        <h1>الدخـل</h1>
                    </div>}
                    <div onClick={purchasesHandler} className={classes.flexItem}>
                        <img src={require('./assets/services.png')} />
                        <h1>المشتريات</h1>
                    </div>
                    {/* <div onClick={attendanceHandler} className={classes.flexItem}>
                        <img src={require('./assets/attendance.png')} />
                        < h1 > تسجيل حضور وإنصراف</h1>
                    </div> */}
                    {localStorage.getItem('type') === 'Owner' && <div onClick={assetsHandler} className={classes.flexItem}>
                        <img src={require('./assets/assets.png')} />
                        < h1 > ممتلكات المكان</h1>
                    </div>}
                </div>
            </div >
        </>
    )
}

export default Home;