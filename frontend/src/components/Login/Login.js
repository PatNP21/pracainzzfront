import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import styled from 'styled-components'
import AccountHandler from '../../handlers/AccountHandler'
import LoadingModal from '../../modals/LoadingModal';
import { Modal, Typography, Box, Button } from '@mui/material';

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
const A = styled.a`
    text-align:center;
    display:block;
    margin:1vh 0;
`
const SubmitBtn = styled.input`
    display:block;
    width: 18vw;
    height: 4vh;
    border:none;
    border-radius:10px;
    cursor:pointer;
`
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: 'white',
    borderRadius: '10px',
    boxShadow: '0 0 3px gray',
    p: 2,
};

function Login() {

    const {register, handleSubmit} = useForm()

    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies()
    const [waitingForResponseModal, setWaitingForResponseModal] = useState(false)
    const [openSuccessModal, setOpenSuccessModal] = useState(false)
    const [openFailureModal, setOpenFailureModal] = useState(false)

    const account_handler = new AccountHandler()

    const onSubmit = (data) => {
        console.log(data)
        setWaitingForResponseModal(true)
        account_handler.logToService(data).then(res => {
            setWaitingForResponseModal(false)
            console.log(res)
            setCookie('loginData', res, {SameSite: 'none'})
            navigate('/dashboard')
        }).catch(err => {
            setWaitingForResponseModal(false)
            console.log(err)
            setOpenFailureModal(true)
            alert('User not found')
        })
    }

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField>
                        <Input type="text" placeholder='Email or username' {...register('user')}/>
                    </InputField>
                    
                    <InputField>
                        <Input type="password" placeholder='Password' {...register('password')}/>
                    </InputField>
                    
                    <SubmitBtn type="submit" value="Sign in"/>
                    <A href="/recoverPassword">Forgot your password</A>
                    <A href='/register'>Create a new account</A>
                </form>
            </Container>
            {/*waitingForResponseModal && 
                <Modal>
                </Modal>
            */}
            <Modal
                open={openFailureModal}
                onClose={() => setOpenFailureModal(false)}
            >
                <Box style={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        User not found. Make sure you entered proper data!
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default Login