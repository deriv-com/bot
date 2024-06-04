import './main-body.scss';

type TMainBodyProps = {
    children: React.ReactNode;
};

const MainBody: React.FC<TMainBodyProps> = ({ children }) => {
    return <div className='main-body theme theme--light'>{children}</div>;
};

export default MainBody;
