export const contract = "0x8c968c24F074A3c4520653f76Df5d82065EeF307";
export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UserAlreadyBanned",
    type: "error",
  },
  {
    inputs: [],
    name: "UserAlreadyReported",
    type: "error",
  },
  {
    inputs: [],
    name: "UserAlreadyUnderAssessment",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reportedUser",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reporter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reason",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reportsCount",
        type: "uint256",
      },
    ],
    name: "UserReported",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "checkReportThreshold",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "counterReport",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "deleteReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cursor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
    ],
    name: "getReports",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "reported",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "counter",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAssessment",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalSpam",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalViolenceSpeech",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalChildAbuse",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalIllegalDrugs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalTerrorism",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalOther",
            type: "uint256",
          },
        ],
        internalType: "struct ReportsResponse[]",
        name: "reportsResponse",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "newCursor",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "hasReported",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "idByReported",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minReports",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "profileGovernance",
    outputs: [
      {
        internalType: "contract IProfileGovernance",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum Reasons",
        name: "reason",
        type: "uint8",
      },
    ],
    name: "reportUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "reports",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "reported",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "counter",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "executed",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isAssessment",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "setIsAssessment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minReports",
        type: "uint256",
      },
    ],
    name: "setMinReports",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_profileGovernance",
        type: "address",
      },
    ],
    name: "updateExternalContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
