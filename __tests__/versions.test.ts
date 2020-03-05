import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('rates test', () => {
    const sdk = new SDK();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getConverterVersion of eos converter', async () => {
        const response = await sdk.getConverterVersion({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' });
        expect(response).toEqual('1.0');
    });

    it('getConverterVersion of ethereum converter with a "string" version type', async () => {
        setConverterVersionGetter(sdk, ['1.1']);
        const response = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(response).toEqual('1.1');
    });

    it('getConverterVersion of ethereum converter with a "bytes32" version type', async () => {
        setConverterVersionGetter(sdk, ['', '0x' + '2.2'.split('').map(c => c.charCodeAt(0).toString(16)).join('')]);
        const response = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(response).toEqual('2.2');
    });

    it('getConverterVersion of ethereum converter with a "uint16" version type', async () => {
        setConverterVersionGetter(sdk, ['', '', '3.3']);
        const response = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(response).toEqual('3.3');
    });

    it('getConverterVersion of ethereum converter with an unknown version type', async () => {
        setConverterVersionGetter(sdk, ['', '', '', '4.4']);
        const response = await sdk.getConverterVersion({ blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' });
        expect(response).toEqual('unknown');
    });
});

function setConverterVersionGetter(sdk, versions) {
    sdk.ethereum.web3 = {
        eth: {
            Contract: function(abi, address) {
                return {
                    methods: {
                        version: function() {
                            return {
                                call: function() {
                                    return versions.shift();
                                }
                            };
                        }
                    }
                };
            }
        }
    };
}
