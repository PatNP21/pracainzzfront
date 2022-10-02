import React from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'

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

    const {register, handleSubmit} = useForm()
    let totalPrice

    const onSubmit = (data) => {
        console.log(data)
    }


    return (
        <>
            <Header/>
            <ChoiceContainer>
                <p>Crypto: {props.cryptocurrency}</p>
                <p>Amount: </p>
                <input placeholder='Amount'/>
                <p>Total price: </p>
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