import { useEffect } from 'react';
import './main-body.scss';

type TMainBodyProps = {
    children: React.ReactNode;
};

const MainBody: React.FC<TMainBodyProps> = ({ children }) => {
    const current_theme = localStorage.getItem('theme') ?? 'light';

    useEffect(() => {
        const body = document.querySelector('body');
        if (!body) return;
        if (current_theme === 'light') {
            body.classList.remove('theme--dark');
            body.classList.add('theme--light');
        } else {
            body.classList.remove('theme--light');
            body.classList.add('theme--dark');
        }
    }, [current_theme]);

    return <div className='main-body'>{children}</div>;
};

export default MainBody;
