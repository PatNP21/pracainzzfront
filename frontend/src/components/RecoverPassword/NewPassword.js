import React from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import styled from 'styled-components'
import AccountHandler from '../../handlers/AccountHandler'

const Container = styled.div`
    width:fit-content;
    height:fit-content;
    padding: 20px;
    box-shadow: 2px 2px 2px #777;
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
    const [cookies] = useCookies()

    const account_handler = new AccountHandler()

    const onSubmit = (data) => {
        console.log(data)
        account_handler.setNewPassword(cookies.loginData[0].id, data).then(res => {
            navigate('/login/login')
        })
    }

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField>
                    <Input type="password" placeholder='Enter new pasword' {...register('password')}/>
                </InputField>
                
                <InputField>
                    <Input type="password" placeholder='Repeat the password' {...register('repeatPassword')}/>
                </InputField>
                
                <Input type="submit" value="Submit"/>
            </form>
        </Container>
    )
}

export default NewPassword