import './main-body.scss';

type TMainBodyProps = {
    children: React.ReactNode;
};

const MainBody: React.FC<TMainBodyProps> = ({ children }) => {
    return <div className='main-body'>{children}</div>;
};

export default MainBody;
