import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { getClaims } from "../../api/holder";
import { bigintToUtf8String, truncateString } from "../../utils";
import { getIssuer } from "../../api/issuer";

function HolderClaim() {
    var { holderId } = useParams();
    var [claims, setClaims] = useState([]);
    var [schemas, setSchemas] = useState([]);
    var [cnt, setCnt] = useState(0)

    useEffect(() => {
        const main = async () => {
            var claims = await getClaims(holderId);
            var schemas = await Promise.all(claims.map(async (claim) => {
                var issuer = await getIssuer(claim.issuerId);
                return issuer.schema
            }))
            setClaims(claims);
            setSchemas(schemas);
        }

        main()
    }, [cnt])

    return claims.length > 0 ? <div>
        {claims.map((claim, i) => <div className={`list pending`}>
            <div style={{ 'display': 'flex', 'align-items': 'center' }}>
                <div className='titleList'> Claim: {truncateString(claim.claimId, 20)}</div>
                <div style={{ 'margin-left': 'auto', "font-weight": "bold" }}>{claim.status}</div>
            </div>

            <div style={{
                'padding': '10px 20px',
                'display': 'flex',
                'flex-wrap': 'wrap'
            }}>
                {schemas[i].slotNames.map((f, j) => <div style={{
                    "flex": "0 0 calc(50% - 10px)",
                    'margin': '5px',
                    'display': 'flex',
                    'flex-wrap': 'wrap',
                }}>
                    <div style={{ "flex": "0 0 calc(20%)" }}>{f}:</div>
                    {schemas[i].slotTypes[j] == 'text' && <div style={{ "font-weight": "bold" }}> {bigintToUtf8String(claim.content[j + 2])} </div>}
                    {schemas[i].slotTypes[j] == 'number' && <div style={{ "font-weight": "bold" }}> {truncateString(claim.content[j + 2], 10)} </div>}
                </div>)}
            </div>
        </div>)}

    </div> : <p>Currently you hold no claim, go to the request page to create some.</p>


}

export default HolderClaim

