const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CertificateRegistry', function () {
  let registry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    const CertificateRegistry = await ethers.getContractFactory('CertificateRegistry');
    [owner, addr1, addr2] = await ethers.getSigners();
    registry = await CertificateRegistry.deploy();
  });

  describe('Issuance', function () {
    it('Should issue a certificate', async function () {
      const metadataUri = 'ipfs://example';
      const tx = await registry.issueCertificate(addr1.address, metadataUri);
      await tx.wait();

      const certificateId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'string', 'uint256'],
          [addr1.address, metadataUri, await ethers.provider.getBlock('latest').then(b => b.timestamp)]
        )
      );

      const result = await registry.verifyCertificate(certificateId);
      expect(result[0]).to.equal(true); // valid
      expect(result[1]).to.equal(owner.address); // issuer
      expect(result[2]).to.equal(addr1.address); // recipient
      expect(result[3]).to.equal(metadataUri); // metadataUri
    });

    it('Should not allow issuing to zero address', async function () {
      await expect(
        registry.issueCertificate(ethers.ZeroAddress, 'ipfs://example')
      ).to.be.revertedWith('Recipient address cannot be zero');
    });

    it('Should not allow duplicate certificates', async function () {
      const metadataUri = 'ipfs://example';
      await registry.issueCertificate(addr1.address, metadataUri);
      await expect(
        registry.issueCertificate(addr1.address, metadataUri)
      ).to.be.revertedWith('Certificate already exists');
    });
  });

  describe('Revocation', function () {
    let certificateId;

    beforeEach(async function () {
      const metadataUri = 'ipfs://example';
      const tx = await registry.issueCertificate(addr1.address, metadataUri);
      await tx.wait();

      certificateId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'string', 'uint256'],
          [addr1.address, metadataUri, await ethers.provider.getBlock('latest').then(b => b.timestamp)]
        )
      );
    });

    it('Should revoke a certificate', async function () {
      await registry.revokeCertificate(certificateId);
      const result = await registry.verifyCertificate(certificateId);
      expect(result[0]).to.equal(false); // not valid
    });

    it('Should not allow non-issuer to revoke', async function () {
      await expect(
        registry.connect(addr1).revokeCertificate(certificateId)
      ).to.be.revertedWith('Only issuer can revoke certificate');
    });

    it('Should not allow revoking non-existent certificate', async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes('fake'));
      await expect(
        registry.revokeCertificate(fakeId)
      ).to.be.revertedWith('Certificate does not exist');
    });

    it('Should not allow revoking already revoked certificate', async function () {
      await registry.revokeCertificate(certificateId);
      await expect(
        registry.revokeCertificate(certificateId)
      ).to.be.revertedWith('Certificate already revoked');
    });
  });

  describe('Verification', function () {
    it('Should verify a valid certificate', async function () {
      const metadataUri = 'ipfs://example';
      const tx = await registry.issueCertificate(addr1.address, metadataUri);
      await tx.wait();

      const certificateId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'string', 'uint256'],
          [addr1.address, metadataUri, await ethers.provider.getBlock('latest').then(b => b.timestamp)]
        )
      );

      const result = await registry.verifyCertificate(certificateId);
      expect(result[0]).to.equal(true);
      expect(result[1]).to.equal(owner.address);
      expect(result[2]).to.equal(addr1.address);
      expect(result[3]).to.equal(metadataUri);
      expect(result[4]).to.be.a('bigint');
    });

    it('Should return invalid for non-existent certificate', async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes('fake'));
      const result = await registry.verifyCertificate(fakeId);
      expect(result[0]).to.equal(false);
      expect(result[1]).to.equal(ethers.ZeroAddress);
      expect(result[2]).to.equal(ethers.ZeroAddress);
      expect(result[3]).to.equal('');
      expect(result[4]).to.equal(0);
    });
  });
});