import '../styles/global.css';
import useSignup from '../hooks/useSignup';

const Signup = ({setIsAuthenticated}) => {
  const {
    form,
    setForm,
    submitted,
    message,
    generatePassword,
    handleSubmit,
  } = useSignup({setIsAuthenticated});

  return (
    <div className="signup_home-bg">
      <div className="signup_main-box">
        <h2 className="signup_heading">Create an Account!</h2>

        {!submitted ? (
          <form className="signup_form" onSubmit={handleSubmit}>

            <div className="signup_input-field">
              <input
                type="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="signup_input-field">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="signup_input-field">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="signup_input-field signup_password-container">
              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <div>
                <button
                  type="button"
                  className="signup_suggest-btn"
                  onClick={generatePassword}
                >
                  Suggest
                </button>
              </div>
            </div>

            <div className="signup_input-field">
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>

            <button className="signup_create-button" type="submit">
              Create Account
            </button>
          </form>
        ) : (
          <p className={`signup_message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );

}

export default Signup;


