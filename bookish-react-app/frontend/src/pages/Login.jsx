import '../styles/global.css';
import useLogin from '../hooks/useLogin';


const Login = ({ setIsAuthenticated }) => {
    const { form,
            showPassword,
            setShowPassword,
            loading,
            error, 
            handleChange,
            handleSubmit,
    } = useLogin({ setIsAuthenticated });


  return (
    <div className="login_bg">

      <div className="login_sign-box">
        <h3 className="login_heading"> Welcome back!   </h3>

        <form onSubmit={handleSubmit} className="login_form-main">
          <div className="login_input-field">
            <label htmlFor="username"></label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required />

            <label htmlFor="password"></label>
            <div className="login_password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required /> 

              <button
                type="button"
                className="login_toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <label className="login_remember">
            <input type="checkbox" /> Remember me
          </label>

          {error && <p className="login_error">{error}</p>}

          <button
            className="login_btn"
            type="submit"
            disabled={!form.username || !form.password || loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <a href="#" className="login_forgot">
          Forgot password?
        </a>

        <div className="login_signup-link">
          Don't have an account? <a href="/signup">Create one</a>
        </div>
      </div>
    </div>
  );
}


export default Login;