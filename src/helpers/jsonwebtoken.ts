import jwt, { JwtPayload } from "jsonwebtoken";

/**
 *
 * @param data
 * @param key
 * @returns
 */
const generateToken = (
  payload: string | number | Object | Buffer,
  key: string | Buffer
): string | Error => {
  try {
    const token = jwt.sign(
      {
        payload: payload,
      },
      key,
      {
        algorithm: "HS512",
        expiresIn: "1d",
      }
    );
    return token;
  } catch (error) {
    return new Error("Error al generar el token.");
  }
};

const verifyToken = (
  token: string,
  key: string | Buffer
): Error | any => {
  try {
    const tokenData = jwt.verify(token, key);
    return tokenData;
  } catch (error) {
    return new Error("Error al verificar el token.");
  }
};

export { generateToken, verifyToken };
