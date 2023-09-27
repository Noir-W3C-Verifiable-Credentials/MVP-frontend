var BigInt = window.BigInt;

export function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        const truncated = str.substring(0, maxLength / 2) + '...' + str.substring(str.length - maxLength / 2);
        return truncated;
    }
    return str;
}

export function bigintToUtf8String(bigintValue) {
    bigintValue = BigInt(bigintValue)
    // Convert the bigint to bytes
    const utf8Bytes = [];
    while (bigintValue > 0) {
        utf8Bytes.unshift(Number(bigintValue & BigInt(0xFF)));
        bigintValue >>= BigInt(8);
    }


    // Convert bytes to a UTF-8 string
    const utf8Decoder = new TextDecoder('utf-8');
    const utf8String = utf8Decoder.decode(new Uint8Array(utf8Bytes));

    return utf8String;
}

export function deepEqual(obj1, obj2) {
    // Kiểm tra kiểu dữ liệu của obj1 và obj2
    if (typeof obj1 !== typeof obj2) {
        return false;
    }

    // Kiểm tra kiểu dữ liệu cơ bản (primitive types)
    if (typeof obj1 !== 'object' || obj1 === null) {
        return obj1 === obj2;
    }

    // Kiểm tra số lượng thuộc tính của obj1 và obj2
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }

    // So sánh từng cặp thuộc tính bằng đệ quy
    for (const key of keys1) {
        if (!deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

export function QueryToSentence(query) {
    var slotIndex0 = query.schema.slotNames[query.slotIndex0 - 2];
    var slotIndex1 = query.schema.slotNames[query.slotIndex1 - 2];
    var schema = query.schema.slotTypes[query.slotIndex0 - 2]
    if (query.typee == 0) {
        if (query.operator == 0) return `${slotIndex0} is equal ${query.attestingValue}`;
        else if (query.operator == 1) return `${slotIndex0} is less than ${query.attestingValue}`;
        else return `${slotIndex0} is more than ${query.attestingValue}`;
    }
    else if (query.typee == 1) {
        if (query.operator == 0) return `${slotIndex0} is equal ${slotIndex1}`;
        else if (query.operator == 1) return `${slotIndex0} is less than ${slotIndex1}`;
        else return `${slotIndex0} is more than ${slotIndex1}`;
    }
    else if (query.typee == 2) {
        if (schema == 'number') return `${slotIndex0} is in set (${query.set.join(",")})`;
        else return `${slotIndex0} is in set (${query.set.map(e => bigintToUtf8String(e)).join(",")})`
    }
    else {
        if (schema == 'number') return `${slotIndex0} is in set (${query.snm.join(",")})`;
        else return `${slotIndex0} is not in set (${query.snm.map(e => bigintToUtf8String(e)).join(",")})`
    }
}