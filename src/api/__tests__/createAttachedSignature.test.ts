import { rawCertificates, parsedCertificates } from '../../__mocks__/certificates';
import { createAttachedSignature } from '../createAttachedSignature';
import { _getCadesCert } from '../../helpers/_getCadesCert';

const [rawCertificateMock] = rawCertificates;
const [parsedCertificateMock] = parsedCertificates;

jest.mock('../../helpers/_getCadesCert.ts', () => ({ _getCadesCert: jest.fn(() => rawCertificateMock) }));

beforeEach(() => {
  (_getCadesCert as jest.Mock).mockClear();
});

const executionSteps = ['step 0', 'step 1', 'step 2', 'step 3', 'step 4'];

const executionFlow = {
  [executionSteps[0]]: {
    propset_Name: jest.fn(),
    propset_Value: jest.fn(),
  },
  [executionSteps[1]]: {
    propset_ContentEncoding: jest.fn(),
    propset_Content: jest.fn(),
    SignCades: jest.fn(() => executionSteps[4]),
  },
  [executionSteps[2]]: {
    propset_Certificate: jest.fn(),
    AuthenticatedAttributes2: executionSteps[3],
    propset_Options: jest.fn(),
  },
  [executionSteps[3]]: {
    Add: jest.fn(),
  },
  [executionSteps[4]]: 'signature',
};

beforeAll(() => {
  window.cadesplugin.__defineExecutionFlow(executionFlow);
  window.cadesplugin.CreateObjectAsync.mockImplementation((object) => {
    switch (object) {
      case 'CADESCOM.CPAttribute':
        return executionSteps[0];
      case 'CAdESCOM.CadesSignedData':
        return executionSteps[1];
      case 'CAdESCOM.CPSigner':
        return executionSteps[2];
    }
  });
});

describe('createAttachedSignature', () => {
  test('uses Buffer to encrypt the message', async () => {
    const originalBufferFrom = global.Buffer.from;

    (global.Buffer.from as jest.Mock) = jest.fn(() => ({
      toString: jest.fn(),
    }));

    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(global.Buffer.from).toHaveBeenCalledTimes(1);

    global.Buffer.from = originalBufferFrom;
  });

  test('uses specified certificate', async () => {
    await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(_getCadesCert).toHaveBeenCalledWith(parsedCertificateMock.thumbprint);
  });

  test('returns signature', async () => {
    const signature = await createAttachedSignature(parsedCertificateMock.thumbprint, 'message');

    expect(signature).toEqual('signature');
  });
});
