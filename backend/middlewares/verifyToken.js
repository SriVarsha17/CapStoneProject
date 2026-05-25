import jwt from 'jsonwebtoken';

function buildMiddleware(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            // Try to get token from cookies first, then from Authorization header
            let signedToken = req.cookies?.token;
            
            if (!signedToken) {
                // Check for Authorization: Bearer <token> header
                const authHeader = req.headers.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    signedToken = authHeader.substring(7);
                }
            }
            
            if (!signedToken) {
                return res.status(401).json({ message: "unauthorized request.please login first" });
            }

            const decodedToken = jwt.verify(signedToken, process.env.JWT_SECRET);

            if (allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Forbidden.you dont have acces to this article" });
            }

            req.user = decodedToken;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "session expired" });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "invalid token.please check" });
            }
            next(err);
        }
    };
}

export const verifyToken = (...allowedRoles) => {
    // Supports both usages:
    // 1) verifyToken('author') as a middleware factory
    // 2) verifyToken directly as middleware (falls back to no role restriction)
    if (
        allowedRoles.length === 3 &&
        typeof allowedRoles[0] === 'object' &&
        typeof allowedRoles[1] === 'object' &&
        typeof allowedRoles[2] === 'function'
    ) {
        return buildMiddleware()(allowedRoles[0], allowedRoles[1], allowedRoles[2]);
    }

    return buildMiddleware(allowedRoles);
};