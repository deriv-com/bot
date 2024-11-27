import AppStore from './app-store';
import BlocklyStore from './blockly-store';
import ChartStore from './chart-store';
import ClientStore from './client-store';
import CommonStore from './common-store';
import DashboardStore from './dashboard-store';
import DataCollectionStore from './data-collection-store';
import FlyoutHelpStore from './flyout-help-store';
import FlyoutStore from './flyout-store';
import GoogleDriveStore from './google-drive-store';
import JournalStore from './journal-store';
import LoadModalStore from './load-modal-store';
import QuickStrategyStore from './quick-strategy-store';
import RunPanelStore from './run-panel-store';
import SaveModalStore from './save-modal-store';
import SelfExclusionStore from './self-exclusion-store';
import SummaryCardStore from './summary-card-store';
import ToolbarStore from './toolbar-store';
import ToolboxStore from './toolbox-store';
import TransactionsStore from './transactions-store';
import UiStore from './ui-store';

// TODO: need to write types for the individual classes and convert them to ts
export default class RootStore {
    public dbot;
    public app: AppStore;
    public summary_card: SummaryCardStore;
    public flyout: FlyoutStore;
    public flyout_help: FlyoutHelpStore;
    public google_drive: GoogleDriveStore;
    public journal: JournalStore;
    public load_modal: LoadModalStore;
    public run_panel: RunPanelStore;
    public save_modal: SaveModalStore;
    public transactions: TransactionsStore;
    public toolbar: ToolbarStore;
    public toolbox: ToolboxStore;
    public quick_strategy: QuickStrategyStore;
    public self_exclusion: SelfExclusionStore;
    public dashboard: DashboardStore;

    public chart_store: ChartStore;
    public blockly_store: BlocklyStore;
    public data_collection_store: DataCollectionStore;

    public ui: UiStore;
    public client: ClientStore;
    public common: CommonStore;

    core = {
        ui: {},
        client: {},
        common: {},
    };

    constructor(dbot: unknown) {
        this.dbot = dbot;

        // Need to fix later without using this.core
        this.ui = new UiStore();
        this.client = new ClientStore();
        this.common = new CommonStore();
        this.core.ui = this.ui;
        this.core.client = this.client;
        this.core.common = this.common;

        this.app = new AppStore(this, this.core);
        this.summary_card = new SummaryCardStore(this, this.core);
        this.flyout = new FlyoutStore(this);
        this.flyout_help = new FlyoutHelpStore(this);
        this.google_drive = new GoogleDriveStore(this);
        this.journal = new JournalStore(this, this.core);
        this.load_modal = new LoadModalStore(this, this.core);
        this.run_panel = new RunPanelStore(this, this.core);
        this.save_modal = new SaveModalStore(this);
        this.transactions = new TransactionsStore(this, this.core);
        this.toolbar = new ToolbarStore(this);
        this.toolbox = new ToolboxStore(this, this.core);
        this.quick_strategy = new QuickStrategyStore(this);
        this.self_exclusion = new SelfExclusionStore(this, this.core);
        this.dashboard = new DashboardStore(this, this.core);

        // need to be at last for dependency
        this.chart_store = new ChartStore(this);
        this.blockly_store = new BlocklyStore(this);
        this.data_collection_store = new DataCollectionStore(this, this.core);
    }
}
