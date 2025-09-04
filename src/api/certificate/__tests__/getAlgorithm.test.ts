import { getAlgorithm } from '../getAlgorithm';

const executionSteps = ['step 0', 'step 1', 'step 2', 'step 3'];

const executionFlow = {
  [executionSteps[0]]: {
    Algorithm: executionSteps[1],
  },
  [executionSteps[1]]: {
    FriendlyName: executionSteps[2],
    Value: executionSteps[3],
  },
  [executionSteps[2]]: 'algorithm',
  [executionSteps[3]]: 'oid',
};

beforeAll(() => {
  window.cadesplugin.__defineExecutionFlow(executionFlow);
});

describe('getAlgorithm', () => {
  test('returns information about algorithm', async () => {
    const algorithmInfo = await getAlgorithm.call({
      _cadesCertificate: {
        PublicKey: jest.fn(() => executionSteps[0]),
      },
    });

    expect(algorithmInfo).toStrictEqual({
      algorithm: 'algorithm',
      oid: 'oid',
    });
  });
});
