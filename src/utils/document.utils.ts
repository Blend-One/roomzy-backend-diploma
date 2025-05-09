export function xmlToBase64(xmlString: string) {
    const utf8Bytes = new TextEncoder().encode(xmlString);
    const binaryString = Array.from(utf8Bytes)
        .map(byte => String.fromCharCode(byte))
        .join('');
    return btoa(binaryString);
}

export function base64ToArrayBuffer(base64: string) {
    return Buffer.from(base64, 'base64');
}
