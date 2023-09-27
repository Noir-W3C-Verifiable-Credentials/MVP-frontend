import { Router } from "express";
import { HolderController } from "../controller/holder-controller.js";
import { Service } from "src/services/index.js";

export class HolderRouter {
    public router: Router;
    public holderController: HolderController;
    constructor(service: Service) {
        this.holderController = new HolderController(service);
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.get("/:holderId", this.holderController.getHolder)
        this.router.post("/:holderId/issuer/:issuerId/claim", this.holderController.addClaimRequest);
        this.router.get("/:holderId/claim", this.holderController.getClaims);
        this.router.get("/:holderId/claim/:claimId", this.holderController.getClaim);
        this.router.get("/:holderId/claim/:claimId/query/:queryId/proof", this.holderController.generateQueryProof);
    }
}
