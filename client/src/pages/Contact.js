
import '../css/Contact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Contact = () =>{

    return(
        <div className="contact">
            <div className='goto'>
                <a href='/modePaiement'>
                    <FontAwesomeIcon icon={faArrowLeft} color='#FFBD59' size='2x' />
                    <span> العودة إلى الصفحة الرئيسية </span>
                </a>
            </div>
            <div className='contact-style'>
                <div className='contact-content'>
                    <div className='contact-header-content'>
                        <img id='logo' src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' />
                        <img src={process.env.PUBLIC_URL + '/contact/Group.png'} />
                        <div className='social-media'>
                            <a href='https://t.me/carthage0Bet' target='_blank'><img src={process.env.PUBLIC_URL + '/contact/socials/telegramme.png'} /></a>
                            <a href='https://www.facebook.com/profile.php?id=100088171102804&mibextid=LQQJ4d' target='_blank'><img src={process.env.PUBLIC_URL + '/contact/socials/facebook.png'} /></a>
                            <a href='https://www.instagram.com/carthage_bet' target='_blank'><img src={process.env.PUBLIC_URL + '/contact/socials/instagram.png'} /></a>
                        </div>
                    </div>
                    <div className='separator'>
                        <img src={process.env.PUBLIC_URL + '/contact/Rectangle3.png'} />
                    </div>
                    <div className='contact-ending-section'>
                        <div className='content'>
                            <h1>Carthage Bet</h1>
                            <img src={process.env.PUBLIC_URL + '/contact/Rectangle1.png'} />
                            <div className='style'>
                                <a href='https://wa.me/+447453382912' target='_blank'>
                                    <FontAwesomeIcon icon={faWhatsapp} size="3x" />
                                    <span>+447453382912</span>
                                </a>
                            </div>
                            <div className='style'>
                                <a href='https://www.carthagebet.net/fr/' target='_blank'>
                                    <FontAwesomeIcon icon={faGlobe} size="3x" />
                                    <span>www.carthagebet.net</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;