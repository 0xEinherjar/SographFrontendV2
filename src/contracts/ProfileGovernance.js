export const contract = "0xac5C60439eADe6c60407F362866a6EEc9F0f17E0";
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_profileNFT",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyExecuted",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyVoted",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountBelowMinimumParticipation",
    type: "error",
  },
  {
    inputs: [],
    name: "InactiveParticipant",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientParticipation",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAssessmentState",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidQuorumValue",
    type: "error",
  },
  {
    inputs: [],
    name: "NotActiveParticipant",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughReports",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UnknownState",
    type: "error",
  },
  {
    inputs: [],
    name: "UserRecentlyReestablished",
    type: "error",
  },
  {
    inputs: [],
    name: "VotingNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalCannotBeZero",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawalNotAuthorizedYet",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "assessmentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "profile",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "status",
        type: "uint256",
      },
    ],
    name: "AssessmentExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "assessmentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "profile",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteStart",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteEnd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "NewAssessmentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "assessmentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "vote",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [],
    name: "assessmentIdCounter",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "assessments",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteEnd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteStart",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
      {
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        internalType: "address",
        name: "profile",
        type: "address",
      },
      {
        internalType: "bool",
        name: "executed",
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
    name: "bannedProfiles",
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
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "enum Vote",
        name: "_vote",
        type: "uint8",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "checkIfBanned",
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
    name: "claim",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_votingQuorum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minimumStakeAmount",
        type: "uint256",
      },
    ],
    name: "configureVotingParameters",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "createAssessment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "finalizeAssessment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAssessments",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voteEnd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voteStart",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "reason",
            type: "string",
          },
          {
            internalType: "address",
            name: "proposer",
            type: "address",
          },
          {
            internalType: "address",
            name: "profile",
            type: "address",
          },
          {
            internalType: "bool",
            name: "executed",
            type: "bool",
          },
          {
            internalType: "enum AssessmentState",
            name: "state",
            type: "uint8",
          },
        ],
        internalType: "struct AssessmentResponse[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getAssessmentState",
    outputs: [
      {
        internalType: "enum AssessmentState",
        name: "",
        type: "uint8",
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
    name: "getRestorationCount",
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
        name: "account",
        type: "address",
      },
    ],
    name: "getTotalEarnedRewards",
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
    name: "minimumStakeAmount",
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
        name: "",
        type: "address",
      },
    ],
    name: "participants",
    outputs: [
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "earned",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardIndexOf",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "balanceOf",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteHeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastVoteEnd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalVoted",
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
    ],
    name: "profileRestorationCount",
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
        name: "",
        type: "address",
      },
    ],
    name: "profileRestorationDate",
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
    name: "restorationGracePeriod",
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
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdraw",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "grace",
        type: "uint256",
      },
    ],
    name: "setVotingTimings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalStakedTokens",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sographContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_reportManager",
        type: "address",
      },
    ],
    name: "updateExternalContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "updateRewardIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "votingPeriodDuration",
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
    name: "votingQuorum",
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
    name: "votingStartDelay",
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
    name: "withdrawalCooldownPeriod",
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
];
