import {
    AccountLimitsRequest,
    AccountLimitsResponse,
    AccountStatusRequest,
    AccountStatusResponse,
    ActiveSymbolsRequest,
    ActiveSymbolsResponse,
    APITokenRequest,
    APITokenResponse,
    ApplicationDeleteRequest,
    ApplicationDeleteResponse,
    ApplicationGetDetailsRequest,
    ApplicationGetDetailsResponse,
    ApplicationListRequest,
    ApplicationListResponse,
    ApplicationMarkupDetailsRequest,
    ApplicationMarkupDetailsResponse,
    ApplicationMarkupStatisticsRequest,
    ApplicationMarkupStatisticsResponse,
    ApplicationRegisterRequest,
    ApplicationRegisterResponse,
    ApplicationUpdateRequest,
    ApplicationUpdateResponse,
    AssetIndexRequest,
    AssetIndexResponse,
    AuthorizeRequest,
    AuthorizeResponse,
    BalanceRequest,
    BalanceResponse,
    BuyContractForMultipleAccountsRequest,
    BuyContractForMultipleAccountsResponse,
    BuyContractRequest,
    BuyContractResponse,
    CancelAContractRequest,
    CancelAContractResponse,
    CashierInformationRequest,
    CashierInformationResponse,
    ContractsForSymbolRequest,
    ContractsForSymbolResponse,
    CopyTradingListRequest,
    CopyTradingListResponse,
    CopyTradingStartRequest,
    CopyTradingStartResponse,
    CopyTradingStatisticsRequest,
    CopyTradingStatisticsResponse,
    CopyTradingStopRequest,
    CopyTradingStopResponse,
    CountriesListRequest,
    CountriesListResponse,
    CryptocurrencyConfigurationsRequest,
    CryptocurrencyConfigurationsResponse,
    DocumentUploadRequest,
    DocumentUploadResponse,
    EconomicCalendarRequest,
    EconomicCalendarResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
    ForgetAllRequest,
    ForgetAllResponse,
    ForgetRequest,
    ForgetResponse,
    GetAccountSettingsRequest,
    GetAccountSettingsResponse,
    GetFinancialAssessmentRequest,
    GetFinancialAssessmentResponse,
    GetSelfExclusionRequest,
    GetSelfExclusionResponse,
    IdentityVerificationAddDocumentRequest,
    IdentityVerificationAddDocumentResponse,
    KYCAuthenticationStatusRequest,
    KYCAuthenticationStatusResponse,
    LandingCompanyDetailsRequest,
    LandingCompanyDetailsResponse,
    LandingCompanyRequest,
    LandingCompanyResponse,
    LoginHistoryRequest,
    LoginHistoryResponse,
    LogOutRequest,
    LogOutResponse,
    MT5AccountsListRequest,
    MT5AccountsListResponse,
    MT5DepositRequest,
    MT5DepositResponse,
    MT5GetSettingRequest,
    MT5GetSettingResponse,
    MT5NewAccountRequest,
    MT5NewAccountResponse,
    MT5PasswordChangeRequest,
    MT5PasswordChangeResponse,
    MT5PasswordCheckRequest,
    MT5PasswordCheckResponse,
    MT5PasswordResetRequest,
    MT5PasswordResetResponse,
    MT5WithdrawalRequest,
    MT5WithdrawalResponse,
    NewRealMoneyAccountDefaultLandingCompanyRequest,
    NewRealMoneyAccountDefaultLandingCompanyResponse,
    NewRealMoneyAccountDerivInvestmentEuropeLtdRequest,
    NewRealMoneyAccountDerivInvestmentEuropeLtdResponse,
    NewVirtualMoneyAccountRequest,
    NewVirtualMoneyAccountResponse,
    OAuthApplicationsRequest,
    OAuthApplicationsResponse,
    P2PAdvertCreateRequest,
    P2PAdvertCreateResponse,
    P2PAdvertInformationRequest,
    P2PAdvertInformationResponse,
    P2PAdvertiserAdvertsRequest,
    P2PAdvertiserAdvertsResponse,
    P2PAdvertiserCreateRequest,
    P2PAdvertiserCreateResponse,
    P2PAdvertiserInformationRequest,
    P2PAdvertiserInformationResponse,
    P2PAdvertiserListRequest,
    P2PAdvertiserListResponse,
    P2PAdvertiserPaymentMethodsRequest,
    P2PAdvertiserPaymentMethodsResponse,
    P2PAdvertiserRelationsRequest,
    P2PAdvertiserRelationsResponse,
    P2PAdvertiserUpdateRequest,
    P2PAdvertiserUpdateResponse,
    P2PAdvertListRequest,
    P2PAdvertListResponse,
    P2PAdvertUpdateRequest,
    P2PAdvertUpdateResponse,
    P2PChatCreateRequest,
    P2PChatCreateResponse,
    P2PCountryListRequest,
    P2PCountryListResponse,
    P2POrderCancelRequest,
    P2POrderCancelResponse,
    P2POrderConfirmRequest,
    P2POrderConfirmResponse,
    P2POrderCreateRequest,
    P2POrderCreateResponse,
    P2POrderDisputeRequest,
    P2POrderDisputeResponse,
    P2POrderInformationRequest,
    P2POrderInformationResponse,
    P2POrderListRequest,
    P2POrderListResponse,
    P2POrderReviewRequest,
    P2POrderReviewResponse,
    P2PPaymentMethodsRequest,
    P2PPaymentMethodsResponse,
    P2PPingRequest,
    P2PPingResponse,
    P2PSettingsRequest,
    P2PSettingsResponse,
    PaymentAgentCreateRequest,
    PaymentAgentCreateResponse,
    PaymentAgentDetailsRequest,
    PaymentAgentDetailsResponse,
    PaymentAgentListRequest,
    PaymentAgentListResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    PaymentAgentWithdrawJustificationRequest,
    PaymentAgentWithdrawJustificationResponse,
    PaymentAgentWithdrawRequest,
    PaymentAgentWithdrawResponse,
    PaymentMethodsRequest,
    PaymentMethodsResponse,
    PayoutCurrenciesRequest,
    PayoutCurrenciesResponse,
    PingRequest,
    PingResponse,
    PortfolioRequest,
    PortfolioResponse,
    PriceProposalOpenContractsRequest,
    PriceProposalOpenContractsResponse,
    PriceProposalRequest,
    PriceProposalResponse,
    ProfitTableRequest,
    ProfitTableResponse,
    RealityCheckRequest,
    RealityCheckResponse,
    RevokeOauthApplicationRequest,
    RevokeOauthApplicationResponse,
    SellContractRequest,
    SellContractResponse,
    SellContractsMultipleAccountsRequest,
    SellContractsMultipleAccountsResponse,
    SellExpiredContractsRequest,
    SellExpiredContractsResponse,
    ServerConfigRequest,
    ServerConfigResponse,
    ServerListRequest,
    ServerListResponse,
    ServerStatusRequest,
    ServerStatusResponse,
    ServerTimeRequest,
    ServerTimeResponse,
    SetAccountCurrencyRequest,
    SetAccountCurrencyResponse,
    SetAccountSettingsRequest,
    SetAccountSettingsResponse,
    SetFinancialAssessmentRequest,
    SetFinancialAssessmentResponse,
    SetSelfExclusionRequest,
    SetSelfExclusionResponse,
    StatementRequest,
    StatementResponse,
    StatesListRequest,
    StatesListResponse,
    TermsAndConditionsApprovalRequest,
    TermsAndConditionsApprovalResponse,
    TicksHistoryRequest,
    TicksHistoryResponse,
    TicksStreamRequest,
    TicksStreamResponse,
    TopUpVirtualMoneyAccountRequest,
    TopUpVirtualMoneyAccountResponse,
    TradingDurationsRequest,
    TradingDurationsResponse,
    TradingPlatformPasswordResetRequest,
    TradingPlatformPasswordResetResponse,
    TradingTimesRequest,
    TradingTimesResponse,
    TransactionsStreamRequest,
    TransactionsStreamResponse,
    TransferBetweenAccountsRequest,
    TransferBetweenAccountsResponse,
    UnsubscribeEmailRequest,
    UnsubscribeEmailResponse,
    UpdateContractHistoryRequest,
    UpdateContractHistoryResponse,
    UpdateContractRequest,
    UpdateContractResponse,
} from '@deriv/api-types';

export type NoStringIndex<T> = { [K in keyof T as string extends K ? never : K]: T[K] };

type TSocketEndpoints = {
    active_symbols: {
        request: ActiveSymbolsRequest;
        response: ActiveSymbolsResponse;
    };
    api_token: {
        request: APITokenRequest;
        response: APITokenResponse;
    };
    app_delete: {
        request: ApplicationDeleteRequest;
        response: ApplicationDeleteResponse;
    };
    app_get: {
        request: ApplicationGetDetailsRequest;
        response: ApplicationGetDetailsResponse;
    };
    app_list: {
        request: ApplicationListRequest;
        response: ApplicationListResponse;
    };
    app_markup_details: {
        request: ApplicationMarkupDetailsRequest;
        response: ApplicationMarkupDetailsResponse;
    };
    app_markup_statistics: {
        request: ApplicationMarkupStatisticsRequest;
        response: ApplicationMarkupStatisticsResponse;
    };
    app_register: {
        request: ApplicationRegisterRequest;
        response: ApplicationRegisterResponse;
    };
    app_update: {
        request: ApplicationUpdateRequest;
        response: ApplicationUpdateResponse;
    };
    asset_index: {
        request: AssetIndexRequest;
        response: AssetIndexResponse;
    };
    authorize: {
        request: AuthorizeRequest;
        response: AuthorizeResponse;
    };
    balance: {
        request: BalanceRequest;
        response: BalanceResponse;
    };
    buy_contract_for_multiple_accounts: {
        request: BuyContractForMultipleAccountsRequest;
        response: BuyContractForMultipleAccountsResponse;
    };
    buy: {
        request: BuyContractRequest;
        response: BuyContractResponse;
    };
    cancel: {
        request: CancelAContractRequest;
        response: CancelAContractResponse;
    };
    cashier: {
        request: CashierInformationRequest;
        response: CashierInformationResponse;
    };
    confirm_email: {
        request: {
            /**
             * Must be `1`.
             */
            confirm_email: 1;

            /**
             * Boolean value: 1 or 0, indicating whether the client has given consent for marketing emails.
             */
            email_consent: 1 | 0;

            /**
             * Email verification code (received from a `verify_email` call, which must be done first).
             */
            verification_code: string;

            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };

            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * 1 for success (The verification code has been successfully verified)
             */
            confirm_email: 0 | 1;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };

        /**
         * Action name of the request made.
         */
        msg_type: 'confirm_email';

        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
    };
    contract_update_history: {
        request: UpdateContractHistoryRequest;
        response: UpdateContractHistoryResponse;
    };
    contract_update: {
        request: UpdateContractRequest;
        response: UpdateContractResponse;
    };
    contracts_for: {
        request: ContractsForSymbolRequest;
        response: ContractsForSymbolResponse;
    };
    copy_start: {
        request: CopyTradingStartRequest;
        response: CopyTradingStartResponse;
    };
    copy_stop: {
        request: CopyTradingStopRequest;
        response: CopyTradingStopResponse;
    };
    copytrading_list: {
        request: CopyTradingListRequest;
        response: CopyTradingListResponse;
    };
    copytrading_statistics: {
        request: CopyTradingStatisticsRequest;
        response: CopyTradingStatisticsResponse;
    };
    crypto_config: {
        request: CryptocurrencyConfigurationsRequest;
        response: CryptocurrencyConfigurationsResponse;
    };
    document_upload: {
        request: DocumentUploadRequest;
        response: DocumentUploadResponse;
    };
    economic_calendar: {
        request: EconomicCalendarRequest;
        response: EconomicCalendarResponse;
    };
    exchange_rates: {
        request: ExchangeRatesRequest;
        response: ExchangeRatesResponse;
    };
    forget_all: {
        request: ForgetAllRequest;
        response: ForgetAllResponse;
    };
    forget: {
        request: ForgetRequest;
        response: ForgetResponse;
    };
    get_account_status: {
        request: AccountStatusRequest;
        response: AccountStatusResponse;
    };
    get_financial_assessment: {
        request: GetFinancialAssessmentRequest;
        response: GetFinancialAssessmentResponse;
    };
    get_limits: {
        request: AccountLimitsRequest;
        response: AccountLimitsResponse;
    };
    get_self_exclusion: {
        request: GetSelfExclusionRequest;
        response: GetSelfExclusionResponse;
    };
    get_settings: {
        request: GetAccountSettingsRequest;
        response: GetAccountSettingsResponse;
    };
    identity_verification_document_add: {
        request: IdentityVerificationAddDocumentRequest;
        response: IdentityVerificationAddDocumentResponse;
    };
    kyc_auth_status: {
        request: KYCAuthenticationStatusRequest;
        response: KYCAuthenticationStatusResponse;
    };
    landing_company_details: {
        request: LandingCompanyDetailsRequest;
        response: LandingCompanyDetailsResponse;
    };
    landing_company: {
        request: Omit<LandingCompanyRequest, 'landing_company'> & {
            landing_company: string;
        };
        response: LandingCompanyResponse;
    };
    login_history: {
        request: LoginHistoryRequest;
        response: LoginHistoryResponse;
    };
    logout: {
        request: LogOutRequest;
        response: LogOutResponse;
    };
    mt5_deposit: {
        request: MT5DepositRequest;
        response: MT5DepositResponse;
    };
    mt5_get_settings: {
        request: MT5GetSettingRequest;
        response: MT5GetSettingResponse;
    };
    mt5_login_list: {
        request: MT5AccountsListRequest;
        response: MT5AccountsListResponse;
    };
    mt5_new_account: {
        request: MT5NewAccountRequest;
        response: MT5NewAccountResponse;
    };
    mt5_password_change: {
        request: MT5PasswordChangeRequest;
        response: MT5PasswordChangeResponse;
    };
    mt5_password_check: {
        request: MT5PasswordCheckRequest;
        response: MT5PasswordCheckResponse;
    };
    mt5_password_reset: {
        request: MT5PasswordResetRequest;
        response: MT5PasswordResetResponse;
    };
    mt5_withdrawal: {
        request: MT5WithdrawalRequest;
        response: MT5WithdrawalResponse;
    };
    new_account_maltainvest: {
        request: NewRealMoneyAccountDerivInvestmentEuropeLtdRequest;
        response: NewRealMoneyAccountDerivInvestmentEuropeLtdResponse;
    };
    new_account_real: {
        request: NewRealMoneyAccountDefaultLandingCompanyRequest;
        response: NewRealMoneyAccountDefaultLandingCompanyResponse;
    };
    new_account_virtual: {
        request: NewVirtualMoneyAccountRequest;
        response: NewVirtualMoneyAccountResponse;
    };
    notifications_list: {
        request: {
            /**
             * Must be 1
             */
            notifications_list: 1;
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
            /**
             * [Optional] If set to 1, will send updates whenever there is a change to any notification belonging to you.
             */
            subscribe?: 1;
        };
        response: {
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'notifications_list';
            notifications_list: {
                /**
                 * Total no. of notifications that are actionable.
                 */
                count_actionable: number;
                /**
                 * Total no. of notifications.
                 */
                count_total: number;
                /**
                 * Total no. of unread notifications.
                 */
                count_unread: number;
                /**
                 * List of notifications.
                 */
                messages: {
                    /**
                     * `Act` if the notification is actionable.
                     */
                    category: 'act' | 'see';
                    /**
                     * Id of the notification.
                     */
                    id: number;
                    links: {
                        href: string;
                        rel: string;
                    }[];
                    /**
                     * Unique key of the notification.
                     */
                    message_key: string;
                    /**
                     * Contains keys and values use for transforming the notification message.
                     */
                    payload: string;
                    /**
                     * Flag indicating if the notification has been read.
                     */
                    read: boolean;
                    /**
                     * Flag indicating if the notification has been removed.
                     */
                    removed: boolean;
                }[];
            };
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
        };
    };
    notifications_update_status: {
        request: {
            /**
             * Action to call. Must be `read`, `unread`, or `remove`.
             */
            notifications_update_status: 'read' | 'unread' | 'remove';
            /**
             * Array of notification ids to update.
             */
            ids: string[];
        };
        response: {
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'notifications_update_status';
            /**
             * List of updated notifications.
             */
            notifications_update_status: string[];
        };
    };
    oauth_apps: {
        request: OAuthApplicationsRequest;
        response: OAuthApplicationsResponse;
    };
    p2p_advert_create: {
        request: P2PAdvertCreateRequest;
        response: P2PAdvertCreateResponse;
    };
    p2p_advert_info: {
        request: P2PAdvertInformationRequest;
        response: P2PAdvertInformationResponse;
    };
    p2p_advert_list: {
        request: P2PAdvertListRequest;
        response: P2PAdvertListResponse;
    };
    p2p_advert_update: {
        request: P2PAdvertUpdateRequest;
        response: P2PAdvertUpdateResponse;
    };
    p2p_advertiser_adverts: {
        request: P2PAdvertiserAdvertsRequest;
        response: P2PAdvertiserAdvertsResponse;
    };
    p2p_advertiser_create: {
        request: P2PAdvertiserCreateRequest;
        response: P2PAdvertiserCreateResponse;
    };
    p2p_advertiser_info: {
        request: P2PAdvertiserInformationRequest;
        response: P2PAdvertiserInformationResponse;
    };
    p2p_advertiser_list: {
        request: P2PAdvertiserListRequest;
        response: P2PAdvertiserListResponse;
    };
    p2p_advertiser_payment_methods: {
        request: P2PAdvertiserPaymentMethodsRequest;
        response: P2PAdvertiserPaymentMethodsResponse;
    };
    p2p_advertiser_relations: {
        request: P2PAdvertiserRelationsRequest;
        response: P2PAdvertiserRelationsResponse;
    };
    p2p_advertiser_update: {
        request: P2PAdvertiserUpdateRequest;
        response: P2PAdvertiserUpdateResponse;
    };
    p2p_chat_create: {
        request: P2PChatCreateRequest;
        response: P2PChatCreateResponse;
    };
    p2p_country_list: {
        request: P2PCountryListRequest;
        response: P2PCountryListResponse;
    };
    p2p_order_cancel: {
        request: P2POrderCancelRequest;
        response: P2POrderCancelResponse;
    };
    p2p_order_confirm: {
        request: P2POrderConfirmRequest;
        response: P2POrderConfirmResponse;
    };
    p2p_order_create: {
        request: P2POrderCreateRequest;
        response: P2POrderCreateResponse;
    };
    p2p_order_dispute: {
        request: P2POrderDisputeRequest;
        response: P2POrderDisputeResponse;
    };
    p2p_order_info: {
        request: P2POrderInformationRequest;
        response: P2POrderInformationResponse;
    };
    p2p_order_list: {
        request: P2POrderListRequest;
        response: P2POrderListResponse;
    };
    p2p_order_review: {
        request: P2POrderReviewRequest;
        response: P2POrderReviewResponse;
    };
    p2p_payment_methods: {
        request: P2PPaymentMethodsRequest;
        response: P2PPaymentMethodsResponse;
    };
    p2p_ping: {
        request: P2PPingRequest;
        response: P2PPingResponse;
    };
    p2p_settings: {
        request: P2PSettingsRequest;
        response: P2PSettingsResponse;
    };
    payment_methods: {
        request: PaymentMethodsRequest;
        response: PaymentMethodsResponse;
    };
    paymentagent_create: {
        request: PaymentAgentCreateRequest;
        response: PaymentAgentCreateResponse;
    };
    paymentagent_details: {
        request: PaymentAgentDetailsRequest;
        response: PaymentAgentDetailsResponse;
    };
    paymentagent_list: {
        request: PaymentAgentListRequest;
        response: PaymentAgentListResponse;
    };
    paymentagent_transfer: {
        request: PaymentAgentTransferRequest;
        response: PaymentAgentTransferResponse;
    };
    paymentagent_withdraw: {
        request: PaymentAgentWithdrawRequest;
        response: PaymentAgentWithdrawResponse;
    };
    paymentagent_withdraw_justification: {
        request: PaymentAgentWithdrawJustificationRequest;
        response: PaymentAgentWithdrawJustificationResponse;
    };
    payout_currencies: {
        request: PayoutCurrenciesRequest;
        response: PayoutCurrenciesResponse;
    };
    ping: {
        request: PingRequest;
        response: PingResponse;
    };
    portfolio: {
        request: PortfolioRequest;
        response: PortfolioResponse;
    };
    profit_table: {
        request: ProfitTableRequest;
        response: ProfitTableResponse;
    };
    proposal_open_contract: {
        request: PriceProposalOpenContractsRequest;
        response: PriceProposalOpenContractsResponse;
    };
    proposal: {
        request: PriceProposalRequest;
        response: PriceProposalResponse;
    };
    reality_check: {
        request: RealityCheckRequest;
        response: RealityCheckResponse;
    };
    residence_list: {
        request: CountriesListRequest;
        response: CountriesListResponse;
    };
    revoke_oauth_app: {
        request: RevokeOauthApplicationRequest;
        response: RevokeOauthApplicationResponse;
    };
    sell_contract_for_multiple_accounts: {
        request: SellContractsMultipleAccountsRequest;
        response: SellContractsMultipleAccountsResponse;
    };
    sell_expired: {
        request: SellExpiredContractsRequest;
        response: SellExpiredContractsResponse;
    };
    sell: {
        request: SellContractRequest;
        response: SellContractResponse;
    };
    set_account_currency: {
        request: SetAccountCurrencyRequest;
        response: SetAccountCurrencyResponse;
    };
    set_financial_assessment: {
        request: SetFinancialAssessmentRequest;
        response: SetFinancialAssessmentResponse;
    };
    set_self_exclusion: {
        request: SetSelfExclusionRequest;
        response: SetSelfExclusionResponse;
    };
    set_settings: {
        request: SetAccountSettingsRequest;
        response: SetAccountSettingsResponse;
    };
    statement: {
        request: StatementRequest;
        response: StatementResponse;
    };
    states_list: {
        request: StatesListRequest;
        response: StatesListResponse;
    };
    ticks_history: {
        request: TicksHistoryRequest;
        response: TicksHistoryResponse;
    };
    ticks: {
        request: TicksStreamRequest;
        response: TicksStreamResponse;
    };
    time: {
        request: ServerTimeRequest;
        response: ServerTimeResponse;
    };
    tnc_approval: {
        request: TermsAndConditionsApprovalRequest;
        response: TermsAndConditionsApprovalResponse;
    };
    topup_virtual: {
        request: TopUpVirtualMoneyAccountRequest;
        response: TopUpVirtualMoneyAccountResponse;
    };
    trading_durations: {
        request: TradingDurationsRequest;
        response: TradingDurationsResponse;
    };
    trading_platform_password_reset: {
        request: TradingPlatformPasswordResetRequest;
        response: TradingPlatformPasswordResetResponse;
    };
    trading_servers: {
        request: ServerListRequest;
        response: ServerListResponse;
    };
    trading_times: {
        request: TradingTimesRequest;
        response: TradingTimesResponse;
    };
    transaction: {
        request: TransactionsStreamRequest;
        response: TransactionsStreamResponse;
    };
    transfer_between_accounts: {
        request: TransferBetweenAccountsRequest;
        response: TransferBetweenAccountsResponse;
    };
    unsubscribe_email: {
        request: UnsubscribeEmailRequest;
        response: UnsubscribeEmailResponse;
    };
    website_config: {
        request: ServerConfigRequest;
        response: ServerConfigResponse;
    };
    website_status: {
        request: ServerStatusRequest;
        response: ServerStatusResponse;
    };
};

export type TSocketEndpointNames = keyof TSocketEndpoints;

export type TSocketError<T extends TSocketEndpointNames> = {
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Error object.
     */
    error: {
        code: string;
        message: string;
    };
    /**
     * Action name of the request made.
     */
    msg_type: T;
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
};

export type TSocketResponse<T extends TSocketEndpointNames> = TSocketEndpoints[T]['response'] & TSocketError<T>;

export type TSocketResponseData<T extends TSocketEndpointNames> = Omit<
    NoStringIndex<TSocketResponse<T>>,
    'req_id' | 'echo_req' | 'subscription'
>;

export type TLandingCompany = {
    financial_company: {
        shortcode: string;
    };
    gaming_company: {
        shortcode: string;
    };
    mt_gaming_company: {
        financial: {
            shortcode: string;
        };
        swap_free: {
            shortcode: string;
        };
    };
};

export type TAccount = {
    account_category: string;
    account_type: string;
    broker: string;
    created_at: number;
    currency: string;
    currency_type: string;
    is_disabled: number;
    is_virtual: number;
    landing_company_name: string;
    linked_to: Array<any>;
    loginid: string;
};

export type TAuthData = {
    account_list: TAccount[];
    balance: number;
    country: string;
    currency: string;
    email: string;
    fullname: string;
    is_virtual: number;
    landing_company_fullname: string;
    landing_company_name: string;
    linked_to: [];
    local_currencies: Record<string, any>;
    loginid: string;
    preferred_language: string;
    scopes: string[];
    upgradeable_landing_companies: string[];
    user_id: number;
};
