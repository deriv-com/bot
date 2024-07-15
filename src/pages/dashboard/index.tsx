import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';

const Dashboard = observer(() => {
    const { ui } = useStore();
    const { isAuthorized } = ui;
    return (
        <div style={{ paddingTop: '12px' }}>
            <div>Dashboard observing from mobx store.</div>
            <div>isAuthorized: {isAuthorized.toString()}</div>
        </div>
    );
});

export default Dashboard;
