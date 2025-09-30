import foglieImage from '../assets/foglie.jpg';

export default function Footer() {
    return (
        <footer
            className="w-full h-20 md:h-24 bg-cover bg-center bg-no-repeat mt-8"
            style={{ backgroundImage: `url(${foglieImage})` }}
        >
            <div className="w-full h-full bg-black/20"></div>
        </footer>
    );
}
