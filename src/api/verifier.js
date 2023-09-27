import axios from "axios";

import { hostUrl } from "../env";


const url = `${hostUrl}/verifier`;



export async function addVerifierQuery(query) {
    try {
        var res = await axios.post(`${url}`, query, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getVerifierQueries() {
    try {
        var res = await axios.get(`${url}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}


export async function getVerifierQuery(queryId) {
    try {
        var res = await axios.get(`${url}/${queryId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function getProofs(queryId) {
    try {
        var res = await axios.get(`${url}/${queryId}/proof`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function getProof(queryId, proofId) {
    try {
        var res = await axios.get(`${url}/${queryId}/proof/${proofId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

export async function verifyProof(queryId, proofId) {
    try {
        var res = await axios.post(`${url}/${queryId}/proof/${proofId}`, { timeout: 100000 });
        return res.data;
    } catch (error) {
        return error;
    }
}

