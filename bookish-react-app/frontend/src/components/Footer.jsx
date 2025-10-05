import React from 'react';
import '../styles/global.css';
const footer = () => {
    return (

        <div className='footer'>
            <div className="sb__footer section__padding">
                <div className='sb__footer-links'>
                    <div className='sb__footer-links_div'>

                        <h4>Contact the makers</h4>
                        <p>ode@metropolia.fi</p>
                        <p>donya@metropolia.fi</p>
                        <p>tanvir@metropolia.fi</p>
                        <p>mustafa@metropolia.fi</p>

                    </div>

                    <div className='sb__footer-links_div'>
                        <h4>Partners</h4>
                            <p>Libaries</p>
                            <p>Authors</p>
                            <p>Publishers</p>
                    </div>

                    <div className='sb__footer-links_div'>
                        <h4>Bookish</h4>
                        <a href='/about-us'>
                            <p>About us</p>
                        </a>
                        <a href='/contact-us'>
                            <p>Contact us</p>
                        </a>
                        <a href='/'>
                            <p>Home</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Join us</h4>
                        <a href='/sign-up'>
                            <p>Get started</p>
                        </a>
                        <a href='/sign-in'>
                            <p>Login</p>
                        </a>
                        <a href='/contact-us'>
                            <p>Contact us</p>
                        </a>
                    </div>
                    {/* <div className='sb__footer-links_div'>
                        <div className='socialmedia'>
                            <p><img src={lo} alt="" /></p>
                        <p><img src={lo} alt="" /></p>
                        <p><img src={lo} alt="" /></p>
                        <p><img src={lo} alt="" /></p>
                        </div>
                    </div> */}
                </div>

                <hr></hr>
                <div className='sb__footer-below'>
                    <div className='sb__footer-copyright'>
                        <p>
                            {new Date().getFullYear()} Bookish ©  &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;   All rights reserved by students of Metropolia UAS
                        </p>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default footer;