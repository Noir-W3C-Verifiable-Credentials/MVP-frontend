import { CircuitName, Claim, generateProof, ClaimBuilder, CryptographyPrimitives, Holder, IssueClaimOperation, Issuer, Proof, PublicKeyType, RevokeClaimOperation, StateTransitionByEDDSASignatureWitnessBuilder, StateTransitionOperation, bitUtils, keyUtils, EDDSAClaimQueryWitnessBuilder } from "@chung0807/ziden-noir";
import { ethers } from 'ethers'; // example using ethers v5
import stateVerifierArtifacts from '../contract-abi/StateVerifier.json' assert { type: "json" };
import stateArtifacts from '../contract-abi/State.json' assert { type: "json" };
import queryVerifiersArtifacts from '../contract-abi/QueryVerifer.json' assert { type: "json" };
import queryArtifacts from '../contract-abi/Query.json'  assert { type: "json" };
import dotenv from 'dotenv';
import { v4 } from "uuid";


dotenv.config();

export interface Query {
    verifierName: string;
    queryName: string;
    queryId: string;
    typee: number;
    slotIndex0: number;
    slotIndex1: number;
    attestingValue: BigInt;
    operator: number;
    setRoot: BigInt;
    set: any[];
    snmRoot: BigInt;
    snm: any[];
    challenge: BigInt;
    schema: SchemaDetails;
}

export interface ProofDetails {
    issuerId: string;
    holderId: string;
    proofId: string;
    queryId: string;
    schemaHash: BigInt;
    sequel: BigInt;
    queryType: BigInt;
    slotIndex0: BigInt;
    slotIndex1: BigInt;
    attestingValue: BigInt;
    operator: BigInt;
    setRoot: BigInt;
    snmRoot: BigInt;
    content: Proof;
    status: string;
}



export interface IssuerDetails {
    privateKey: BigInt;
    issuerId: string;
    entity: Issuer;
    name: string;
    schema: SchemaDetails;
    operationQueue: StateTransitionOperation[];
    isGenesisState: boolean;
}

export interface HolderDetails {
    privateKey: BigInt;
    holderId: string;
    entity: Holder;
    name: string;
}


export interface ClaimDetails {
    claimId: string;
    holderId: string;
    issuerId: string;
    status: ClaimStatus;
    content: Claim;
}

export interface SchemaDetails {
    name: string;
    slotNames: string[],
    slotTypes: SlotType[],
}

export enum SlotType {
    TEXT = 'text',
    NUMBER = 'number'
}

enum ClaimStatus {
    ISSUED = "issued",
    REVOKED = "revoked",
    PENDING = "pending",
    INOPERATIONQUEUE = "inOperationQueue",
    REJECT = "reject"
}

function utf8StringToBigint(utf8String: string): BigInt {
    // Encode the UTF-8 string to bytes
    const utf8Encoder = new TextEncoder();
    const utf8Bytes = utf8Encoder.encode(utf8String);

    // Convert the bytes to a bigint
    let result = BigInt(0);
    for (let i = 0; i < utf8Bytes.length; i++) {
        result = (result << BigInt(8)) | BigInt(utf8Bytes[i]);
    }


    return result;
}

export function convertBigIntsToStrings(obj: any): any {
    for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object') {
            // Nếu giá trị là một đối tượng, tiếp tục đệ quy
            convertBigIntsToStrings(obj[key]);
        }
    }
    return obj;
}


export class Service {
    issuerStates: Map<string, IssuerDetails>;
    holderStates: Map<string, HolderDetails>;
    claimStates: Map<string, ClaimDetails>;
    queries: Map<string, Query>;
    stateContract: any;
    queryContract: any;
    proofStates: Map<string, ProofDetails>

    constructor() {
        this.issuerStates = new Map<string, IssuerDetails>;
        this.holderStates = new Map<string, HolderDetails>;
        this.claimStates = new Map<string, ClaimDetails>;
        this.queries = new Map<string, Query>;
        this.proofStates = new Map<string, ProofDetails>;
    }

    async setup() {
        this.issuerStates = new Map<string, IssuerDetails>;
        this.holderStates = new Map<string, HolderDetails>;
        this.claimStates = new Map<string, ClaimDetails>;
        this.proofStates = new Map<string, ProofDetails>;
        this.queries = new Map<string, Query>;

        const provider = ethers.getDefaultProvider(process.env.PROVIDER || "http://127.0.0.1:8545");
        const wallet = new ethers.Wallet(process.env.WALLET || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
        const stateVerifierFactory = new ethers.ContractFactory(stateVerifierArtifacts.abi, stateVerifierArtifacts.bytecode, wallet);
        const stateVerifierContract = await stateVerifierFactory.deploy();

        const stateFactory = new ethers.ContractFactory(stateArtifacts.abi, stateArtifacts.bytecode, wallet);
        this.stateContract = await stateFactory.deploy();
        await this.stateContract.initialize(stateVerifierContract.address);

        const queryVerifierFactory = new ethers.ContractFactory(queryVerifiersArtifacts.abi, queryVerifiersArtifacts.bytecode, wallet);
        const queryVerifierContract = await queryVerifierFactory.deploy();

        const queryFactory = new ethers.ContractFactory(queryArtifacts.abi, queryArtifacts.bytecode, wallet);
        this.queryContract = await queryFactory.deploy();
        await this.queryContract.initialize(queryVerifierContract.address, this.stateContract.address);

        const issuerKey = BigInt(process.env.ISSUER_KEY || "123456789");
        const holderKey = BigInt(process.env.HOLDER_KEY || "987654321");

        const schema: SchemaDetails = {
            name: "Bob claim",
            slotNames: ["Name", "Age", "Country", "Gender", "ABC balance", "CDF borrow"],
            slotTypes: [SlotType.TEXT, SlotType.NUMBER, SlotType.TEXT, SlotType.TEXT, SlotType.NUMBER, SlotType.NUMBER]
        }
        var issuerId = await this.addIssuer(issuerKey, "Bob", schema);
        var holderId = await this.addHolder(holderKey, "Alice");

        this.addClaimRequest(issuerId as string, holderId as string, ["Alice", 30, "USA", "Female", 10000, 3000]);

        this.addVerifierQuery({
            verifierName: 'DAO',
            queryName: 'Age Restriction',
            queryId: v4(),
            typee: 0,
            slotIndex0: 3,
            slotIndex1: 0,
            attestingValue: 18n,
            operator: 2,
            setRoot: 0n,
            set: [],
            snmRoot: 0n,
            snm: [],
            challenge: 123n,
            schema: schema
        })

        this.addVerifierQuery({
            verifierName: 'Escrow service',
            queryName: 'Financial Security',
            queryId: v4(),
            typee: 1,
            slotIndex0: 6,
            slotIndex1: 7,
            attestingValue: 0n,
            operator: 2,
            setRoot: 0n,
            set: [],
            snmRoot: 0n,
            snm: [],
            challenge: 123n,
            schema: schema
        })

        this.addVerifierQuery({
            verifierName: 'DAO',
            queryName: 'Country Restriction',
            queryId: v4(),
            typee: 2,
            slotIndex0: 4,
            slotIndex1: 0,
            attestingValue: 0n,
            operator: 0,
            setRoot: 0n,
            set: ["USA", "Canada", "Mexico"],
            snmRoot: 0n,
            snm: [],
            challenge: 123n,
            schema: schema
        })

    }

    ////Issuer services 

    getIssuers() {
        try {
            return Array.from(this.issuerStates.values()).map(e => {
                return {
                    issuerId: e.issuerId,
                    name: e.name,
                    schema: e.schema
                }

            });
        } catch (error) {
            return error;
        }
    }

    getIssuer(issuerId: string) {
        try {
            var issuer = this.issuerStates.get(issuerId);
            if (issuer == null) {
                return "Invalid issuer";
            }
            return {
                issuerId: issuer.issuerId,
                name: issuer.name,
                schema: issuer.schema
            };
        } catch (error) {
            return error;
        }
    }

    getIssuerClaims(issuerId: string) {
        try {
            var claims: ClaimDetails[] = [];
            this.claimStates.forEach(claim => {
                if (claim.issuerId == issuerId) claims.push(claim);
            })
            return claims.map(claim => {
                return {
                    ...claim,
                    content: claim.content.allSlots
                }
            });
        } catch (error) {
            return error;
        }

    }

    getIssuerClaim(issuerId: string, claimId: string) {
        try {
            var claim = this.claimStates.get(claimId);
            if (claim != null) {
                return {
                    ...claim,
                    content: claim.content.allSlots
                }
            }
            return "No claim";

        } catch (error) {
            return error;
        }
    }

    issueClaim(issuerId: string, claimId: string) {
        try {
            var claim = this.claimStates.get(claimId);
            var issuer = this.issuerStates.get(issuerId);
            if (claim == null || issuer == null) {
                return "Invalid claim or invalid issuer"
            }

            claim.status = ClaimStatus.INOPERATIONQUEUE;
            var operation: IssueClaimOperation = { type: "issueClaim", claim: claim.content }
            issuer.operationQueue.push(operation);
            return "Success";
        } catch (error) {
            return error;
        }
    }

    rejectClaim(issuerId: string, claimId: string) {
        try {
            var claim = this.claimStates.get(claimId);
            var issuer = this.issuerStates.get(issuerId);
            if (claim == null || issuer == null) {
                return "Invalid claim or invalid issuer"
            }

            claim.status = ClaimStatus.REJECT;
            return "Success";
        } catch (error) {
            return error;
        }
    }

    async revokeClaim(issuerId: string, claimId: string) {
        try {
            var claim = this.claimStates.get(claimId);
            var issuer = this.issuerStates.get(issuerId);
            if (claim == null || issuer == null) {
                return "Invalid claim or invalid issuer"
            }

            claim.status = ClaimStatus.INOPERATIONQUEUE;
            var operation: RevokeClaimOperation = { type: "revokeClaim", claimHash: await claim.content.claimHash() }
            issuer.operationQueue.push(operation)
            return "Success";
        } catch (error) {
            return error;
        }
    }

    async getOperationQueue(issuerId: string) {
        try {
            var issuer = this.issuerStates.get(issuerId);
            if (issuer == null) {
                return "Invalid claim or invalid issuer"
            }

            return await Promise.all(issuer.operationQueue.map(async (e) => {
                if (e.type == "issueClaim") return {
                    type: e.type,
                    claimHash: await (e as IssueClaimOperation).claim.claimHash()
                }
                else return e
            }))
        } catch (error) {
            return error;
        }
    }

    async issuerStateTransition(issuerId: string) {
        try {
            const issuerDetails = this.issuerStates.get(issuerId);
            if (issuerDetails == null) {
                return ("Invalid issuerId");
            }
            else {
                var issuer = issuerDetails.entity;
                console.log(issuer.state())
                var operations = issuerDetails.operationQueue;
                var inputs = (await keyUtils.stateTransitionByEDDSASignature(
                    issuerDetails.privateKey,
                    issuer,
                    operations
                ));
                console.log(operations)
                const witness = new StateTransitionByEDDSASignatureWitnessBuilder(3)
                    .withStateTransitionByEDDSASignatureWitness(inputs)
                    .build();

                var proof = await generateProof(witness, CircuitName.STATE);

                await this.stateContract.transitState(BigInt(issuerId), issuerDetails.isGenesisState, proof.slicedProof, proof.publicInputs);

                operations.forEach(async (operation) => {
                    if (operation.type == "issueClaim") {
                        let claim = (operation as IssueClaimOperation).claim;
                        let claimId = issuerId + (await claim.claimHash());
                        this.claimStates.set(claimId, {
                            claimId,
                            issuerId: issuerId,
                            holderId: claim.subject.toString(),
                            content: claim,
                            status: ClaimStatus.ISSUED
                        })
                    }
                    else {
                        let claimHash = (operation as RevokeClaimOperation).claimHash;
                        let claimId = issuerId + claimHash
                        let claim = this.claimStates.get(claimId);
                        if (claim != null) {
                            claim.status = ClaimStatus.REVOKED;
                        }
                    }
                })

                issuerDetails.isGenesisState = false;

                issuerDetails.operationQueue = [];


                return "Success";
            }
        } catch (error) {
            return (error);
        }

    }


    async addIssuer(privateKey: BigInt, name: string, schema: SchemaDetails) {
        try {
            const publicKey = await keyUtils.getEDDSAPublicKeyFromPrivateKey(privateKey);
            var cryto = await CryptographyPrimitives.getInstance();
            var issuer = new Issuer(3, 3, cryto.poseidon);
            issuer.addAuth(publicKey.X, publicKey.Y, PublicKeyType.EDDSA);
            var issuerId = issuer.state().toString();

            this.issuerStates.set(issuerId, {
                privateKey,
                issuerId,
                name,
                entity: issuer,
                schema,
                operationQueue: [],
                isGenesisState: true
            });
            return issuerId;
        } catch (error) {
            return error;
        }
    }

    ////Holder services

    getHolderClaims(holderId: string) {
        try {
            var claims: ClaimDetails[] = [];

            this.claimStates.forEach(claim => {
                console.log(claim.holderId)
                if (claim.holderId == holderId) claims.push(claim)
            })

            return claims.map(claim => {
                return {
                    ...claim,
                    content: claim.content.allSlots
                }
            });
        } catch (error) {
            return error;
        }

    }

    getHolderClaim(holderId: string, claimId: string) {
        try {
            var claim = this.claimStates.get(claimId);
            if (claim != null) {
                return {
                    ...claim,
                    content: claim.content.allSlots
                };
            }
            return "No claim";

        } catch (error) {
            return error;
        }
    }

    getHolder(holderId: string) {
        try {
            var holder = this.holderStates.get(holderId);
            if (holder == null) {
                return "Invalid issuer";
            }
            return {
                holderId: holder.holderId,
                name: holder.name,
            };
        } catch (error) {
            return error;
        }
    }

    async addClaimRequest(issuerId: string, holderId: string, _slotValues: any[]) {
        try {
            const issuer = this.issuerStates.get(issuerId);


            if (issuer == null) {
                return ("invalid issuerId");
            }
            else {
                const slotTypes = issuer.schema.slotTypes;

                const slotValues = _slotValues.map((e, i) => {
                    if (slotTypes[i] == SlotType.NUMBER) return BigInt(e);
                    else return utf8StringToBigint(e);
                })

                console.log(slotValues)

                var claim = new ClaimBuilder()
                    .withSchemaHash(BigInt("93819749189437913473"))
                    .withExpirationTime(BigInt(Date.now() + 60 * 60 * 1000))
                    .withSequel(BigInt(1))
                    .withSubject(BigInt(holderId))
                    .withSlotValue(2, slotValues[0])
                    .withSlotValue(3, slotValues[1])
                    .withSlotValue(4, slotValues[2])
                    .withSlotValue(5, slotValues[3])
                    .withSlotValue(6, slotValues[4])
                    .withSlotValue(7, slotValues[5])
                    .build();
                let claimId = issuerId + (await claim.claimHash());

                this.claimStates.set(claimId, {
                    claimId,
                    issuerId: issuerId,
                    holderId: claim.subject.toString(),
                    content: claim,
                    status: ClaimStatus.PENDING
                })

                return "success";
            }

        } catch (error) {
            return error;
        }
    }

    async generateQueryProof(claimId: string, queryId: string) {
        try {
            const claimDetails = this.claimStates.get(claimId);
            const query = this.queries.get(queryId);
            if (claimDetails == null || query == null) {
                return "Invalid claimId or query";
            }

            const issuerDetails = this.issuerStates.get(claimDetails.issuerId);
            const holderDetails = this.holderStates.get(claimDetails.holderId);

            if (issuerDetails == null || holderDetails == null) {
                return "Invalid Claim";
            }

            const issuer = issuerDetails.entity;
            const holder = holderDetails.entity;
            const claim = claimDetails.content;

            var claimHash = await claim.claimHash();
            const cepWitness = await keyUtils.ClaimExistenceProof(issuer, claimHash);
            const cnpWitness = await keyUtils.ClaimNonRevocationProof(issuer, claimHash);
            const iopWitness = await keyUtils.idOwnershipByEDDSASignature(holderDetails.privateKey, holder, query.challenge);
            const validUntil = BigInt(Date.now() + 30 * 60 * 1000);

            const poseidon = (await CryptographyPrimitives.getInstance()).poseidon;
            const value = claim.getSlotValue(query.slotIndex0);

            var witness;
            if (query.typee == 0) {
                witness = new EDDSAClaimQueryWitnessBuilder(3, 3, 2)
                    .withClaimSlots(claim.allSlots)
                    .withEDDSAIopWitness(iopWitness)
                    .withCepWitness(cepWitness)
                    .withCnpWitness(cnpWitness)
                    .withAttestingValue(query.attestingValue)
                    .withOperator(query.operator)
                    .withQueryType(0)
                    .withSlotIndex0(query.slotIndex0)
                    .withSchemaHash(BigInt("93819749189437913473"))
                    .withSequel(1n)
                    .withSubject(BigInt(claimDetails.holderId))
                    .withValidUntil(validUntil)
                    .build()
            }
            else if (query.typee == 1) {
                witness = new EDDSAClaimQueryWitnessBuilder(3, 3, 2)
                    .withClaimSlots(claim.allSlots)
                    .withEDDSAIopWitness(iopWitness)
                    .withCepWitness(cepWitness)
                    .withCnpWitness(cnpWitness)
                    .withSlotIndex1(query.slotIndex1)
                    .withOperator(query.operator)
                    .withQueryType(1)
                    .withSlotIndex0(query.slotIndex0)
                    .withSchemaHash(BigInt("93819749189437913473"))
                    .withSequel(1n)
                    .withSubject(BigInt(claimDetails.holderId))
                    .withValidUntil(validUntil)
                    .build()
            }
            else if (query.typee == 2) {

                var set: BigInt[] = query.set.map(e => {
                    return BigInt(e);
                })

                var index = set.findIndex(e => (value == e));

                var mpWitness = await keyUtils.MembershipSetProof(2, poseidon, set, index);

                witness = new EDDSAClaimQueryWitnessBuilder(3, 3, 2)
                    .withClaimSlots(claim.allSlots)
                    .withEDDSAIopWitness(iopWitness)
                    .withCepWitness(cepWitness)
                    .withCnpWitness(cnpWitness)
                    .withMpWitness(mpWitness)
                    .withQueryType(2)
                    .withSlotIndex0(query.slotIndex0)
                    .withSchemaHash(BigInt("93819749189437913473"))
                    .withSequel(1n)
                    .withSubject(BigInt(claimDetails.holderId))
                    .withValidUntil(validUntil)
                    .build()
            }
            else {
                var snm: BigInt[] = query.snm.map(e => {
                    return BigInt(e);
                })
                var nmpWitness = await keyUtils.NonMembershipSetProof(2, poseidon, snm, value);
                witness = new EDDSAClaimQueryWitnessBuilder(3, 3, 2)
                    .withClaimSlots(claim.allSlots)
                    .withEDDSAIopWitness(iopWitness)
                    .withCepWitness(cepWitness)
                    .withCnpWitness(cnpWitness)
                    .withNmpWitness(nmpWitness)
                    .withQueryType(3)
                    .withSlotIndex0(query.slotIndex0)
                    .withSchemaHash(BigInt("93819749189437913473"))
                    .withSequel(1n)
                    .withSubject(BigInt(claimDetails.holderId))
                    .withValidUntil(validUntil)
                    .build()
            }

            var proof = await generateProof(witness, CircuitName.EDDSA_CLAIM_PRESENTATION);

            const uint8ArrayToBigInt = bitUtils.uint8ArrayToBigInt;

            const proofId = v4();
            var publicInputs = proof.publicInputs;

            this.proofStates.set(proofId, {
                content: proof,
                schemaHash: uint8ArrayToBigInt(publicInputs[4]),
                sequel: uint8ArrayToBigInt(publicInputs[6]),
                queryType: uint8ArrayToBigInt(publicInputs[8]),
                slotIndex0: uint8ArrayToBigInt(publicInputs[9]),
                slotIndex1: uint8ArrayToBigInt(publicInputs[10]),
                attestingValue: uint8ArrayToBigInt(publicInputs[11]),
                operator: uint8ArrayToBigInt(publicInputs[12]),
                setRoot: uint8ArrayToBigInt(publicInputs[13]),
                snmRoot: uint8ArrayToBigInt(publicInputs[14]),
                holderId: claimDetails.holderId,
                issuerId: claimDetails.issuerId,
                queryId,
                proofId,
                status: "pending"
            })

            return proof;
        } catch (error) {
            console.log(error)
            return error;
        }

    }

    async addHolder(privateKey: BigInt, name: string) {
        try {
            const publicKey = await keyUtils.getEDDSAPublicKeyFromPrivateKey(privateKey);
            var crypto = await CryptographyPrimitives.getInstance();
            var holder = new Holder(3, crypto.poseidon);
            holder.addAuth(publicKey.X, publicKey.Y, PublicKeyType.EDDSA);
            var holderId = holder.state().toString();
            this.holderStates.set(holderId, {
                privateKey,
                holderId,
                entity: holder,
                name
            });
            return holderId;
        } catch (error) {
            return error;
        }
    }



    // verifier service 

    addVerifierQuery(query: Query) {
        var slotType = query.schema.slotTypes[query.slotIndex0 - 2] || SlotType.NUMBER;

        if (slotType == SlotType.NUMBER) {
            this.queries.set(query.queryId, {
                ...query,
                set: query.set.map(e => BigInt(e)),
                snm: query.snm.map(e => BigInt(e))
            });
        }
        else {
            this.queries.set(query.queryId, {
                ...query,
                set: query.set.map(e => utf8StringToBigint(e)),
                snm: query.snm.map(e => utf8StringToBigint(e))
            });
            console.log(this.queries.get(query.queryId)?.set)
        }

        return query.queryId;
    }

    getVerifierQueries() {
        console.log(this.queries)
        return Array.from(this.queries.values());
    }

    getVerifierQuery(queryId: string) {
        try {
            var query = this.queries.get(queryId);
            if (query == null) return "Invalid queryId";
            return query;
        } catch (error) {
            return error;
        }

    }

    getProofs(queryId: string) {
        try {
            var proofs: any[] = [];
            this.proofStates.forEach(e => {
                if (e.queryId == queryId) proofs.push(e);
            })
            return proofs;
        } catch (error) {
            return error;
        }
    }

    getProof(proofId: string) {
        try {
            var proof = this.proofStates.get(proofId);
            if (proof == null) {
                return "Invalid proofId";
            }
            return proof;
        } catch (error) {
            return error;
        }
    }

    async verifyProof(proofId: string) {
        try {
            var proofDetails = this.proofStates.get(proofId);
            if (proofDetails == null) {
                return "Invalid proofId";
            }

            await this.queryContract.verify(proofDetails.holderId, proofDetails.issuerId, proofDetails.content.slicedProof, proofDetails.content.publicInputs);
            proofDetails.status = "success"
            return "Success";
        } catch (error) {
            return error;
        }
    }
}