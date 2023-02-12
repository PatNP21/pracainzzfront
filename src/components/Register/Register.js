import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import styled from 'styled-components'
import AccountHandler from './../../handlers/AccountHandler'

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

function Register() {
    const {register, handleSubmit} = useForm()

    //obsługa submit
    const [submittedSuccessfully, setSubmitedSuccessfully] = useState(false)

    const register_handler = new AccountHandler()

    const registerUser = (data) => {
        register_handler.registerNewUser(data).then(res => {
            console.log(res)
            setSubmitedSuccessfully(true)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <Container>
            {!submittedSuccessfully ? <form onSubmit={handleSubmit(registerUser)}>
                <InputField>
                    <Input type="text" placeholder='First name' {...register('firstName')}/>
                </InputField>
                <InputField>
                    <Input type="text" placeholder='Last name' {...register('lastName')}/>
                </InputField>
                <InputField>
                    <Input type="date" placeholder='Date of birth' {...register('dateOfBirth')}/>
                </InputField>
                <InputField>
                    <Input type="text" placeholder='Email' {...register('email')}/>
                </InputField>
                <InputField>
                    <Input type="text" placeholder='Username' {...register('username')}/>
                </InputField>
                <InputField>
                    <Input type="password" placeholder='Password' {...register('password')}/>
                </InputField>
                
                <Input type="submit" value="Sign up"/>
            </form> : <p>Activate your account by click the link delivered in email message!</p>}
        </Container>
    )
}

export default Register