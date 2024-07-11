import 'dotenv/config'

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string
if (!ALCHEMY_API_KEY) {
	throw new Error('ALCHEMY_API_KEY is not set')
}

export const sepolia = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
export const arbitrumSepolia = 'https://arbitrum-sepolia-rpc.publicnode.com'
export const mainnet = 'https://ethereum-rpc.publicnode.com'
