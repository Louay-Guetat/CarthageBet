
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/DashboardAgent.css'

const ITEMS_PER_PAGE = 3;
const modes = [
    { name: 'SmartWalletEGP', image: 'smartwallet.png' },
    { name: 'We Pay', image: 'wepay.png' },
    { name: 'Fawry', image: 'fawry.png' },
    { name: 'Orange Payment', image: 'orange.png' },
    { name: 'InstaPay EGP', image: 'instapay.png' },
    { name: 'BM Wallet EGP', image: 'bmwallet.png' },
    { name: 'Vodafone', image: 'vodafone.png' },
    { name: 'Etisalat', image: 'Etisalat.png' },
  ];
const DashboardAgent = () =>{
    const location = useLocation();
    const navigate = useNavigate();

    const { username, role } = location.state;
    const [solde, setSolde] = useState();    
    const [wallet, setWallet] = useState();
    const [allWallets, setAllWallets] = useState();

    const [selectedOption, setSelectedOption] = useState('SmartWalletEGP');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        setWallet(allWallets.find(wallet => wallet.name === event.target.value).number)
    };

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await fetch(process.env.REACT_APP_API_URL+'/getUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username }),
            });
      
            if (response.ok) {
              const data = await response.json();
              setSolde(parseInt(data.solde));
              setAllWallets(data.wallets);

              const selectedWallet = data.wallets.find(wallet => wallet.name === selectedOption);
              setWallet(selectedWallet.number);
            } else {
              console.log('User not found or other error:', response.status);
            }
          } catch (error) {
            console.log('Error fetching user:', error);
          }
        };
      
        fetchUser();
      }, [username,wallet]); 
      
    const [detailsVisibility, setDetailsVisibility] = useState({});
    const [historyDetailsVisibility, setHistoryDetailsVisibility] = useState({});
    const [managerDetailsVisibility, setManagerDetailsVisibility] = useState({});
    const [agentsDetailsVisibility, setAgentsDetailsVisibility] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [edit, setEdit] = useState(false);

    const [data, setData] = useState(null);
    const [dataHistory, setDataHistory] = useState(null)
    const [total, setTotal] = useState(0)
    const [managerData, setManagerData] = useState(null)
    const [agents, setAgents] = useState(null)

    const [menu, setMenu] = useState('none')
    const [history, setHistory] = useState('none')
    const [agentsStyle, setAgentsStyle] = useState('none')

    const displayMenu = () =>{
        setMenu('flex')
        setHistory('none')
        setAgentsStyle('none')
        setAddAgentStyle('none')
    }

    const displayHistory = () =>{
        setHistory('flex')
        setMenu('none')
        setAgentsStyle('none')
        setAddAgentStyle('none')
    }

    const displayAgents = () =>{
        setAgentsStyle('flex')
        setMenu('none')
        setHistory('none')
        setAddAgentStyle('none')
    }

    const toggleDetails = (index) => {
        setDetailsVisibility((prevVisibility) => {
          const updatedVisibility = { [index]: !prevVisibility[index] };
      
          Object.keys(prevVisibility).forEach((prevIndex) => {
            if (prevIndex !== index && prevVisibility[prevIndex]) {
              updatedVisibility[prevIndex] = false;
            }
          });
      
          return updatedVisibility;
        });
      };

    const toggleHistoryDetails = (index) =>{
        setHistoryDetailsVisibility((prevVisibility) => {
            const updatedVisibility = { [index]: !prevVisibility[index] };
        
            Object.keys(prevVisibility).forEach((prevIndex) => {
              if (prevIndex !== index && prevVisibility[prevIndex]) {
                updatedVisibility[prevIndex] = false;
              }
            });
        
            return updatedVisibility;
          });
    }

    const toggleManagerDetails = (index) =>{
        setManagerDetailsVisibility((prevVisibility) => {
            const updatedVisibility = { [index]: !prevVisibility[index] };
        
            Object.keys(prevVisibility).forEach((prevIndex) => {
              if (prevIndex !== index && prevVisibility[prevIndex]) {
                updatedVisibility[prevIndex] = false;
              }
            });
        
            return updatedVisibility;
          });
    }

    const toggleAgentsDetails = (index) =>{
        setAgentsDetailsVisibility((prevVisibility) => {
            const updatedVisibility = { [index]: !prevVisibility[index] };
        
            Object.keys(prevVisibility).forEach((prevIndex) => {
              if (prevIndex !== index && prevVisibility[prevIndex]) {
                updatedVisibility[prevIndex] = false;
              }
            });
        
            return updatedVisibility;
          });
    }

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(process.env.REACT_APP_API_URL+'/getdata');
            const responseHistory = await fetch(process.env.REACT_APP_API_URL+'/getHistory');
            const managerData = await fetch(process.env.REACT_APP_API_URL+'/getManagerData');
            const agentsReponse = await fetch(process.env.REACT_APP_API_URL+'/getAgents');

            const jsonData = await response.json();
            const jsonHistoryData = await responseHistory.json();
            const jsonManagerData = await managerData.json();
            const jsonAgentsData = await agentsReponse.json();
            
            const filteredData = jsonData.filter((item) => {
                if (allWallets){
                    const walletExists = allWallets.some(walletObj => walletObj.number === item.wallet);
                    return item.status === false && walletExists;
                }
            });

            let filteredDataHistory = undefined
            if(role === 'agent'){
                filteredDataHistory = jsonHistoryData.filter((item) => item.wallet === wallet);
            }else{
                filteredDataHistory = jsonHistoryData
            }
            let amounts = 0
            filteredDataHistory.map((item) => amounts = amounts + parseInt(item.montant))

            setTotal(amounts)
            setData(filteredData);
            setDataHistory(filteredDataHistory);
            setManagerData(jsonManagerData);
            setAgents(jsonAgentsData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, [wallet]);
      

    let totalItems = data ? data.length : 0;
    let totalHistoryItems = dataHistory ? dataHistory.length : 0;
    let totalManagerItems = managerData ? managerData.length : 0;
    let totalAgentsItems = agents ? agents.length : 0;

    let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    let totalHistoryPages = Math.ceil(totalHistoryItems / ITEMS_PER_PAGE);
    let totalManagerPages = Math.ceil(totalManagerItems / ITEMS_PER_PAGE);
    let totalAgentsPages = Math.ceil(totalAgentsItems / ITEMS_PER_PAGE);
    
    let startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    let endIndex = startIndex + ITEMS_PER_PAGE;
    const itemsToShow = data ? data.slice(startIndex, endIndex) : [];
    const historyItemsToShow = dataHistory ? dataHistory.slice(startIndex, endIndex) : [];
    const managerItemsToShow = managerData ? managerData.slice(startIndex, endIndex) : [];
    const agentsItemsToShow = agents ? agents.slice(startIndex, endIndex) : [];

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    
    const handleHistoryPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    const handleHistoryNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalHistoryPages));
    };

    const handleManagerPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    const handleManagerNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalManagerPages));
    };

    const handleAgentsPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    const handleAgentsNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalAgentsPages));
    };

    const acceptPaiement = async (id, montant) => {
        const updatedData = data.filter((item) => {
            if(item.id === id){
                item.status = 'قبول'
                item.method = 'إيداع'
                item.agent = username
                item.wallet = wallet
                return item;
            }else{
                return null
            }
        });

        if(solde >= montant ){
            if(updatedData !== null){
                try{
                    await fetch(process.env.REACT_APP_API_URL+'/updateData', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });
                    
                    setData((prevData) => prevData.filter((item) => item.id !== id));
                    
                    montant = solde - parseInt(montant)
                    setSolde(montant)
                    

                    await fetch(process.env.REACT_APP_API_URL+'/updateSolde', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({"username": username, "solde": montant}),
                    });
                }catch(error){
                    console.log(error)
                }
            }else{
                toast.error( "Unexpected Error", {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            }
        
        }else{
            toast.error( "ليس لديك ما يكفي من النقد.", {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
        
    };

    const declinePaiement = async (id) => {
        const updatedData = data.filter((item) => {
            if(item.id === id){
                return item;
            }else{
                return null
            }
        });
        
        if(updatedData !== null){
            try{
                await fetch(process.env.REACT_APP_API_URL+'/declineOrder', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
    
                setData((prevData) => prevData.filter((item) => item.id !== id));
            }catch(error){
    
            }
        } else{

        }
        
    };

    const saveWallet = async (username, wallet) =>{
        try{
            await fetch(process.env.REACT_APP_API_URL+'/editWallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username, wallet: wallet, name: selectedOption}),
            });

        }catch(error){

        }
    }

    const editWallet = (username) =>{
        if(edit === true){
            let editValue = document.getElementById('editWallet').value
            saveWallet(username, editValue);
            setWallet(editValue)
            setEdit(false)
        }
        
        if(edit === false){
            setEdit(true)
        }
    }

    const Logout = () =>{
        navigate("/loginDashboard")
    }

    const handleClick = async (id) =>{
        const updatedData = dataHistory.filter((item) => {
            if(item.id === id){
                item.handled = 'تم التعامل'
                return item;
            }else{
                return null
            }
        });

        if(updatedData !== null){
            try{
                const response = await fetch(process.env.REACT_APP_API_URL+'/handleData', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                await response.json();
                setDataHistory((prevData) => prevData.filter((item) => item.id !== id));
                const managerData = await fetch(process.env.REACT_APP_API_URL+'/getManagerData');
                const jsonManagerData = await managerData.json();
                setManagerData(jsonManagerData);

            }catch(error){
                
            }
        }   
    }

    const [addAgentStyle, setAddAgentStyle] = useState('none')

    const [agentUsername, setAgentUsername] = useState()
    const [agentPassword, setAgentPassword] = useState()
    const [agentSolde, setAgentSolde] = useState()
    const [agentWallets,setAgentWallets] = useState([
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                        {"name":'',"number":undefined},
                                                    ])
    
    const [buttonName, setButtonName] = useState("إضافة وكيل")

    const addAgent = (username, password, solde, wallets) =>{
        if(username && password && solde && wallets){
            setAgentUsername(username)
            setAgentPassword(password)
            setAgentSolde(solde)
            setAgentWallets(wallets)  
            setButtonName("تعديل وكيل")
        }
        else{
            setButtonName("إضافة وكيل")
            setAgentUsername(undefined)
            setAgentPassword(undefined)
            setAgentSolde(undefined)
            setAgentWallets([
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
                {"name":undefined,"number":undefined},
            ]) 
        }
        setAddAgentStyle('flex')
        setAgentsStyle('none')
    }

    const addAgentSubmit = async (status) =>{
        const data = {
            'username': agentUsername,
            'password': agentPassword,
            'solde': agentSolde,
            'wallets': agentWallets,
            'role': 'agent'
        };
        let agentsBool = true
        let i = 0

        while (i < agentWallets.length && agentsBool === true){
            if (agentWallets[i].name === undefined){
                agentsBool = false
            }else{
                i++;
            }
        }

        if(agentUsername !== undefined && agentPassword !== undefined && agentSolde !== undefined && agentWallets.name !== false){
            try {
                if(status === 'add'){
                    const response = await fetch(process.env.REACT_APP_API_URL+'/addAgent', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
            
                    await response.text();
                    toast.success('Agent ajouté!', {
                        position: 'top-center',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                    setAddAgentStyle('none')
                    setAgentsStyle('flex')
                }else{
                    const response = await fetch(process.env.REACT_APP_API_URL+'/editAgent', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({"agent" : data}),
                    });
            
                    await response.text();
                    toast.success('Agent Modifié!', {
                        position: 'top-center',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                    });
                    setAddAgentStyle('none')
                    setAgentsStyle('flex')
                }
                
            } catch (error) {
                console.error('Error saving data:', error);
            }  
        }else{
            toast.error('يجب ملء جميع الحقول', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
        }
                
    }

    const searchBills = (searchText) => {
        const filteredData = data.filter((detail) =>
            Object.values(detail).some(
            (value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        itemsToShow = (filteredData.slice(0, 5));
        totalPages = (Math.ceil(filteredData.length / 5));
        setCurrentPage(1);
        startIndex = 0;
        setDetailsVisibility(new Array(filteredData.length).fill(false));
    };

    const searchHistoryBills = (searchText) => {
        const filteredHistoryData = dataHistory.filter((detail) =>
            Object.values(detail).some(
            (value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        historyItemsToShow = (filteredHistoryData.slice(0, 5));
        totalHistoryPages = (Math.ceil(filteredHistoryData.length / 5));
        setCurrentPage(1);
        startIndex = 0;
        setHistoryDetailsVisibility(new Array(filteredHistoryData.length).fill(false));
    };

    const searchHistoryManager = (searchText) => {
        const filteredManagerData = managerData.filter((detail) =>
            Object.values(detail).some(
            (value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        managerItemsToShow = (filteredManagerData.slice(0, 5));
        totalManagerPages = (Math.ceil(filteredManagerData.length / 5));
        setCurrentPage(1);
        startIndex = (0);
        setManagerDetailsVisibility(new Array(filteredManagerData.length).fill(false));
    };

    const searchHistory = (searchText) => {
        const filteredHistoryData = dataHistory.filter((detail) =>
            Object.values(detail).some(
            (value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        historyItemsToShow = (filteredHistoryData.slice(0, 5));
        totalHistoryPages = (Math.ceil(filteredHistoryData.length / 5));
        setCurrentPage(1);
        startIndex = (0);
        setHistoryDetailsVisibility(new Array(filteredHistoryData.length).fill(false));
    };

    const searchAgents = (searchText) => {
        const filteredAgentsData = agents.filter((detail) =>
            Object.values(detail).some(
            (value) =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        );
        agentsItemsToShow = (filteredAgentsData.slice(0, 3));
        totalAgentsPages = (Math.ceil(filteredAgentsData.length / 3));
        setCurrentPage(1);
        startIndex = (0);
        setAgentsDetailsVisibility(new Array(filteredAgentsData.length).fill(false));
    };
    
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    
    return (
        <div className="Dashboard-Agent">
            <ToastContainer />
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' />
            {/*  Dashboard Agent */}
            {role === 'agent' ? (
                <>
                    <h1 class="notification-icon">
                        مرحبًا {username}
                        <span class="notification-count">{data ? data.length : 0}</span>
                    </h1>
                    <h3 style={{ color: 'white' }}>الرصيد : {solde} £ </h3>
                    <nav className='navbar'>
                        <button onClick={displayMenu}> الفواتير </button>
                        <button onClick={displayHistory}> سجل الفواتير </button>
                        <button onClick={Logout}> تسجيل الخروج </button>
                    </nav>
                    <div className='editWallet'>  
                        <select id="comboBox" value={selectedOption} onChange={handleChange}>
                            {modes && modes.map((mode) => (
                                <option key={mode.id} value={mode.name}>
                                    {mode.name}
                                </option>
                            ))}
                        </select>
                        <p style={edit === false ? {display:'flex'} : {display:'none'}}>رقم المحفظة: {wallet} </p>
                        <input id='editWallet' defaultValue={wallet} type='text' style={edit === true ? {display:'flex'} : {display:'none'}} />
                        <button className='edit-icon' onClick={() => editWallet(username,wallet)}>&#9998;</button>
                    </div>
                    <div style={{display:menu}} className='method-action'>
                        <h1> إيداع </h1>
                        <input type='text' onChange={(e) => searchBills(e.target.value)} />
                        {data && data.length !== 0 ? (
                            <>
                                {itemsToShow.map((detail, index) => (
                                <div className="details-toggle" key={'detail' + index}>
                                    <div className='details-header' onClick={() => toggleDetails(startIndex + index)}>
                                    <span className="toggle-text">
                                        {detailsVisibility[startIndex + index] ? '▲' : '▼'} تفاصيل
                                    </span>
                                    <span className="id-value">{detail.id}</span>
                                    </div>
                                    {detailsVisibility[startIndex + index] && (
                                    <div className="details">
                                        <div className='data-row' key={'detail' + index}>
                                        <div className='credentials'>
                                            <p> ID: {detail.id} </p>
                                            <p> إسم المستخدم: {detail.nom} </p>
                                            <p> رقم الهاتف: {detail.num} </p>
                                        </div>
                                        <div className='credentials'>
                                            <p> المحفظة: {detail.wallet} </p>
                                            <p> المبلغ: {detail.montant} £ </p>
                                            <p> وسيلة الدفع: {detail.mode_paiement} </p>
                                        </div>
                                        </div>
                                        <div className='actions'>
                                        <button className='accepter' onClick={(e) => acceptPaiement(detail.id, detail.montant)}> قبول </button>
                                        <button className='refuser' onClick={(e) => declinePaiement(detail.id)}> رفض </button>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                ))}
                                <div className="pagination">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                        &#8594; السابق
                                    </button>
                                    <span>{`الصفحة ${currentPage} من ${totalPages}`}</span>
                                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                        التالي &#8592;
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>لا توجد بيانات لعرضها</h1>
                            </>
                        )}
                    </div>
                    <div style={{display:history}} className='history'>
                    {dataHistory && dataHistory.length !== 0 ? (
                            <>
                                <input type='text' onChange={(e) => searchHistoryBills(e.target.value)} />
                                {historyItemsToShow.map((detail, index) => (
                                <div className="details-toggle" key={'history' + index}>
                                    <div className='details-header' onClick={() => toggleHistoryDetails(startIndex + index)}>
                                    <span className="toggle-text">
                                        {historyDetailsVisibility[startIndex + index] ? '▲' : '▼'} تفاصيل
                                    </span>
                                    <span className="id-value">{detail.id}</span>
                                    </div>
                                    {historyDetailsVisibility[startIndex + index] && (
                                    <div className="details">
                                        <div className='data-row' key={'detail' + index}>
                                            <div className='credentials'>
                                                <p> ID: {detail.id} </p>
                                                <p> رقم الهاتف: {detail.num} </p>
                                                <p> الجواب: {detail.status} </p>
                                                <p> سحب / إيداع: {detail.method} </p>
                                            </div>
                                            <div className='credentials'>
                                                <p> إسم المستخدم: {detail.nom} </p>
                                                <p> المبلغ: {detail.montant} £ </p>
                                                <p> وسيلة الدفع: {detail.mode_paiement} </p>
                                                <p> المحفظة: {detail.wallet} </p>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                ))}
                                <p style={{backgroundColor:'green', padding:'1rem', borderRadius:'5rem'}}>المبلغ الجملي = {total} £ </p>
                                <div className="pagination">
                                    <button onClick={handleHistoryPrevPage} disabled={currentPage === 1}>
                                        &#8594; السابق
                                    </button>
                                    <span>{`الصفحة ${currentPage} من ${totalHistoryPages}`}</span>
                                    <button onClick={handleHistoryNextPage} disabled={currentPage === totalHistoryPages}>
                                        التالي &#8592;
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1>لا توجد بيانات لعرضها</h1>
                            </>
                        )}
                    </div>
                </>
                
            ) : (
                <>
                {/*  Dashboard Manager */}
                    <h1 class="notification-icon">
                        مرحبًا {username}
                        <span class="notification-count">{dataHistory ? dataHistory.length : 0}</span>
                    </h1>
                    <nav className='navbar'>
                        <button onClick={displayMenu}> الفواتير </button>
                        <button onClick={displayHistory}> سجل الفواتير </button>
                        <button onClick={displayAgents}> الوكلاء </button>
                        <button onClick={Logout}> تسجيل الخروج </button>
                    </nav>
                    <div className='notifications'>
                        <div style={{display:menu}} className='history'>
                            {dataHistory && dataHistory.length !== 0 ? (
                                    <>
                                        <input type='text' onChange={(e) => searchHistoryManager(e.target.value)} />
                                        {historyItemsToShow.map((detail, index) => (
                                        <div className="details-toggle" key={'history' + index}>
                                            <div className='details-header' onClick={() => toggleHistoryDetails(startIndex + index)}>
                                            <span className="toggle-text">
                                                {historyDetailsVisibility[startIndex + index] ? '▲' : '▼'} تفاصيل
                                            </span>
                                            <span className="id-value">{detail.id}</span>
                                            </div>
                                            {historyDetailsVisibility[startIndex + index] && (
                                            <div className="details">
                                                <div className='data-row' key={'detail' + index}>
                                                    <div className='credentials'>
                                                        <p> ID: {detail.id} </p>
                                                        <p> رقم الهاتف: {detail.num} </p>
                                                        <p> الجواب: {detail.status} </p>
                                                        <p> سحب / إيداع: {detail.method} </p>
                                                    </div>
                                                    <div className='credentials'>
                                                        <p> إسم المستخدم: {detail.nom} </p>
                                                        <p> المبلغ: {detail.montant} £ </p>
                                                        <p> وسيلة الدفع: {detail.mode_paiement} </p>
                                                        <div style={{display:'flex'}}>  
                                                            <p style={edit === false ? {display:'flex'} : {display:'none'}}> المحفظة: {detail.wallet} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p> الوكيل : {detail.agent}</p>
                                                <button onClick={() => handleClick(detail.id)}> تم التعامل </button>
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                        <div className="pagination">
                                            <button onClick={handleHistoryPrevPage} disabled={currentPage === 1}>
                                                &#8594; السابق
                                            </button>
                                            <span>{`الصفحة ${currentPage} من ${totalHistoryPages}`}</span>
                                            <button onClick={handleHistoryNextPage} disabled={currentPage === totalHistoryPages}>
                                                التالي &#8592;
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h1>لا توجد بيانات لعرضها</h1>
                                    </>
                            )}
                        </div>
                        <div style={{display:history}} className='history'>
                            {managerData && managerData.length !== 0 ? (
                                    <>
                                        <input type='text' onClick={(e) => searchHistory(e.target.value)} />
                                        {managerItemsToShow.map((detail, index) => (
                                        <div className="details-toggle" key={'history' + index}>
                                            <div className='details-header' onClick={() => toggleManagerDetails(startIndex + index)}>
                                            <span className="toggle-text">
                                                {managerDetailsVisibility[startIndex + index] ? '▲' : '▼'} تفاصيل
                                            </span>
                                            <span className="id-value">{detail.id}</span>
                                            </div>
                                            {managerDetailsVisibility[startIndex + index] && (
                                            <div className="details">
                                                <div className='data-row' key={'detail' + index}>
                                                    <div className='credentials'>
                                                        <p> ID: {detail.id} </p>
                                                        <p> رقم الهاتف: {detail.num} </p>
                                                        <p> الجواب: {detail.status} </p>
                                                        <p> سحب / إيداع: {detail.method} </p>
                                                    </div>
                                                    <div className='credentials'>
                                                        <p> إسم المستخدم: {detail.nom} </p>
                                                        <p> المبلغ: {detail.montant} £ </p>
                                                        <p> وسيلة الدفع: {detail.mode_paiement} </p>
                                                        <div style={{display:'flex'}}>  
                                                            <p style={edit === false ? {display:'flex'} : {display:'none'}}> المحفظة: {detail.wallet} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p> الوكيل : {detail.agent}</p>
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                        <div className="pagination">
                                            <button onClick={handleManagerPrevPage} disabled={currentPage === 1}>
                                                &#8594; السابق
                                            </button>
                                            <span>{`الصفحة ${currentPage} من ${totalManagerPages}`}</span>
                                            <button onClick={handleManagerNextPage} disabled={currentPage === totalManagerPages}>
                                                التالي &#8592;
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h1>لا توجد بيانات لعرضها</h1>
                                    </>
                            )}
                        </div>
                        <div style={{display:agentsStyle}} className='agents'>
                            <button onClick={addAgent}>إضافة وكيل +</button>
                            <br></br>
                            {agents && agents.length !== 0 ? (
                                    <>
                                        <input type='text' onChange={(e) => searchAgents(e.target.value)} />
                                        {agentsItemsToShow && agentsItemsToShow.map((detail, index) => (
                                        <div className="details-toggle" key={'history' + index}>
                                            <div className='details-header' onClick={() => toggleAgentsDetails(startIndex + index)}>
                                            <span className="toggle-text">
                                                {agentsDetailsVisibility[startIndex + index] ? '▲' : '▼'} تفاصيل {detail.username}
                                            </span>
                                            <span className="id-value">{detail.id}</span>
                                            </div>
                                            {agentsDetailsVisibility[startIndex + index] && (
                                            <div className="details">
                                                <div className='data-row' key={'detail' + index}>
                                                    <div className='credentials'>
                                                        <p>اسم المستخدم: {detail.username} </p>
                                                        <p>الرصيد: {detail.solde} £ </p>
                                                        <div className="wallets-container">
                                                            <div className="wallets-column-right">
                                                                {detail.wallets.slice(0, 4).map((w) => (
                                                                <p key={w.number}>{w.name} : {w.number}</p>
                                                                ))}
                                                            </div>
                                                            <div className="wallets-column-left">
                                                                {detail.wallets.slice(4, 8).map((w) => (
                                                                <p key={w.number}>{w.name} : {w.number}</p>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button id='editAgent' style={{backgroundColor:'black'}} onClick={() => addAgent(detail.username, detail.password, detail.solde, detail.wallets)}>تعديل</button>
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                        <div className="pagination">
                                            <button onClick={handleAgentsPrevPage} disabled={currentPage === 1}>
                                                &#8594; السابق
                                            </button>
                                            <span>{`الصفحة ${currentPage} من ${totalAgentsPages}`}</span>
                                            <button onClick={handleAgentsNextPage} disabled={currentPage === totalAgentsPages}>
                                                التالي &#8592;
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h1>لا توجد بيانات لعرضها</h1>
                                    </>
                            )}
                        </div>
                        <div style={{display: addAgentStyle}} className='add-agent'>
                                <label>اسم المستخدم</label>
                                <input defaultValue={agentUsername} type='text' onChange={(e) => setAgentUsername(e.target.value)} />
                                <div className="password-container">
                                    <label> كلمة المرور </label>
                                    <div className="password-input-container">
                                        <input
                                            defaultValue={agentPassword}
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => setAgentPassword(e.target.value)}
                                        />
                                        <span className="eye-icon" onClick={togglePasswordVisibility}>
                                            {showPassword ? '👀' : '👁️'}
                                        </span>
                                    </div>
                                </div>
                                <label>الرصيد</label>
                                <input defaultValue={agentSolde} type='text' onChange={(e) => setAgentSolde(e.target.value)} />
                                <div className='walletInputs'>
                                    <div className='right-wallets'>
                                        <label> SmartWalletEGP المحفظة {agentWallets && agentWallets[0].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[0].number} type='text' onChange={(e) => agentWallets[0] = {"name":'SmartWalletEGP', "number":e.target.value}} />
                                        <label> We Pay المحفظة {agentWallets && agentWallets[1].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[1].number} type='text' onChange={(e) => agentWallets[1] = {"name":'We Pay', "number":e.target.value}} />
                                        <label> Fawry المحفظة {agentWallets && agentWallets[2].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[2].number} type='text' onChange={(e) => agentWallets[2] = {"name":'Fawry', "number":e.target.value}} />
                                        <label> Orange Payment المحفظة {agentWallets && agentWallets[3].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[3].number} type='text' onChange={(e) => agentWallets[3] = {"name":'Orange Payment', "number":e.target.value}} />
                                    </div>
                                    <div className='left-wallets'>
                                        <label> InstaPay EGP المحفظة {agentWallets && agentWallets[4].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[4].number} type='text' onChange={(e) => agentWallets[4] = {"name":'InstaPay EGP', "number":e.target.value}} />
                                        <label> BM Wallet EGP المحفظة {agentWallets && agentWallets[5].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[5].number} type='text' onChange={(e) => agentWallets[5] = {"name":'BM Wallet EGP', "number":e.target.value}} />
                                        <label> Vodafone المحفظة {agentWallets && agentWallets[6].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[6].number} type='text' onChange={(e) => agentWallets[6] = {"name":'Vodafone', "number":e.target.value}} />
                                        <label> Etisalat المحفظة {agentWallets && agentWallets[7].name} </label>
                                        <input defaultValue={agentWallets && agentWallets[7].number} type='text' onChange={(e) => agentWallets[7] = {"name":'Etisalat', "number":e.target.value}} />
                                    </div>
                                </div>
                                <button onClick={buttonName === 'إضافة وكيل' ? () => addAgentSubmit('add') : () => addAgentSubmit('edit')}> {buttonName}</button>
                        </div>
                    </div> 
                </>
            )}
            
        </div>
      );
    };

export default DashboardAgent;