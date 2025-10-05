import '../styles/global.css';

const Hero = () => {
  return (
    <section className="hero_section">
      <div className="hero_main-content">
        <h1 className="hero_library">📚 My Digital Library</h1>
        <p>Stop losing track of your thoughts.
           Build your personal knowledge library 
           and make every book you read more impactful.</p>
        <a href="/signup" className="hero_cta-btn">Get Started</a>
      </div>
    </section>
  );
};

export default Hero;
