import logo from '../assets/img/logoOne.png';
import Hero from './Hero';
import '../styles/global.css';

const Home = () => {
  return (

    <main>
                <Hero />

      <article className='main_page'>
          <div className="home_content-container">
            <div className="home_text-content">
              <h2 className="home_main-text">
                Looking for a digital <br />
                note taking library for<br />
                your favourite books?</h2>

              <h3 className="home_below-text">
                We have you covered sign up <br />
                with us to start your journey!</h3><br />

              <button className='home_button'><a href="/signup" className='home_btn-text'>
                Get Started
              </a></button>

            </div>

            <div className="home_logo-div">
              <img src={logo} alt="Book Icon" className="home_logo" />
            </div>
          </div>
      </article>
    </main>


  );
}

export default Home;
