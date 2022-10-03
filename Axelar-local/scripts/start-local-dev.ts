import {
    createAndExport,
    networks
} from '@axelar-network/axelar-local-dev';

async function main() {
    await createAndExport(
        {
            chains: ['Ethereum', 'Polygon', 'Avalanche'],
            async callback(network, info) {
                const userWallet = network.userWallets[0]
                console.log(network.name, userWallet.address, ' : \n')

                await network.deployToken('USDC', 'aUSDC', 6, BigInt(100_000_000e6))
                await network.giveToken(userWallet.address, 'aUSDC', BigInt(100e6))

                const TokenAddress = await network.getTokenContract('aUSDC')

                console.log(
                    'Balance:',
                    (await TokenAddress.balanceOf(userWallet.address)) / 1e6,
                    'USDC \n'
                )

            },
        }
    );
}


main();