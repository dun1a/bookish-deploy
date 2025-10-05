import React from 'react';
import '../styles/global.css';

const TestimonialCard = ({ quote, author }) => {
  return (
    <div className="testimonials-card">
      <p className="testimonials-quote">“{quote}”</p>
      <span className="testimonials-author">{author}</span>
    </div>
  );
};

export default TestimonialCard;
