import { startTransition, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { getClaims, getIssuer, getOperationQueue, issueClaim, rejectClaim, revokeClaim, stateTransition } from "../../api/issuer";
import { bigintToUtf8String, truncateString } from "../../utils";
import AsynButton from "../../components/asyncButton";

function IssuerOperationQueue() {

    var { issuerId } = useParams();
    var [operations, setOperations] = useState([]);
    var [cnt, setCnt] = useState(0);

    useEffect(() => {
        const main = async () => {
            operations = await getOperationQueue(issuerId);
            setOperations(operations);
            console.log(operations);
        }
        main()
    }, [cnt])

    return <div>
        <div style={{ 'display': 'flex', 'align-items': 'center' }}>
            <div className='titleList'> Operation Queue</div>
            <AsynButton
                onClick={async () => { await stateTransition(issuerId); setCnt(cnt + 1) }}> Update to the blockchain </AsynButton>
        </div>

        {operations.map(e => <div className={`list pending`}>

            <div style={{ 'display': 'flex' }}>
                <div>Type: </div>
                <div style={{ 'font-weight': 'bold' }}>{e.type}</div>
            </div>

            <div style={{ 'display': 'flex' }}>
                <div>Claim Hash: </div>
                <div style={{ 'font-weight': 'bold' }}>{e.claimHash}</div>
            </div>
        </div>)}

    </div>
}

export default IssuerOperationQueue;