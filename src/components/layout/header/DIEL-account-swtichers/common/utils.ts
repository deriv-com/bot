export const no_account = {
    currency: ' ',
    currencyLabel: 'You have no real accounts',
    is_virtual: 1,
    loginid: '',
    is_disabled: false,
    balance: '',
    icon: ' ',
    isActive: false,
    isVirtual: true,
};

export const updateNestedProperty = (accounts, nestedProperty, newValue) => {
    return accounts.map(account => {
        return {
            ...account,
            account: {
                ...account.account,
                [nestedProperty]: newValue,
            },
        };
    });
};
