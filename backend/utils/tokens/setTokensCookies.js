const setTokensCookies = (res, accessToken, refreshToken) => {
  // Determine if connection is HTTPS (direct, via reverse proxy like Render, or in production)
  const isSecure =
    res.req?.secure ||
    res.req?.protocol === "https" ||
    res.req?.headers?.["x-forwarded-proto"] === "https" ||
    process.env.NODE_ENV === "production";

  // For cross-origin requests (e.g. Vercel frontend -> Render backend), SameSite must be 'none' when Secure is true.
  const sameSiteOption = isSecure ? "none" : "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSiteOption,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSiteOption,
  });

  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: isSecure,
    sameSite: sameSiteOption,
  });
};

export { setTokensCookies };