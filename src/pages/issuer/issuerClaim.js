import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getClaims,
  getIssuer,
  getOperationQueue,
  issueClaim,
  rejectClaim,
  revokeClaim,
} from "../../api/issuer";
import { bigintToUtf8String, truncateString } from "../../utils";
import AsynButton from "../../components/asyncButton";

function IssuerClaim() {
  var { issuerId } = useParams();
  var [claims, setClaims] = useState([]);
  var [schema, setSchema] = useState({});
  var [cnt, setCnt] = useState(0);

  useEffect(() => {
    const main = async () => {
      var issuer = await getIssuer(issuerId);
      var schema = issuer.schema;
      var claims = await getClaims(issuerId);
      setClaims(claims);
      setSchema(schema);
    };

    main();
  }, [cnt]);

  return (
    <div>
      {claims.map((claim) => (
        <div className={`list pending`}>
          <div style={{ display: "flex", "align-items": "center" }}>
            <div className="titleList"> Claim: {schema.name}</div>
            {claim.status == "pending" && (
              <AsynButton
                onClick={async () => {
                  await issueClaim(issuerId, claim.claimId);
                  setCnt(cnt + 1);
                }}
                msg={"Successfully issued claim"}
              >
                {" "}
                Issue Claim{" "}
              </AsynButton>
            )}
            {claim.status == "pending" && (
              <AsynButton
                msg={"Claim rejected"}
                onClick={async () => {
                  await rejectClaim(issuerId, claim.claimId);
                  setCnt(cnt + 1);
                }}
              >
                {" "}
                Reject Claim{" "}
              </AsynButton>
            )}
            {claim.status == "issued" && (
              <AsynButton
                msg={"Claim revoked"}
                onClick={async () => {
                  await revokeClaim(issuerId, claim.claimId);
                  setCnt(cnt + 1);
                }}
              >
                {" "}
                Revoke Claim{" "}
              </AsynButton>
            )}
            <div style={{ "margin-left": "auto", "font-weight": "bold" }}>
              {claim.status}
            </div>
          </div>

          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              "flex-wrap": "wrap",
            }}
          >
            {schema.slotNames.map((f, j) => (
              <div
                style={{
                  flex: "0 0 calc(50% - 10px)",
                  margin: "5px",
                  display: "flex",
                  "flex-wrap": "wrap",
                }}
              >
                <div style={{ flex: "0 0 calc(20%)" }}>{f}:</div>
                {schema.slotTypes[j] == "text" && (
                  <div style={{ "font-weight": "bold" }}>
                    {" "}
                    {bigintToUtf8String(claim.content[j + 2])}{" "}
                  </div>
                )}
                {schema.slotTypes[j] == "number" && (
                  <div style={{ "font-weight": "bold" }}>
                    {" "}
                    {truncateString(claim.content[j + 2], 10)}{" "}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IssuerClaim;
