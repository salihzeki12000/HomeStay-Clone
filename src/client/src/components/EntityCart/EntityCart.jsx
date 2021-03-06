import React, { useState, useEffect } from 'react'
import styles from "./EntityCart.module.css"
import { useSelector, useDispatch } from "react-redux"
import ContactHostModal from '../ContactHostModal/ContactHostModal'
import { v4 as uuidv4 } from "uuid"
import { Start_Payment_Query } from "../../redux/PaymentRedux/action.js"

export default function EntityCart(props) {
    let { booking_guest, nights, available } = useSelector(state => state.booking)
    let { name, price_1_night } = useSelector(state => state.entity.bedroom)
    let { apartment_id } = useSelector(state => state.entity)
    let {logged_user,token} = useSelector(state=>state.auth)

    const [pay, setPay] = useState(false)
    const [cost, setCost] = useState()
    const [booking_fee, setBookingFee] = useState()
    const [totalcost, setTotalCost] = useState()

    let dispatch = useDispatch()


    useEffect(() => {
        setCost(price_1_night * nights)
        setBookingFee(Math.ceil(price_1_night * 15 * nights / 100))
        setTotalCost((price_1_night + (Math.ceil(price_1_night * 15 / 100))) * nights)
    }, [nights])

    if (booking_guest <= 0 || available === false) {
        return null
    }

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    function handlePay(){
        if(logged_user){
            displayRazorpay()
        }
        else{
            window.$("#loginmodal").modal("toggle");
        }
    }

    async function displayRazorpay() {
        const res = await loadRazorpay()

        if (!res) {
            alert('RAZOR PAY NOT AVAILABLE')
            return
        }

        const order = {
            amount: totalcost * 100,
            order_currency: "INR",
            receipt: uuidv4(),
            payment_capture: 1

        }

        const data = await fetch("https://a9405ab030e4.ngrok.io/payment/order", {
            method: "POST",
            body: JSON.stringify(order)
        }).then((data) => {
            return data.json()
        })

        const options = {
            key: "rzp_test_VrRuDtzvF0WAPM",
            currency: data.currency,
            amount: data.amount.toString(),
            order_id: data.id,
            name: 'HomeStay',
            description: 'YAY!!',
            image: 'https://www.homestay.com/assets/logo-homestay-36a9388d17da279b965e5b0dc5153eab12f98ceef3e29332a720df00b71fa2ac.svg',
            handler: function (response) {
                let obj = {
                    payment: response,
                    booking_info: {
                        start: props.start,
                        end: props.end,
                        total_cost: totalcost,
                        apartment_id: apartment_id,
                        token,
                        response:response
                    }
                }
                dispatch(Start_Payment_Query(obj))
            },
            prefill: {
                name:"Charul",
                email: 'sdfdsjfh2@ndsfdf.com',
                phone_number: '9999999999'
            }
        }

        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }

    return (
        <>
            <div className={styles.footer}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-8">
                            <div className={styles.table_container}>
                                <table className="table table-borderless small">
                                    <tr>
                                        <th>You have selected</th>
                                        <th>Nights</th>
                                        <th>Price of Stay</th>
                                        <th>Booking Fee	</th>
                                        <th>Total</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>{booking_guest} Guest - {name}</p>
                                        </td>
                                        <td>
                                            <p>{nights}</p>
                                        </td>
                                        <td>
                                            <p>₹{cost}</p>
                                        </td>
                                        <td>
                                            <p>₹{booking_fee}</p>
                                        </td>
                                        <td>
                                            <p>₹{totalcost}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className="col-3 offset-1">
                            <div className={styles.button_container}>
                                <button className={styles.button} onClick={() => handlePay()}>Book Apartment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ContactHostModal start_date={props.start} end_date={props.end} pay={pay} setPay={setPay} nights={nights} />
        </>
    )
}
