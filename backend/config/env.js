const withoutTrailingSlash = (value) => value.replace(/\/+$/, "");

function requiredUrl(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be configured.`);

  try {
    return withoutTrailingSlash(new URL(value).toString());
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }
}

exports.clientUrl = () => requiredUrl("CLIENT_URL");
exports.backendUrl = () => requiredUrl("BACKEND_URL");
