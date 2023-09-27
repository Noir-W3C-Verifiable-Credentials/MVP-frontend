import { useContext, useEffect, useState } from "react";
import { UserContext, accounts } from "./App";
import { useNavigate } from "react-router-dom";

const links = [
    ["Claim", "Operation Queue"],
    ["Claim Info", "Request Claim", "Present Claims"],
    ["Query"]
]

const subUrl = [
    ["claim", "operationQueue"],
    ["claim", "issuer", "verifier"],
    [""]
]
function Nav() {
    var { accountIndex } = useContext(UserContext);
    var account = accounts[accountIndex];
    var [index0, setIndex0] = useState(0);
    var [index1, setIndex1] = useState(0);
    var navigate = useNavigate();

    useEffect(() => {

        if (account.type == "Issuer") setIndex0(0);
        else if (account.type == "Holder") setIndex0(1);
        else setIndex0(2);
        setIndex1(-1);
    }, [accountIndex]);

    useEffect(() => {
        var preUrl = "";
        if (index0 == 1) preUrl = `holder/${account.holderId}`;
        else if (index0 == 0) preUrl = `issuer/${account.issuerId}`;
        else preUrl = "verifier";

        if (index1 < 0) navigate(`${preUrl}/${subUrl[index0][0]}`);
        else navigate(`../${preUrl}/${subUrl[index0][index1]}`)
    }, [index0, index1]);


    return <div style={{
        'flex': '0 0 170px',
        'background-color': '#373f51',
        'border-right': '1px solid #ccc',
        'padding-top': '5px'
    }}>
        {links[index0].map((e, i) => {
            if (i != Math.max(index1, 0)) return <div className='portal' onClick={() => { setIndex1(i); }}>{e}</div>
            else return <div className='portalCurrent' onClick={() => { setIndex1(i); }}>{e}</div>
        })}
    </div>
}

export default Nav;