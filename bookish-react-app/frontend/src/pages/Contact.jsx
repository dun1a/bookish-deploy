import React , { useState } from 'react';
import '../styles/global.css';

const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    const contactUsInformation = {
      name,
      email,
      message
    }
    console.log(contactUsInformation);

    setName('');
    setEmail('');
    setMessage('');
  }



  return (
    <main>
      <section className='contact_section'>
        <form onSubmit={onSubmit} className='contact_form'>
        <h2 className='contact_chat'>Let's chat!</h2>

          <div className="contact_input-box">
            <label htmlFor="name">Full Name</label>
            <input type="text"
              className="contact_field"
              placeholder=" Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required />
          </div>

          <div className="contact_input-box">
            <label htmlFor="email">Email</label>
            <input type="text"
              className="contact_field"
              placeholder=" Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required />
          </div>

          <div className="contact_input-box">
            <label htmlFor="message">Message</label><br/>

            <textarea
              className="contact_field"
              placeholder=" Enter your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required />

          </div>

          <button type="submit" className='contact_button'>Send Message</button>
        </form>
      </section>
    </main>
  )
}

export default Contact;