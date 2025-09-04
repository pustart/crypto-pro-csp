import { rawCertificates, parsedCertificates } from '../../__mocks__/certificates';
import { getUserCertificates } from '../getUserCertificates';

const [rawCertificateMock] = rawCertificates;
const [parsedCertificateMock] = parsedCertificates;

const executionSteps = [
  'step 0',
  'step 1',
  'step 2',
  'step 3',
  'step 4',
  'step 5',
  'step 6',
  'step 7',
  'step 8',
  'step 9',
  'step 10',
];

const executionFlow = {
  [executionSteps[0]]: {
    Certificates: executionSteps[1],
    Close: jest.fn(),
    Open: jest.fn(),
  },
  [executionSteps[1]]: {
    Find: jest.fn(() => executionSteps[2]),
  },
  [executionSteps[2]]: {
    Find: jest.fn(() => executionSteps[3]),
  },
  [executionSteps[3]]: {
    Count: executionSteps[4],
    Item: jest.fn(() => executionSteps[5]),
  },
  [executionSteps[4]]: 1,
  [executionSteps[5]]: {
    IssuerName: executionSteps[8],
    SubjectName: executionSteps[7],
    Thumbprint: executionSteps[6],
    ValidFromDate: executionSteps[9],
    ValidToDate: executionSteps[10],
  },
  [executionSteps[8]]: rawCertificateMock.IssuerName,
  [executionSteps[7]]: rawCertificateMock.SubjectName,
  [executionSteps[6]]: rawCertificateMock.Thumbprint,
  [executionSteps[9]]: rawCertificateMock.ValidFromDate,
  [executionSteps[10]]: rawCertificateMock.ValidToDate,
};

beforeAll(() => {
  window.cadesplugin.__defineExecutionFlow(executionFlow);
  window.cadesplugin.CreateObjectAsync.mockImplementation(() => executionSteps[0]);
});

describe('getUserCertificates', () => {
  test('returns certificates list', async () => {
    const certificates = await getUserCertificates();

    expect(certificates.length).toBeGreaterThan(0);
  });

  test('returns certificates with correct fields', async () => {
    const [certificate] = await getUserCertificates();

    expect(certificate).toMatchObject(parsedCertificateMock);
  });
});
