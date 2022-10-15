import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import Crypto from './components/Crypto/Crypto';
import Dashboard from './components/Dashboard/Dashboard';
import News from './components/News/News';
import Profile from './components/Profile/Profile';
import RecoverPassword from './components/RecoverPassword/RecoverPassword';
import NewPassword from './components/RecoverPassword/NewPassword';
import Stock from './components/Stock/Stock';
import Friends from './components/Friends/Friends';
import Notifications from './components/Notifications/Notifications';
import PaymentFeedback from './components/Payment/PaymentFeedback';
import CryptoPayment from './components/Payment/CryptoPayment';
import ChatList from './components/Chat/ChatList';
import Wallet from './components/Wallet/Wallet';
import { FinnhubProvider } from 'react-finnhub'
import StockCryptoHandler from './handlers/StockCryptoHandler'

function App() {
  const operateHandler = new StockCryptoHandler()
  const {userID} = useParams()

  return (
    <FinnhubProvider client={operateHandler.client_stock}>
      <Router>
        <Routes>
          <Route path="" element={<Login/>} />
          <Route path="login/:sth" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="cryptoPayment" element={<CryptoPayment/>} />
          <Route path="paymentFeedback" element={<PaymentFeedback/>} />
          <Route path="chatList" element={<ChatList/>}/>
          <Route path="chat" element={<Chat/>}>
            <Route path=":userID" element={<Chat/>}/>
          </Route>
          <Route path="crypto" element={<Crypto/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="news" element={<News/>} />
          <Route path="profile" element={<Profile/>}>
            <Route path=":userID" element={<Profile/>}/>
          </Route>
          <Route path="stock" element={<Stock/>} />
          <Route path="recoverPassword" element={<RecoverPassword/>} />
          <Route path="newPassword/:id/:sth" element={<NewPassword/>} />
          <Route path="friends" element={<Friends/>} />
          <Route path="notifications" element={<Notifications/>}/>
          <Route path="myWallet/:code" element={<Wallet/>}>

          </Route>
        </Routes>
      </Router>
    </FinnhubProvider>
  );
}

export default App;
