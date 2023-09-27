import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { QueryToSentence, truncateString } from "../../utils";
import { getProofs, getVerifierQueries, getVerifierQuery, verifyProof } from "../../api/verifier";
import AsynButton from "../../components/asyncButton";
import { getHolder } from "../../api/holder";
import { getIssuer } from "../../api/issuer";

const queryTypes = ["compare single value", "compare double value", "in set", "not in set"]

function Proof() {
    var { queryId } = useParams();
    var navigate = useNavigate();
    var [proofs, setProofs] = useState([]);
    var [cnt, setCnt] = useState(0);
    var [query, setQuery] = useState("");
    useEffect(() => {
        const main = async () => {
            query = QueryToSentence(await getVerifierQuery(queryId));

            setQuery(query);
            proofs = await getProofs(queryId);
            proofs = await Promise.all(proofs.map(async (proof) => {
                var holderId = proof.holderId;
                var holder = await getHolder(holderId);
                var issuerId = proof.issuerId;
                var issuer = await getIssuer(issuerId);
                proof.holderName = holder.name;
                proof.issuerName = issuer.name;
                return proof;
            }))
            console.log(query)
            setProofs(proofs);
        }

        main()
    }, [cnt])

    return <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='titleList'> Query: {query}</div>
            <div className="backButton" style={{ 'margin-left': '10px' }}
                onClick={async () => { navigate(-1) }}> Back </div>
        </div>


        {proofs.map((proof, i) => <div className={`list pending`}>
            <div style={{ 'display': 'flex', 'align-items': 'center' }}>
                <div className='titleList'> Proof: {query.queryName}</div>
                <div style={{ 'display': 'flex', 'margin-left': '20px' }}>
                    <AsynButton
                        onClick={async () => { await verifyProof(queryId, proof.proofId); setCnt(cnt + 1) }}> Verify </AsynButton>
                </div>
                <div style={{ marginLeft: 'auto' }}>{proof.status}</div>
            </div>

            <div style={{
                'padding': '10px 20px',

            }}>
                <div>{`Holder: ${(proof.holderName)}`}</div>
                <div>{`Issuer: ${(proof.issuerName)}`}</div>
                <div>{`Query: ${query}`}</div>


            </div>
        </div>)}

    </div>


}

export default Proof

