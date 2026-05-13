// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        address issuer;
        address recipient;
        string metadataUri;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Certificate) private certificates;
    event CertificateIssued(bytes32 indexed id, address indexed issuer, address indexed recipient, string metadataUri);
    event CertificateRevoked(bytes32 indexed id);

    modifier onlyValidRecipient(address recipient) {
        require(recipient != address(0), "Recipient address cannot be zero");
        _;
    }

    function issueCertificate(address recipient, string calldata metadataUri) external onlyValidRecipient(recipient) returns (bytes32) {
        bytes32 certificateId = keccak256(abi.encodePacked(recipient, metadataUri, block.timestamp));
        Certificate storage certificate = certificates[certificateId];
        require(certificate.issuedAt == 0, "Certificate already exists");

        certificate.issuer = msg.sender;
        certificate.recipient = recipient;
        certificate.metadataUri = metadataUri;
        certificate.issuedAt = block.timestamp;
        certificate.revoked = false;

        emit CertificateIssued(certificateId, msg.sender, recipient, metadataUri);
        return certificateId;
    }

    function revokeCertificate(bytes32 certificateId) external {
        Certificate storage certificate = certificates[certificateId];
        require(certificate.issuedAt != 0, "Certificate does not exist");
        require(certificate.issuer == msg.sender, "Only issuer can revoke certificate");
        require(!certificate.revoked, "Certificate already revoked");

        certificate.revoked = true;
        emit CertificateRevoked(certificateId);
    }

    function verifyCertificate(bytes32 certificateId) external view returns (bool valid, address issuer, address recipient, string memory metadataUri, uint256 issuedAt) {
        Certificate storage certificate = certificates[certificateId];
        if (certificate.issuedAt == 0 || certificate.revoked) {
            return (false, address(0), address(0), "", 0);
        }

        return (true, certificate.issuer, certificate.recipient, certificate.metadataUri, certificate.issuedAt);
    }
}