import { Route, Routes, useLocation, matchPath } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import { BookProvider } from "./components/BookContext";
import Notes from "./pages/Notes";
import MainPage from "./pages/mainPage";
import Error from './pages/Error';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from "./components/ProtectedRoute";
import Recommendations from "./components/Recommendations";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && user.token ? true : false;
    });

    const location = useLocation();
    const hideFooter = ['/login', '/signup', '/mainPage', '/recommendations', '/notes/:id'].includes(location.pathname) ||
        matchPath("/notes/:id", location.pathname);

    return (
        <div className='app'>
            <NavBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
                <Route
                    path="/mainPage"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <BookProvider>
                                <MainPage />
                            </BookProvider>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path="/recommendations"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <BookProvider>
                                <Recommendations />
                            </BookProvider>
                        </ProtectedRoute>

                    }
                />
                <Route
                    path="/notes/:bookId" // this needs to be exactly bookId
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <BookProvider>
                                <Notes />
                            </BookProvider>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Error />} /> // THIS AFTER EVERYTHING!
            </Routes>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default App;
