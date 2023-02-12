import React, {useState, useEffect} from 'react'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useLocation, useNavigate } from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'

const ChoiceContainer = styled.div`
    float:left;
    width:35vw;
    margin:10vh 10vw;
    height:fit-content;
    border-radius:10px;
    box-shadow:0 0 3px gray;   
    padding:2vh 0 2vh 5vw;
`
const FormContainer = styled.form`
    margin:10vh auto;
    float:left;
    width:20vw;
    height:fit-content;
    border-radius:10px;
    box-shadow:0 0 3px gray;   
    padding:2vh 0;
`
const FormInput = styled.input`
    border-radius:8px;
    width:18vw;
    height:4vh;
    margin:1vh auto;
    display:block;
    border:1px solid gray;
`

function Payment() {

    const stock_crypto_handler = new StockCryptoHandler()

    const stripeKey = loadStripe("pk_test_51LnUboDIfBxVZtZzbP6OX1I4rJBANa79eenkO9fHUXg0xuiAFCTCuLCkv6KwuS3JChMmMM9YsIZlA0rqD1bfGQ6u00Sso7PUXB")
    //const stripeClientServer = 'sk_test_51LnUboDIfBxVZtZzXpHT2Bqu24JfNb0t3lW3clIBSin5sIBN5gCGHqZNpE6PqnpyfC8GBE4rnhqsUiAcouktxv7j00wzxPpnQu'
    
    const {register, handleSubmit} = useForm()
    const [cookies] = useCookies()
    const {state} = useLocation()
    const navigate = useNavigate()
    const [clientCipher, setClientCipher] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        console.log(`state: ${state.item}, ${state.price}`)
    })

    const onSubmit = (data) => {
        console.log({
            userid: cookies.loginData.data.user[0].id,
            email: cookies.loginData.data.user[0].email,
            quantity: Number(quantity),
            element: state.item,
            quantity: quantity,
            totalPrice: totalPrice,
            cardNumber: data.cardNumber,
            cardExpDate: data.cardExpDate,
            cardCVV: data.cardCVV
        })
        stock_crypto_handler.paymentSession({
            userid: cookies.loginData.data.user[0].id,
            email: cookies.loginData.data.user[0].email,
            quantity: Number(quantity),
            element: state.item,
            quantity: quantity,
            totalPrice: totalPrice,
            cardNumber: data.cardNumber,
            cardExpDate: data.cardExpDate,
            cardCVV: data.cardCVV
        }).then(res => {
            console.log(res)
            console.log({
                item: state.item,
                owner: Number(cookies.loginData.data.user[0].id),
                quantity: Number(quantity)
            })
            stock_crypto_handler.buyStock({
                item: state.item,
                owner: Number(cookies.loginData.data.user[0].id),
                quantity: Number(quantity)
            }).then(response => {
                console.log(response)
            }).catch(err => {
                console.log(err)
            })
            navigate(`/myWallet/${cookies.loginData.data.user[0].id}`)
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <>
            <Header/>
            <ChoiceContainer>
                <p>Element: {state.item}</p>
                <p>Quantity: </p>
                <input placeholder='Quantity ex.200' onChange={(e) => {
                    setQuantity(e.target.value)
                }}/>
                <button onClick={() => {
                    setTotalPrice(Number(state.price)*Number(quantity))
                    console.log(`totalPrice: ${totalPrice}`)
                    setTimeout(() => setClientCipher(true), 5000)
                }}>Set quantity</button>
                <p>Total price: {totalPrice}$</p>
            </ChoiceContainer>
            
            {clientCipher && (
                <Elements stripe={stripeKey}>
                    <FormContainer onSubmit={handleSubmit(onSubmit)}>
                        <FormInput {...register('cardNumber')} placeholder='Card number'/>
                        <FormInput {...register('cardExpDate')} placeholder="MM/YY"/>
                        <FormInput {...register('cardCVV')} placeholder='CVV'/>
                        <FormInput style={{cursor:'pointer'}} type="submit" value="Buy"/>
                    </FormContainer>
                </Elements>
            )}
        </>
    )
}

export default Payment