function parseHttpRequest(raw) {
    const [headerPart, body = ''] = raw.split(/\r?\n\r?\n/);
    const headerLines = headerPart.split(/\r?\n/);
    const [method, path, version] = headerLines[0].split(' ');

    const headers = {};
    for (let i = 1; i < headerLines.length; i++) {
        const [key, ...valueParts] = headerLines[i].split(':');
        headers[key.trim()] = valueParts.join(':').trim();
    }

    return { method, path, version, headers, body };
}

document.getElementById("floatingTextarea2").addEventListener("input", function (event) {
    const isEmpty = this.value.trim() === "";
    document.getElementById("httpsCheckbox").disabled = isEmpty;
    gCommand()
});
document.getElementById("httpsCheckbox").addEventListener("input", function (event) {
    gCommand()
});

function gCommand() {
    let ffufHeaders = ''
    const reqString = document.getElementById('floatingTextarea2').value
    const req = parseHttpRequest(reqString)
    const ffufBody = req.body ? `-d "${req.body.replace(/"/g, '\\"')}"` : ''
    for (let key in req.headers) {
        ffufHeaders += `-H "${key}: ${req.headers[key]}" `
    }
    document.getElementById('code-block').innerText =
    `ffuf -u ${document.getElementById("httpsCheckbox").checked ? 'https://' : 'http://'}${req.headers.Host}${req.path} -X ${req.method} ${ffufHeaders.trim()} ${ffufBody}`
}

function copyCode(button) {
    const code = button.parentElement.querySelector("code").innerText;
    navigator.clipboard.writeText(code).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => button.innerText = "Copy", 2000);
    });
}