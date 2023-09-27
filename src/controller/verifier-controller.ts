import { Request, Response } from "express";
import { Service, convertBigIntsToStrings } from "../services/index.js";

export class VerifierController {
    service: Service;

    constructor(service: Service) {
        this.service = service;

        this.addVerifierQuery = this.addVerifierQuery.bind(this);
        this.getVerifierQueries = this.getVerifierQueries.bind(this);
        this.getVerifierQuery = this.getVerifierQuery.bind(this);
        this.getProofs = this.getProofs.bind(this);
        this.getProof = this.getProof.bind(this);
        this.verifyProof = this.verifyProof.bind(this);
    }

    addVerifierQuery(req: Request, res: Response) {
        try {
            const { query } = req.body;
            var ans = this.service.addVerifierQuery(query);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    getVerifierQueries(req: Request, res: Response) {
        try {
            var ans = this.service.getVerifierQueries();
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }

    }

    getVerifierQuery(req: Request, res: Response) {
        try {
            const { queryId } = req.params;
            var ans = this.service.getVerifierQuery(queryId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    getProofs(req: Request, res: Response) {
        try {
            const { queryId } = req.params;
            var ans = this.service.getProofs(queryId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    getProof(req: Request, res: Response) {
        try {
            const { proofId } = req.params;
            var ans = this.service.getProof(proofId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

    async verifyProof(req: Request, res: Response) {
        try {
            const { proofId } = req.params;
            var ans = await this.service.verifyProof(proofId);
            res.send(convertBigIntsToStrings(ans));
        } catch (error) {
            res.send(error);
            console.log(error)
        }
    }

}