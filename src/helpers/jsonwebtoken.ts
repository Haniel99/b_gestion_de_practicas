import jwt, { JwtPayload } from "jsonwebtoken";
const secretkeyjwt = process.env.SECRET_KEY_JWT || "";
/**
 *
 * @param data
 * @param key
 * @returns
 */
const generateToken = (payload: string | number | Object | Buffer) => {
  const token = jwt.sign(
    {
      payload: payload,
    },
    secretkeyjwt,
    {
      algorithm: "HS512",
      expiresIn: "7d",
    }
  );
  return token;
};

const verifyToken = (token: string, key: string | Buffer) => {
  const tokenData = jwt.verify(token, key);
  return tokenData;
};

export { generateToken, verifyToken };
