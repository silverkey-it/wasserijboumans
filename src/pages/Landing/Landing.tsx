import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../Auth/AuthContext';
import './Landing.css';

const Landing = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', {replace: true});
    };

    return (
        <div className="landing-page">
            <header className="landing-page__header">
                <div className="landing-page__brand">
                    <span className="landing-page__logo" aria-hidden="true">
                        WB
                    </span>
                    <h1>Wasserij Boumans</h1>
                </div>
                <button className="landing-page__logout" type="button" onClick={handleLogout}>
                    Uitloggen
                </button>
            </header>

            <main className="landing-page__content">
                <section className="landing-page__welcome">
                    <h2>Welkom terug!</h2>
                    <p>
                        Dit is het startpunt voor de digitale omgeving van Wasserij Boumans. Vanuit hier bouwen we verder
                        aan planningen, dashboards en workflows die passen bij jullie dagelijkse processen.
                    </p>
                    <p>
                        Totdat de functionaliteit gereed is, kun je deze omgeving gebruiken om de login te testen en met
                        het team de vervolgstappen te plannen.
                    </p>
                </section>

                <section className="landing-page__next">
                    <h3>Volgende stappen</h3>
                    <ul>
                        <li>Specificaties ophalen voor de kernfunctionaliteiten</li>
                        <li>Backend endpoints voor planning & productie uitwerken</li>
                        <li>UI ontwerpen voor order- en routebeheer</li>
                        <li>Koppeling voorbereiden met bestaande systemen</li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Landing;
