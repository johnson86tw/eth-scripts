import { ethers } from 'ethers'
import { sepolia } from './rpcUrls'

const targetAddresses = ['0xd78B5013757Ea4A7841811eF770711e6248dC282']

// =============================================================================

const provider = new ethers.WebSocketProvider(sepolia.replace('https://', 'wss://'))

async function main() {
	console.log('Start watching for transactions on target addresses...')
	console.log(targetAddresses)

	provider.on('block', async blockNumber => {
		const block = await provider.getBlock(blockNumber)
		if (!block) return

		console.log('Block number:', block.number)
		console.log('Transaction count:', block.transactions.length)
		console.log('======================================================')

		process_txs(block.transactions)
	})
}

main()

async function process_txs(txHashes: readonly string[]) {
	for (const txHash of txHashes) {
		const tx = await provider.getTransaction(txHash)
		if (!tx) continue

		if ((tx && tx.to && targetAddresses.includes(tx.to)) || (tx.from && targetAddresses.includes(tx.from))) {
			detectTransaction(tx)
		}
	}
}

function detectTransaction(tx: ethers.TransactionResponse) {
	console.log(tx.toJSON())
}
