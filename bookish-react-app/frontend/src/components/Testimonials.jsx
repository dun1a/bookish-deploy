import TestimonialCard from './TestimonialsCard';
import '../styles/global.css';

const testimonialsData = [
  {
    quote: "This app changed the way I read. I never lose track of my thoughts anymore!",
    author: "Alex, Student"
  },
  {
    quote: "The note system is so clean and simple. Perfect for research.",
    author: "Priya, Researcher"
  },
  {
    quote: "I love being able to search through all my book notes instantly!",
    author: "Mark, Book Enthusiast"
  },
  {
    quote: "Progress tracking motivates me to read more every day.",
    author: "Sara, Lifelong Learner"
  },
  {
    quote: "I love reading books, finding nemo is my favourite book!",
    author: "Tanvir, Book Enthusiast"
  },
  {
    quote: "Bookish motivated me to start reading more and on a daily basis.",
    author: "Katy Perry, Lifelong Learner"
  }

];

const Testimonials = () => {
  return (
    <section>
      <div className="testimonials-page">
        <div className="testimonials-header">
          <h1>What Our Users Say</h1>
        </div>

        <div className="testimonials-flex">
          {testimonialsData.map((item, index) => (
            <TestimonialCard key={index} quote={item.quote} author={item.author} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
