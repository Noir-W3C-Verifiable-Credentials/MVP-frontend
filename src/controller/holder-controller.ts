import { Request, Response } from "express";
import { Service, convertBigIntsToStrings } from "../services/index.js";

export class HolderController {
    service: Service;

    constructor(service: Service) {
        this.service = service;
        this.getHolder = this.getHolder.bind(this);
        this.addClaimRequest = this.addClaimRequest.bind(this);
        this.getClaim = this.getClaim.bind(this);
        this.getClaims = this.getClaims.bind(this);
        this.generateQueryProof = this.generateQueryProof.bind(this);
    }

    getHolder(req: Request, res: Response) {
        try {
            const { holderId } = req.params;
            var ans = this.service.getHolder(holderId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    getClaims(req: Request, res: Response) {
        try {
            const { holderId } = req.params;
            var ans = this.service.getHolderClaims(holderId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    getClaim(req: Request, res: Response) {
        try {
            const { holderId, claimHash } = req.params;
            var ans = this.service.getHolderClaim(holderId, claimHash);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    addClaimRequest(req: Request, res: Response) {
        try {
            const { holderId, issuerId } = req.params;
            const slotValues = req.body;
            var ans = this.service.addClaimRequest(issuerId, holderId, slotValues);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    async generateQueryProof(req: Request, res: Response) {
        try {
            const { claimId, queryId } = req.params;
            var ans = await this.service.generateQueryProof(claimId, queryId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
        }
    }
}