
import LoginLinks from './LoginLinks'
import Logo from '../components/Logo'
import '../styles/background.css'
export const metadata = {
    title: 'Laravel',
}

const Home = () => {
    return (
        <>
            <div className="background relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="overlay"></div>
                <LoginLinks />
                <Logo />

            </div>
        </>
    )
}

export default Home
