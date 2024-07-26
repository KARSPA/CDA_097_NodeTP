
const bcrypt = require('bcrypt');

async function setUsers() {
    return Promise.all([
        bcrypt.hash("12345", 10),
        bcrypt.hash("abcde", 10),
        bcrypt.hash("abc123", 10)
    ]).then(([gilbertPsw, michelPsw, apollonPsw]) => {
        return [
            { username: "gilbertBG", password: gilbertPsw },
            { username: "micheldu47", password: michelPsw },
            { username: "apollon", password: apollonPsw }
        ];
    });
}


module.exports = setUsers();