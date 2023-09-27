import { useContext, useState } from "react";
import "./index.css"
import { accounts, UserContext } from "./App";

function Header() {
    var [open, setOpen] = useState(false);
    var { accountIndex, setAccountIndex } = useContext(UserContext);

    return (
        <div style={{
            'height': '80px',
            'border-bottom': '1px solid #ccc',
            'padding': '0px 50px',
            'display': 'flex',
            'align-items': 'center'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '30px' }}>Privacy Verifiable Credentials</div>

            <div style={{ marginLeft: 'auto' }}>
                <div className="accountButton" onClick={() => { if (open) setOpen(false); else setOpen(true) }}>
                    <div style={{
                        'margin-left': '10px',
                    }} >
                        <strong>{accounts[accountIndex].type}:</strong> {accounts[accountIndex].name}
                    </div>


                </div>
                {open && <div style={{
                    "position": 'absolute',
                    "right": '50px',
                    "z-index": "1",
                    "background-color": "#E7EEEE",
                    'margin-top': '5px',
                    "border-radius": "5px",
                    'width': '180px',
                    'border': '1px solid #2D4141',
                    'padding': '5px 0px'
                }}>
                    {accounts.map((e, i) =>
                        <div className="accountOption" onClick={() => { setOpen(false); setAccountIndex(i); }}>
                            <strong>{e.type}: </strong>{e.name}
                        </div>)}

                </div>}

            </div>



        </div >
    );
}

export default Header;
