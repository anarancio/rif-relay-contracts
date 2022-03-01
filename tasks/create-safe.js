const { contractNetworks, getPartnerAddresses } = require('./utils');
const SafeFactory = require('./safeFactory.json');

const setupFunctionDefinition = {
    constant: false,
    inputs: [
        {
            internalType: 'address[]',
            name: '_owners',
            type: 'address[]'
        },
        {
            internalType: 'uint256',
            name: '_threshold',
            type: 'uint256'
        },
        {
            internalType: 'address',
            name: 'to',
            type: 'address'
        },
        {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes'
        },
        {
            internalType: 'address',
            name: 'fallbackHandler',
            type: 'address'
        },
        {
            internalType: 'address',
            name: 'paymentToken',
            type: 'address'
        },
        {
            internalType: 'uint256',
            name: 'payment',
            type: 'uint256'
        },
        {
            internalType: 'address payable',
            name: 'paymentReceiver',
            type: 'address'
        }
    ],
    name: 'setup',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
};
const ZERO_ADDRESS = `0x${'0'.repeat(40)}`;
const EMPTY_DATA = '0x';

async function deploySafe(
    web3,
    safeMasterCopyAddress,
    safeProxyFactoryAddress,
    owners,
    threshold,
    initialBalance
) {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    const safeFactoryContract = new web3.eth.Contract(
        SafeFactory.abi,
        safeProxyFactoryAddress
    );
    const encodedSetupFunction = web3.eth.abi.encodeFunctionCall(
        setupFunctionDefinition,
        [
            owners,
            threshold,
            ZERO_ADDRESS,
            EMPTY_DATA,
            ZERO_ADDRESS,
            ZERO_ADDRESS,
            0,
            ZERO_ADDRESS
        ]
    );
    const createTx = await safeFactoryContract.methods
        .createProxy(safeMasterCopyAddress, encodedSetupFunction)
        .send({ from: sender });

    const safeAddressCreated =
        createTx?.events?.ProxyCreation?.returnValues.proxy;
    console.log({ safeAddressCreated });

    // give some rbtc to the safe account just created
    await web3.eth.sendTransaction({
        to: safeAddressCreated,
        value: initialBalance,
        from: sender
    });
    return safeAddressCreated;
}

module.exports = async (callback) => {
    const chainId = await web3.eth.getChainId();
    const { safeMasterCopyAddress, safeProxyFactoryAddress } =
        contractNetworks[chainId];

    const owners = await getPartnerAddresses(web3);
    const threshold = owners.length;
    const initialBalance = web3.utils.toWei('10');

    const safeAddress = await deploySafe(
        web3,
        safeMasterCopyAddress,
        safeProxyFactoryAddress,
        owners,
        threshold,
        initialBalance
    );

    const safeBalance = await web3.eth.getBalance(safeAddress);
    console.log('Safe balance', web3.utils.fromWei(safeBalance));

    // try to execute a transaction, but then we need to move this part into anther task probably
    callback();
};
