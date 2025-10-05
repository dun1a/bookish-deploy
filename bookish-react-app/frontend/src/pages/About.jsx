import React from 'react';
import '../styles/global.css';
import about from '../assets/img/about.png';
import Testi from '../components/Testimonials';

const OriginContainer = () => (
  <div className="about_box_container">
    <h3 className="about_question">How did we originate?</h3>
    <p className="about_question_text">We started with a simple idea:
      Reading should be affordable and accessible to everyone.
      Many book lovers struggle to buy new books regularly,
      so we built a platform that allows readers to loan instead of own,
      making stories and knowledge easier to reach.</p>
  </div>
);

const WhyServeContainer = () => (
  <div className="about_box_container">
    <h3 className="about_question">Why do we serve?</h3>
    <p className="about_question_text">We believe stories and knowledge are meant to be shared.
      By offering an affordable digital library where readers
      can also keep personal notes. We aim to make reading
      more sustainable, inclusive, and rewarding.</p>
  </div>
);

const WhoServeContainer = () => (
  <div className="about_box_container">
    <h3 className="about_question">Who do we serve?</h3>
    <p className="about_question_text">We serve passionate readers who want access to a wide
      variety of books without the burden of constant purchases.
      Whether you’re a student, a casual reader, or someone who
      simply loves learning, our library is designed for you.</p>
  </div>
);

const About = () => {
  return (
    <main className="about">
      <article>
        <div className="about_page">
          <div className="about_main_container">
            <div className="about_main_text_content">
              <h1 className="about_header">About Bookish</h1>
              <h3 className="about_header_text">Bookish is a project by Metropolia UAS <br></br>
                students inspired by the hindrance faced  <br></br> by readers.
                We set out to solve the problems<br></br> faced
                by many readers around the globe.</h3>
            </div>
            <div className="about_logo_div">
              <img src={about} alt="BookIcon" className="about_logo" />
            </div>
          </div>
          <div className="about_container_wrapper">
            <OriginContainer />
            <WhyServeContainer />
            <WhoServeContainer />
          </div>
          <Testi />
        </div>
      </article>

    </main>
  );
};

export default About;