import React, { useEffect,useState } from "react";
import CryptoCoder from "./contracts/CryptoCoders.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container } from 'react-bootstrap';

import "./App.css";


function App() {

//Load web3 account from Metamask
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [mintText, setMintText] = useState("");
  const [coders, setCoders] = useState([]);

  const loadWeb3Account = async (web3) =>{
    const accounts = await web3.eth.getAccounts();
   
    if(accounts){
      setAccount(accounts[0]);
    }
  }

//Load the contract
const loadWeb3Contract = async (web3) => {
  const networkId = await web3.eth.net.getId();

  const networkData = CryptoCoder.networks[networkId];
  
  if(networkData){
    const abi = CryptoCoder.abi;
    const address = networkData.address;
    const contract = new web3.eth.Contract(abi, address);
    setContract(contract);
    return contract;
  }
}

//Load all the NFTS
const loadNFTS = async (contract) => {
const totalSupply = await contract.methods.totalSupply().call();
let nfts = [];
for(let i=0;i<totalSupply;i++){
  let coder = await contract.methods.coders(i).call();
  nfts.push(coder);
}
setCoders(nfts);
}

//mint
const mint = () => {
  console.warn('check',mintText)
  contract.methods.mint(mintText).send({ from: account },(error) => {
    if(!error){
      setCoders([...coders,mintText])
      setMintText("");
    }
  })
}



  useEffect(async ()=>{
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
   let contract =  await loadWeb3Contract(web3);
   await loadNFTS(contract);
  }, [])

  return (
    <div>
    
    <Navbar bg="light">
    <Container>
      <Navbar.Brand href="#home">CryptoCoders</Navbar.Brand>
      <span>{account}</span>
    </Container>
  </Navbar>

  <div className="container-fluid mt-5">
  <div className="row">
      <div className="col d-flex flex-column align-items-center">
        <img className="mb-4" src="https://avatars.dicebear.com/api/pixel-art/naz.svg" width="72" />
        <h1 className="display-5 fw-bold">CryptoCoders</h1>
        <div className="col-6 text-center">
        <p className="lead text-center">These are some of the most highly motivated coders in the world! We are here to learn coding and apply it to the betterment of humanity.</p>
        <div>
        <input type="text"
        placeholder="e.g. Sachin"
        className="form-control mb-2"
        value={mintText}
        onChange={(e)=>setMintText(e.target.value)}
        />
        <button onClick={mint} className="btn btn-primary">Mint</button>
        </div>
        </div>

        

        <div className="col-8 d-flex justify-content-center flex-wrap">
        {coders.map((coder,key)=><div key={key} className="d-flex flex-column align-items-center">
          <img width="150" src={`https://avatars.dicebear.com/api/pixel-art/${coder}.svg`} />
         <span>{coder}</span>
          </div>)}
      </div>
      </div>
     
  </div>
  </div>

  </div>
  )
}

export default App
