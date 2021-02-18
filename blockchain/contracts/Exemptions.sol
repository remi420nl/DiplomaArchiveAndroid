pragma solidity ^0.5.16;

contract Exemptions {
    uint256 public exemptionCount = 0;

    struct Exemption {
        uint256 id;
        string name;
        string course;
        uint256 student_id;
    }

    mapping(uint256 => Exemption) public exemptions;

    constructor() public {
        createExemption("teststudent", "testvak", 1000);
    }

    function createExemption(
        string memory _name,
        string memory _course,
        uint256 _student_id
    ) public {
        exemptionCount++;
        exemptions[exemptionCount] = Exemption(
            exemptionCount,
            _name,
            _course,
            _student_id
        );
    }
}
