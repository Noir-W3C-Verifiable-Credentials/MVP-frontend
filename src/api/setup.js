import axios from "axios";

const url = "http://localhost:8000";

export async function setup() {
    try {
        var res = await axios.get(url);
        console.log(res);
    } catch (error) {
        console.log(error)
    }
}