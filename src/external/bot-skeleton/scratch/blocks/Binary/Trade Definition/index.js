import { isClientFromIndia } from '../../../utils';
import './trade_definition';
import './trade_definition_market';
import './trade_definition_tradetype';
import './trade_definition_contracttype';
import './trade_definition_candleinterval';
import './trade_definition_restartbuysell';
import './trade_definition_restartonerror';
import './trade_definition_tradeoptions';
import './accumulator_take_profit';
import './trade_definition_accumulator';
// Only import multiplier blocks if client is not from India
if (!isClientFromIndia()) {
    import('./trade_definition_multiplier');
    import('./multiplier_stop_loss');
    import('./multiplier_take_profit');
}
