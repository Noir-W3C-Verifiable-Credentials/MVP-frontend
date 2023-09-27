import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { addClaimRequest, getClaims } from "../../api/holder";
import { bigintToUtf8String, truncateString } from "../../utils";
import { getIssuer, getIssuers } from "../../api/issuer";
import AsynButton from "../../components/asyncButton";

function HolderService() {
    var { holderId } = useParams();
    var [issuers, setIssuers] = useState([]);
    var [slotValues, setSlotValues] = useState([]);
    useEffect(() => {
        const main = async () => {
            issuers = await getIssuers();
            slotValues = issuers.map(e => ["", "", "", "", "", ""]);
            setSlotValues(slotValues)
            setIssuers(issuers)
        }

        main()
    }, [])

    return <div>
        {issuers.map((issuer, i) => <div className={`list pending`}>
            <div style={{ 'display': 'flex', 'align-items': 'center' }}>
                <div className='titleList'> Issuer: {issuer.name}</div>
                <AsynButton
                    onClick={async () => { await addClaimRequest(holderId, issuer.issuerId, slotValues[i]); }}> Request Claim </AsynButton>
            </div>

            <div style={{
                'padding': '10px 20px',
                'display': 'flex',
                'flex-wrap': 'wrap'
            }}>
                {issuer.schema.slotNames.map((f, j) => <div style={{
                    "flex": "0 0 calc(50% - 10px)",
                    'margin': '5px',
                    'display': 'flex',
                    'flex-wrap': 'wrap',
                }}>
                    <div style={{ "flex": "0 0 calc(20%)" }}>{f}:</div>
                    <input style={{
                        'flex-grow': '1',
                        'margin-right': '20%'
                    }} type={issuer.schema.slotTypes[j]} onChange={(e) => { slotValues[i][j] = e.target.value }} />
                </div>)}
            </div>
        </div>)}

    </div>


}

export default HolderService

