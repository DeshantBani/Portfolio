"""
Simple auth for admin: Bearer token must match ADMIN_SECRET env var.
"""
import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader

security = HTTPBearer(auto_error=False)
api_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)


def verify_admin_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
    api_key: str = Security(api_key_header),
) -> bool:
    secret = os.environ.get("ADMIN_SECRET", "change-me-in-production")
    token = None
    if credentials and credentials.scheme == "Bearer":
        token = credentials.credentials
    if api_key:
        token = api_key
    if not token or token != secret:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")
    return True
