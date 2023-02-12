import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import AccountHandler from './../../handlers/AccountHandler'
import Modal from './../../modals/Modal'

const Container = styled.div`
    width:fit-content;
    height:fit-content;
    padding: 20px;
    box-shadow: 0 0 3px #666;
    border-radius:10px;
    margin: 20vh auto;
`
const InputField = styled.div`
    width:fit-content;
    height:fit-content;
    margin: 1vh 0;
    border:none;
    box-shadow:0 0 1px #666;
    border-radius:10px;
`
const Input = styled.input`
    display:block;
    width: 18vw;
    height: 4vh;
    border:none;
    border-radius:10px;
`

function RecoverPassword() {
    const {register, handleSubmit} = useForm(false)
    const [sentEmailStatus, setSentEmailStatus] = useState()
    const [error, setError] = useState(false)
    const account_handler = new AccountHandler()

    const verifyEmail = (data) => {
        console.log(data)
        account_handler.verifyEmail(data).then(res => {
            setSentEmailStatus(true)
        }).catch(err => {
            setError(true)
        })
    }

    return (
        <Container>
            {!sentEmailStatus ? <form onSubmit={handleSubmit(verifyEmail)}>
                <InputField>
                    <Input type="text" placeholder='Enter your email' {...register('email')}/>
                </InputField>
                
                <Input type="submit" value="Submit"/>
            </form> : <p>Your recoverPassword link has been sent. Check your email!</p>}
        </Container>
    )
}

export default RecoverPassword