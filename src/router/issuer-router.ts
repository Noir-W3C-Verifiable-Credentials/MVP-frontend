import { Router } from "express";
import { IssuerController } from "../controller/issuer-controller.js";
import { Service } from "src/services/index.js";

export class IssuerRouter {
    public router: Router;
    public issuerController: IssuerController;
    constructor(service: Service) {
        this.issuerController = new IssuerController(service)
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.get("/", this.issuerController.getIssuers);
        this.router.get("/:issuerId", this.issuerController.getIssuer);
        this.router.get("/:issuerId/claim", this.issuerController.getClaims);
        this.router.get("/:issuerId/claim/:claimId", this.issuerController.getClaim);
        this.router.get("/:issuerId/claim/:claimId/issue", this.issuerController.issueClaim);
        this.router.get("/:issuerId/claim/:claimId/revoke", this.issuerController.revokeClaim);
        this.router.get("/:issuerId/claim/:claimId/reject", this.issuerController.deleteClaimRequest);
        this.router.get("/:issuerId/operationQueue", this.issuerController.getOperationQueue);
        this.router.post("/:issuerId/operationQueue", this.issuerController.stateTransition);
    }
}
