import { ethers, Contract } from 'ethers'
import { sepolia } from './rpcUrls'
import abi from './abis/ScheduledTransfers.json'
import fs from 'fs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const chain = sepolia
const contractAddress = '0xF1aE317941efeb1ffB103D959EF58170F1e577E0'
const contractAbi = abi
const eventName = 'ExecutionAdded'
const targetTopic1 = '0x000000000000000000000000469874c9e35c19fbf2eac9fba3a1cc397023ff68'

async function main() {
	const provider = new ethers.JsonRpcProvider(chain)
	const contract = new Contract(contractAddress, contractAbi, provider)

	const filter = contract.filters[eventName]

	const events = (await contract.queryFilter(filter)) as ethers.EventLog[]

	if (!events.length) {
		console.log('No events found')
	}

	const filteredEvents = events.filter(event => event.topics[1] === targetTopic1)

	const output = []

	for (const event of filteredEvents) {
		const block = await provider.getBlock(event.blockNumber)
		if (!block) throw new Error('Block not found')

		const date = dayjs.unix(block.timestamp).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')

		output.push({
			date,
			...event.toJSON(),
		})
	}

	// reverse output
	output.reverse()

	fs.writeFileSync(`output/${eventName}.json`, JSON.stringify(output, null, 2))
	console.log(`Successfully written to output/${eventName}.json`)

	console.log('length of output:', output.length)
}

main()
