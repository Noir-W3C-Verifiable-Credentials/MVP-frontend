import axios from "axios";

import { hostUrl } from "../env";


const url = `${hostUrl}/issuer`;

export async function getIssuers() {
    try {
        var res = await axios.get(`${url}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getIssuer(issuerId) {
    try {
        var res = await axios.get(`${url}/${issuerId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getClaims(issuerId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/claim`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function getClaim(issuerId, claimId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/claim/${claimId}`, { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function issueClaim(issuerId, claimId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/claim/${claimId}/issue`, { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function revokeClaim(issuerId, claimId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/claim/${claimId}/revoke`, { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function rejectClaim(issuerId, claimId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/claim/${claimId}/reject`, { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getOperationQueue(issuerId) {
    try {
        var res = await axios.get(`${url}/${issuerId}/operationQueue`, { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function stateTransition(issuerId) {
    try {
        var res = await axios.post(`${url}/${issuerId}/operationQueue`, "", { timeout: 100000 });
        console.log(res)
        return res.data;
    } catch (error) {
        return error;
    }
}



