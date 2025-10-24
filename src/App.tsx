import {Navigate, Route, Routes} from 'react-router-dom';
import {useAuth} from './Auth/AuthContext';
import FullPageSpinner from './components/FullPageSpinner';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import './App.css';

const AppRoutes = () => {
    const {isAuthenticated, loading} = useAuth();

    if (loading) {
        return <FullPageSpinner/>;
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'}/>}/>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard"/> : <Login/>}
            />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Landing/> : <Navigate to="/login"/>}
            />
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
};

const App = () => <AppRoutes/>;

export default App;
