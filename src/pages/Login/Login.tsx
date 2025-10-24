import {FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../Auth/AuthContext';
import './Login.css';

type LoginError = {
    message: string;
};

type LoginResponse = {
    token: string;
};

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<LoginError | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const baseUrl = import.meta.env.VITE_API_BASE ?? '';
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                throw new Error('Ongeldige inloggegevens');
            }

            const data: LoginResponse = await response.json();
            login(data.token);
            navigate('/dashboard', {replace: true});
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Inloggen is niet gelukt';
            setError({message});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <section className="login-card">
                <header className="login-card__header">
                    <h1>Wasserij Boumans</h1>
                    <p>Meld je aan om door te gaan</p>
                </header>
                <form className="login-form" onSubmit={handleSubmit} aria-label="Login formulier">
                    <label className="login-form__field">
                        <span>Gebruikersnaam</span>
                        <input
                            autoComplete="username"
                            name="username"
                            onChange={event => setUsername(event.target.value)}
                            required
                            value={username}
                        />
                    </label>
                    <label className="login-form__field">
                        <span>Wachtwoord</span>
                        <input
                            autoComplete="current-password"
                            name="password"
                            onChange={event => setPassword(event.target.value)}
                            type="password"
                            required
                            value={password}
                        />
                    </label>
                    {error && (
                        <p className="login-form__error" role="alert">
                            {error.message}
                        </p>
                    )}
                    <button
                        className="login-form__submit"
                        disabled={isSubmitting || !username.trim() || !password.trim()}
                        type="submit"
                    >
                        {isSubmitting ? 'Bezig…' : 'Inloggen'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Login;
