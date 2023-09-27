import { Request, Response } from "express";
import { Service, convertBigIntsToStrings } from "../services/index.js";

export class IssuerController {
    service: Service;

    constructor(service: Service) {
        this.service = service;

        this.getIssuer = this.getIssuer.bind(this);
        this.getIssuers = this.getIssuers.bind(this);
        this.deleteClaimRequest = this.deleteClaimRequest.bind(this);
        this.getClaim = this.getClaim.bind(this);
        this.getClaims = this.getClaims.bind(this);
        this.issueClaim = this.issueClaim.bind(this);
        this.revokeClaim = this.revokeClaim.bind(this);
        this.stateTransition = this.stateTransition.bind(this);
        this.getOperationQueue = this.getOperationQueue.bind(this);
    }

    getIssuers(req: Request, res: Response) {
        try {
            var ans = this.service.getIssuers();
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    getIssuer(req: Request, res: Response) {
        try {
            const { issuerId } = req.params;
            var ans = this.service.getIssuer(issuerId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    getClaims(req: Request, res: Response) {
        try {
            const { issuerId } = req.params;
            var ans = this.service.getIssuerClaims(issuerId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    getClaim(req: Request, res: Response) {
        try {
            const { issuerId, claimId } = req.params;
            var ans = this.service.getIssuerClaim(issuerId, claimId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    deleteClaimRequest(req: Request, res: Response) {
        try {
            const { issuerId, claimId } = req.params;
            var ans = this.service.rejectClaim(issuerId, claimId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }

    }

    async getOperationQueue(req: Request, res: Response) {
        try {
            const { issuerId } = req.params;
            var ans = await this.service.getOperationQueue(issuerId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }
    }

    async stateTransition(req: Request, res: Response) {
        try {
            const { issuerId } = req.params;
            var ans = await this.service.issuerStateTransition(issuerId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }

    }

    revokeClaim(req: Request, res: Response) {
        try {
            const { issuerId, claimId } = req.params;
            var ans = this.service.revokeClaim(issuerId, claimId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }
    }

    issueClaim(req: Request, res: Response) {
        try {
            const { issuerId, claimId } = req.params;
            var ans = this.service.issueClaim(issuerId, claimId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }
    }


}