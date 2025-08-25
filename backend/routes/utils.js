const userService = require('../service/userService');

async function tokenDecode(req){
    try{
        const authHeader = req.headers["authorization"]; 
                if (!authHeader) {
                    throw new Error
                    ('heder missing...');
                }
        
                const token = authHeader.split(" ")[1];
        
                return decoded = userService.verifyToken(token);

    }catch(error){
        console.log('error', error);
        return null;
    }
}

module.exports = tokenDecode;