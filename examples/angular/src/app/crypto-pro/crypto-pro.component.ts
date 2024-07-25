import { Component, OnInit } from '@angular/core';
import {
  getCertificate,
  getUserCertificates,
  getSystemInfo,
  isValidSystemSetup,
  createHash,
  createDetachedSignature,
  createAttachedSignature,
  SystemInfo,
  Certificate
} from 'crypto-pro';

@Component({
  selector: 'app-crypto-pro',
  templateUrl: './crypto-pro.component.html',
  styleUrls: ['./crypto-pro.component.css']
})
export class CryptoProComponent implements OnInit {
  public message = 'Привет мир!';
  public certificateList: Certificate[] = [];
  public hash: string | null = null;
  public hashStatus = 'Не вычислен';
  public detachedSignature = true;
  public thumbprint: string | null = null;
  public signature: string | null = null;
  public signatureStatus = 'Не создана';
  public systemInfo: undefined | SystemInfo & {
    isValidSystemSetup: boolean;
  };
  public certificateListError: string | null = null;
  public certificateInfoError: string | null = null;
  public hashError: string | null = null;
  public signatureError: string | null = null;
  public systemInfoError: string | null = null;
  public certInfo: { [key: string]: unknown } | null = null;

  constructor() { }

  public ngOnInit(): void {
    this.displayCertificates();
    this.displaySystemInfo();
  }

  public async createSignature(thumbprint: string | null) {
    if (!thumbprint) {
      return;
    }

    this.hash = null;
    this.hashError = null;
    this.signature = null;
    this.signatureError = null;
    this.hashStatus = 'Вычисляется...';

    try {
      this.hash = await createHash(this.message);
    } catch (error) {
      this.hashError = (error as Error).message;

      return;
    }

    this.hashStatus = 'Не вычислен';
    this.signatureStatus = 'Создается...';

    if (this.detachedSignature) {
      try {
        this.signature = await createDetachedSignature(thumbprint, this.hash);
      } catch (error) {
        this.signatureError = (error as Error).message;
      }

      this.signatureStatus = 'Не создана';

      return;
    }

    try {
      this.signature = await createAttachedSignature(thumbprint, this.message);
    } catch (error) {
      this.signatureError = (error as Error).message;
    }

    this.signatureStatus = 'Не создана';
  }

  public async showCertInfo(thumbprint: string | null) {
    if (!thumbprint) {
      return;
    }

    this.certInfo = null;
    this.certificateInfoError = null;

    try {
      const certificate = await getCertificate(thumbprint);

      this.certInfo = {
        name: certificate.name,
        issuerName: certificate.issuerName,
        subjectName: certificate.subjectName,
        thumbprint: certificate.thumbprint,
        validFrom: certificate.validFrom,
        validTo: certificate.validTo,
        isValid: await certificate.isValid(),
        version: await certificate.getCadesProp('Version'),
        base64: await certificate.exportBase64(),
        algorithm: await certificate.getAlgorithm(),
        extendedKeyUsage: await certificate.getExtendedKeyUsage(),
        ownerInfo: await certificate.getOwnerInfo(),
        issuerInfo: await certificate.getIssuerInfo(),
        decodedExtendedKeyUsage: await certificate.getDecodedExtendedKeyUsage(),
        '1.3.6.1.4.1.311.80.1': await certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.1'),
        '[\'1.3.6.1.5.5.7.3.2\', \'1.3.6.1.4.1.311.10.3.12\']': await certificate.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.2',
          '1.3.6.1.4.1.311.10.3.12'
        ]),
        '1.3.6.1.4.1.311.80.2': await certificate.hasExtendedKeyUsage('1.3.6.1.4.1.311.80.2'),
        '\'1.3.6.1.5.5.7.3.3\', \'1.3.6.1.4.1.311.10.3.12\'': await certificate.hasExtendedKeyUsage([
          '1.3.6.1.5.5.7.3.3',
          '1.3.6.1.4.1.311.10.3.12'
        ]),
      };
    } catch (error) {
      this.certificateInfoError = (error as Error).message;
    }
  }

  private async displayCertificates() {
    this.certificateListError = null;

    try {
      this.certificateList = await getUserCertificates();
    } catch (error) {
      this.certificateListError = (error as Error).message;
    }
  }

  private async displaySystemInfo() {
    this.systemInfoError = null;

    try {
      this.systemInfo = {
        ...await getSystemInfo(),
        isValidSystemSetup: await isValidSystemSetup()
      };
    } catch (error) {
      this.systemInfoError = (error as Error).message;
    }
  }
}
