import { useState } from 'react'
import '../css/Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () =>{
    const [username, setUsername] = useState()
    const [password, setPassword] = useState();
    
    const navigate = useNavigate();

    const handleLogin = async() =>{
        try {
            const response = await fetch(process.env.REACT_APP_API_URL+'/getUsers');
            const jsonData = await response.json();

            const exist = jsonData.reduce((accumulator, user) => {
                if (user.username === username && user.password === password) {
                    return user; 
                }
                return accumulator;
            }, null);

            if(exist === null){
                toast.error( "تحقق من بيانات الاعتماد الخاصة بك", {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
            }else{
                toast.success('Welcome', {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                });
                navigate('/Dashboard', { state: { username: username, role : exist.role } });
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }
    
    return (
        <div className="Login">
            <ToastContainer />
            <img src={process.env.PUBLIC_URL + '/logo.png'} alt='logo' />
            <h1>تسجيل الدخول</h1>
            <div className='login-form'>
                <div>
                    <label>اسم المستخدم</label>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label> كلمة المرور </label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleLogin}> تسجيل الدخول </button>
            </div>
        </div>
    )
}

export default Login;