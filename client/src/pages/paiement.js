import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/Paiement.css'

const Paiement = () => {
    const location = useLocation();

    const {paiement_mode, paiement_img } = location.state;
    const [wallet, setWallet] = useState()
  
    useEffect(() => {
        const fetchData = async () =>{
            try{
                const response = await fetch(`${process.env.REACT_APP_API_URL}/getCurrentWallet?paiement_mode=${paiement_mode}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
            setWallet(result.currentWallet);
            }catch(error){
                console.log(error)
            }
        } 
        
        fetchData()
    }, []); 
    
    const [id, setID] = useState('');
    const [idError, setIDError] = useState('')

    const [nom, setNom] = useState('');
    const [nomError, setNomError] = useState('')

    const [num, setNum] = useState('');
    const [numError, setNumError] = useState('')

    const [montant, setMontant] = useState('');
    const [montantError, setMontantError] = useState('')

    const today = new Date().toISOString().slice(0, 19).replace('T', ' ');;

    const verifyID = (thisID)=>{
        const idNumber = parseInt(thisID)
        if(!isNaN(idNumber)){
            if(idNumber > 0){
                setIDError(undefined)
                setID(thisID)
            }else{
                setIDError('الرجاء التحقق من معرف')
            }
        }else{
            setIDError('الرجاء التحقق من معرف')
        }
    }

    const verifyNom = (thisNom)=> {
        if(thisNom.length <= 3){
            setNomError('الرجاء التحقق من اسم')
        }else{
            setNomError(undefined)
            setNom(thisNom)
        }
    }

    const verifyNum = (thisNum) =>{
        const numNumber = parseInt(thisNum)
        if(!isNaN(numNumber)){
            if(numNumber >= 10000000 && numNumber <= 99999999){
                setNumError(undefined)
                setNum(thisNum)
            }else{
                setNumError('الرجاء التحقق من رقم هاتف')
            }
        }else{
            setNumError('الرجاء التحقق من رقم الهاتف')
        }
    }

    const verifyMontant = (thisMontant) => {
        const montantNumber = parseFloat(thisMontant);

        if (!isNaN(montantNumber) && montantNumber >= 15 && montantNumber <= 20000) {
            setMontantError(undefined)
            setMontant(thisMontant)
        } else {
            setMontantError('الرجاء التحقق من المبلغ')
        }
    }

    const sendData = async () => {
        verifyID(id)
        verifyNom(nom)
        verifyNum(num)
        verifyMontant(montant)

        if(idError === undefined && nomError === undefined && numError === undefined && montantError === undefined){
            const data = {
                'id': id,
                'nom': nom,
                'num': num,
                'montant': montant,
                'wallet' : wallet,
                'date': today,
                'mode_paiement' : paiement_mode,
                'status': false,
                'increment': 0
              };
            
              try {
                const response = await fetch(process.env.REACT_APP_API_URL+'/saveData', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });
          
                const result = await response.text();
                toast.success(result, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
                  
              window.location.href = 'https://m.carthagebet.net/fr'
              } catch (error) {
                console.error('Error saving data:', error);
              }      
        }else{
            toast.error('Something went wrong, please verify!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
      };
  
    return(
        <div className="Paiement">
            <ToastContainer />
            <img id='logo' src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' />
            <div className='content'>
                <h2> {paiement_mode} </h2>
                <div className='paiement-header'>
                    <div className='paiement-method'>
                        <img src={paiement_img} alt='' />
                        <div className="vertical-line"></div>
                        <div className='paiment-info'>
                            <div className='top-side'>
                                <span>الرسم: مجاني</span>
                                <span>فوري</span>
                            </div>
                            <hr className="horizontal-line"></hr>
                            <div className='bottom-side'>
                                <div className='prices-tags'>
                                    <span>الحد الأدنى</span>
                                    <span>الحد الأقصى</span>
                                </div>
                                <div className='prices'>
                                    <span>EGP 15</span>
                                    <span>EGP 20000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    قبل تقديم الطلب يرجى تحميل الأموال في غضون 10 دقائق بإستخدام معلومات الدفع المحددة أدناه
                </p>
                <p>
                    رقم المحفظة: <span style={{color:'green'}}>{wallet}</span>
                </p>
                <div className='formulaire'>
                    <input type='text' placeholder='ID' onChange={(e) => verifyID(e.target.value)} />
                    <span className='error' style={ idError !== undefined ? {display : 'flex', color:'red', fontSize:'14px'} : {display: 'none'}} > {idError} </span>

                    <input type='text' placeholder='إسم المستخدم' onChange={(e) => verifyNom(e.target.value)} />
                    <span className='error' style={ nomError !== undefined ? {display : 'flex', color:'red', fontSize:'14px'} : {display: 'none'}} > {nomError} </span>

                    <input type='text' placeholder='رقم الهاتف الذي تم التحويل منه' onChange={(e) => verifyNum(e.target.value)} />
                    <span className='error' style={ numError !== undefined ? {display : 'flex', color:'red', fontSize:'14px'} : {display: 'none'}} > {numError} </span>

                    <input type='text' placeholder='المبلغ' onChange={(e) => verifyMontant(e.target.value)} />
                    <span className='error' style={ montantError !== undefined ? {display : 'flex', color:'red', fontSize:'14px'} : {display: 'none'}} > {montantError} </span>

                    <button onClick={ sendData }> القيام بالإيداع </button>
                </div>
            </div>
        </div>
    )
}

export default Paiement;