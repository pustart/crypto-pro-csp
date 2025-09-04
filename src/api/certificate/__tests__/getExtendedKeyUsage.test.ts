import { getExtendedKeyUsage } from '../getExtendedKeyUsage';

const oidsMock = ['1.3.6.1.4.1.311.80.1'];

const executionSteps = ['step 0', 'step 1', 'step 2', 'step 3', 'step 4'];
const executionFlow = {
  [executionSteps[0]]: {
    EKUs: executionSteps[1],
  },
  [executionSteps[1]]: {
    Count: executionSteps[2],
    Item: jest.fn(() => executionSteps[3]),
  },
  [executionSteps[2]]: 1,
  [executionSteps[3]]: {
    OID: executionSteps[4],
  },
  [executionSteps[4]]: oidsMock[0],
};

beforeAll(() => {
  window.cadesplugin.__defineExecutionFlow(executionFlow);
});

describe('getExtendedKeyUsage', () => {
  test('returns info about oids', async () => {
    const oids = await getExtendedKeyUsage.call({
      _cadesCertificate: {
        ExtendedKeyUsage: jest.fn(() => executionSteps[0]),
      },
    });

    expect(oids).toStrictEqual(oidsMock);
  });
});
