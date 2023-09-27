import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, createContext } from 'react';
import Header from './header';
import IssuerOperationQueue from './pages/issuer/issuerOperationQueue';
import IssuerClaim from './pages/issuer/issuerClaim';
import Nav from './nav';
import HolderClaim from './pages/holder/holderClaim';
import HolderService from './pages/holder/holderService';
import HolderVerify from './pages/holder/holderVerify';
import Verifier from './pages/verifier';
import Proof from './pages/verifier/proof';

export const UserContext = createContext();
export const accounts = [
  { type: 'Issuer', name: 'Bob', issuerId: "14076528019241021960815305186827999223400239380336383241205413459461064163623" },
  { type: 'Holder', name: 'Alice', holderId: "9859125579138936563229912411432492021298121851688123529289394439737959991133" },
  { type: 'Verifier', name: 'DAO' },
  { type: 'Verifier', name: 'Escrow service' }
]


function App() {
  var [accountIndex, setAccountIndex] = useState(0);

  return (
    <UserContext.Provider value={{ accountIndex, setAccountIndex }}>
      <Router>
        <Header />
        <div style={{
          'display': 'flex',
          'height': '100vh'
        }}>
          <Nav />
          <div className='container'>
            <Routes>

              <Route exact path="/issuer/:issuerId/claim" element={<IssuerClaim />} />
              <Route exact path="/issuer/:issuerId/operationQueue" element={<IssuerOperationQueue />} />

              <Route exact path="/holder/:holderId/claim" element={<HolderClaim />} />
              <Route exact path="/holder/:holderId/issuer" element={<HolderService />} />
              <Route exact path="/holder/:holderId/verifier" element={<HolderVerify />} />

              <Route exact path="/verifier/" element={<Verifier />} />
              <Route exact path="/verifier/:queryId/proof" element={<Proof />} />


            </Routes>
          </div>

        </div>

      </Router>
    </UserContext.Provider>
  );
}

export default App;
