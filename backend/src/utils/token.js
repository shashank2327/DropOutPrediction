import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
    const payload = {id: userId}
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: "15m"}
    )
}

export const generateRefreshToken = (userId) => {
    const payload = {id: userId}
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "7d"}
    )
}