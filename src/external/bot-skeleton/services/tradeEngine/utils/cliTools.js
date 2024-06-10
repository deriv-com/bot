import Observer from '../../../utils/observer';
import TicksService from '../../api/ticks_service';

export const createScope = () => {
    const observer = new Observer();
    const ticksService = new TicksService();
    const stopped = false;
    return { observer, ticksService, stopped };
};
