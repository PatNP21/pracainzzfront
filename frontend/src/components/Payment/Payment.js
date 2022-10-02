import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'

const ChoiceContainer = styled.div`
    float:left;
    width:40vw;
    margin:3vh auto;
    height:fit-content;
    border-radius:10px;
    box-shadow:0 0 3px gray;   
    padding:2vh 0;
`
const FormContainer = styled.form`
    margin:3vh auto;
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

function Payment(props) {

    const stock_crypto_handler = new StockCryptoHandler()

    const {register, handleSubmit} = useForm()

    const [quantity, setQuantity] = useState(0)
    let totalPrice

    const onSubmit = (data) => {
        console.log(data)
        stock_crypto_handler.paymentSession({
            element: props.cryptocurrency,
            quantity: quantity,
            totalPrice: totalPrice
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <>
            <Header/>
            <ChoiceContainer>
                <p>Element: {props.cryptocurrency}</p>
                <p>Quantity: </p>
                <input placeholder='Quantity' onChange={(e) => {
                    setQuantity(e.target.value)
                    totalPrice = Number(props.price)*quantity
                }}/>
                <p>Total price: {totalPrice}</p>
            </ChoiceContainer>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <FormInput placeholder='Card number'/>
                <FormInput placeholder="MM/YY"/>
                <FormInput placeholder='CVV'/>
                <FormInput style={{cursor:'pointer'}} type="submit" value="Buy"/>
            </FormContainer>
        </>
    )
}

export default Payment