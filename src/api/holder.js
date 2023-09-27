import axios from "axios";
import { hostUrl } from "../env";


const url = `${hostUrl}/holder`;

export async function getHolder(holderId) {
    try {
        var res = await axios.get(`${url}/${holderId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getClaims(holderId) {
    try {
        var res = await axios.get(`${url}/${holderId}/claim`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function getClaim(holderId, claimId) {
    try {
        var res = await axios.get(`${url}/${holderId}/claim/${claimId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function addClaimRequest(holderId, issuerId, slotValues) {
    try {
        console.log(slotValues)
        var res = await axios.post(`${url}/${holderId}/issuer/${issuerId}/claim`, slotValues, { timeout: 100000 });
        console.log(res.data)
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function generateQueryProof(holderId, claimId, queryId) {
    try {
        var res = await axios.get(`${url}/${holderId}/claim/${claimId}/query/${queryId}/proof`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

