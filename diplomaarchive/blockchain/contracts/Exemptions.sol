pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

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

    function fromStudent(uint256 student_id)
        public
        view
        returns (string[] memory filtered)
    {
        string[] memory tempList = new string[](exemptionCount);
        uint256 count = 0;
        for (uint256 i = 0; i < exemptionCount; i++) {
            if (exemptions[i].student_id == student_id) {
                tempList[count] = exemptions[i].course;
                count++;
            }
        }

        filtered = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            filtered[i] = tempList[i];
        }
    }

    function createExemption(
        string memory _name,
        string memory _course,
        uint256 _student_id
    ) public {
        exemptions[exemptionCount] = Exemption(
            exemptionCount,
            _name,
            _course,
            _student_id
        );
        exemptionCount++;
    }
}
