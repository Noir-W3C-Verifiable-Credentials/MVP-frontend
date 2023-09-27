import { useState } from "react";


function AsynButton({ onClick, children }) {
    var [loading, setLoading] = useState(false);

    return <div className="backButton" style={{ 'margin-left': '10px' }}
        onClick={async () => {
            if (loading == false) {
                setLoading(true);
                var status = await onClick();
                setLoading(false);
                if (typeof status != 'string') window.alert("success")
                else window.alert(status)
            }
        }}>
        {loading == true && <div>
            <i class="fa fa-refresh fa-spin" style={{ marginRight: '10px' }}></i>
            Running
        </div>}
        {loading == false && children}
    </div>
}

export default AsynButton;