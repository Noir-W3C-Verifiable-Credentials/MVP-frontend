import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { addClaimRequest, generateQueryProof, getClaims } from "../../api/holder";
import { QueryToSentence, bigintToUtf8String, deepEqual, truncateString } from "../../utils";
import { getIssuer, getIssuers } from "../../api/issuer";
import { getVerifierQueries } from "../../api/verifier";
import AsynButton from "../../components/asyncButton";

function HolderVerify() {
    var { holderId } = useParams();
    var [queries, setQueries] = useState([]);
    var [claims, setClaims] = useState([]);
    var [claimIds, setClaimIds] = useState([]);

    useEffect(() => {
        const main = async () => {
            queries = await getVerifierQueries();
            claims = (await getClaims(holderId)).filter(e => e.status == 'issued');
            var issuers = await Promise.all(claims.map(async (claim) => {
                var issuer = await getIssuer(claim.issuerId);
                return issuer
            }))
            console.log(issuers)
            setClaims(claims.map((e, i) => {
                console.log(issuers[i].schema)
                return {
                    claimId: e.claimId,
                    schema: issuers[i].schema,
                    issuer: issuers[i].name,
                    status: e.status
                }
            }));

            setClaimIds(queries.map(e => ""))
            setQueries(queries);
            console.log(claims)
        }

        main()
    }, [])

    return <div>
        {queries.map((query, i) => <div className={`list pending`}>
            <div style={{ 'display': 'flex', 'align-items': 'center' }}>
                <div className='titleList'> Query: {(query.queryName)}</div>
                <div style={{ display: 'flex', 'margin-left': 'auto' }}>
                    {claimIds[i] != "" && <AsynButton
                        onClick={async () => { await generateQueryProof(holderId, claimIds[i], query.queryId); }}> Generate Proof </AsynButton>}
                    <select onChange={(e) => { claimIds[i] = e.target.value; console.log(claimIds[i]); setClaimIds(claimIds.map(e => e)) }} style={{ borderRadius: '5px', width: '120px', marginLeft: '10px' }}>
                        <option value="" disabled selected hidden>Select Claim</option>
                        {claims.filter(claim => deepEqual(claim.schema, query.schema) && claim.status == 'issued').map(claim =>
                            <option value={claim.claimId}>
                                {`${claim.schema.name}`}
                            </option>)}
                    </select>

                </div>

            </div>

            <div style={{
                'padding': '10px 20px',
            }}>
                <div>{`Verifier name: ${query.verifierName}`}</div>
                <div>{`Requirement: ${QueryToSentence(query)}`}</div>
            </div>
        </div>)}

    </div>


}

export default HolderVerify

