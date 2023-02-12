import React from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate, useParams} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import styled from 'styled-components'
import AccountHandler from '../../handlers/AccountHandler'
import { Modal, Typography, Box, Button } from '@mui/material';

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
    border:1px solid #999;
    border-radius:10px;
`
const Input = styled.input`
    display:block;
    width: 18vw;
    height: 4vh;
    border:none;
    border-radius:10px;
`

function NewPassword() {
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()
    const {userID} = useParams()
    const account_handler = new AccountHandler()

    const onSubmit = (data) => {
        account_handler.setNewPassword(userID, data).then(res => {
            navigate('/login/login')
        })
    }

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField>
                        <Input type="password" placeholder='Enter new password' {...register('password')}/>
                    </InputField>
                    
                    <Input type="submit" value="Submit"/>
                </form>
            </Container>
        </>
    )
}

export default NewPassword