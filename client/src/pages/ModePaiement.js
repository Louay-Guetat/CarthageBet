import React from 'react';
import '../css/modePaiement.css';
import { useNavigate } from 'react-router-dom';

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

const ModePaiement = () => {
  const modesPerRow = 2;
  const navigate = useNavigate();

  const navigateToPaiement = (modeName, image) => {
    navigate('/paiement', { state: { paiement_mode: modeName , paiement_img: image } });
  };

  return (
    <div className="Mode-Paiement">
      <img id='logo' src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' />
      <div className='content'>
        {[...Array(Math.ceil(modes.length / modesPerRow))].map((_, rowIndex) => (
          <div className="modes-row" key={rowIndex}>
            {modes.slice(rowIndex * modesPerRow, (rowIndex + 1) * modesPerRow).map((mode, index) => (
              <div className='modes-card' key={index} onClick={(e) => navigateToPaiement(mode.name, process.env.PUBLIC_URL + '/modes/' + mode.image)}>
                  <div className='mode-img'>
                    <img src={process.env.PUBLIC_URL + '/modes/' + mode.image} alt={mode.name} />
                  </div>
                  <hr className="horizontal-line" />
                  <div>
                    <span>{mode.name}</span>
                  </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModePaiement;
