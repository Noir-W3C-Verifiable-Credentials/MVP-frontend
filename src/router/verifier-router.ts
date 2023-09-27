import { Router } from "express";
import { VerifierController } from "../controller/verifier-controller.js";
import { Service } from "src/services/index.js";

export class VerifierRouter {
    public router: Router;
    public verifierController: VerifierController;
    constructor(service: Service) {
        this.verifierController = new VerifierController(service);
        this.router = Router();
        this.routers();
    }

    routers(): void {
        this.router.post("/", this.verifierController.addVerifierQuery);
        this.router.get("/", this.verifierController.getVerifierQueries);
        this.router.get("/:queryId", this.verifierController.getVerifierQuery);
        this.router.get("/:queryId/proof", this.verifierController.getProofs);
        this.router.get("/:queryId/proof/:proofId", this.verifierController.getProof);
        this.router.post("/:queryId/proof/:proofId", this.verifierController.verifyProof);
    }
}
