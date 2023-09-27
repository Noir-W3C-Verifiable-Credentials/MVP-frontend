import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { QueryToSentence, truncateString } from "../../utils";
import { getVerifierQueries } from "../../api/verifier";
import { UserContext, accounts } from "../../App";
import { queryByTestId } from "@testing-library/react";

function Verifier() {
    var navigate = useNavigate();
    var { accountIndex } = useContext(UserContext);
    var [queries, setQueries] = useState([]);

    useEffect(() => {
        const main = async () => {
            queries = await getVerifierQueries();
            setQueries(queries);

        }

        main()
    }, [])

    return <div>
        {queries.filter(query => accounts[accountIndex].name == query.verifierName).map((query, i) => <div className={`list pending`}>
            <div style={{ 'display': 'flex', 'align-items': 'center' }}>
                <div className='titleList'> Query: {query.queryName}</div>
                <div style={{ 'display': 'flex', 'margin-left': 'auto' }}>
                    <div className="backButton" style={{ 'margin-left': '10px' }}
                        onClick={() => { navigate(`./${query.queryId}/proof`) }}> Get Proofs </div>
                </div>

            </div>

            <div style={{
                'padding': '10px 20px',
                'display': 'flex',
                'flex-wrap': 'wrap'
            }}>
                {`Proof: ${QueryToSentence(query)}`}
            </div>
        </div>)}

    </div>


}

export default Verifier

