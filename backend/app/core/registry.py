import importlib
import pkgutil
from pathlib import Path

from fastapi import APIRouter

DOMAINS_PKG = "app.domains"
_domains_dir = Path(__file__).resolve().parent.parent / "domains"


def discover_domains() -> None:
    """Import every domain package so models register and routers are available."""
    if not _domains_dir.exists():
        return
    for mod in pkgutil.iter_modules([str(_domains_dir)]):
        if mod.ispkg:
            importlib.import_module(f"{DOMAINS_PKG}.{mod.name}")


def build_router() -> APIRouter:
    root = APIRouter(prefix="/api")
    if not _domains_dir.exists():
        return root
    for mod in pkgutil.iter_modules([str(_domains_dir)]):
        if not mod.ispkg:
            continue
        pkg = importlib.import_module(f"{DOMAINS_PKG}.{mod.name}")
        router = getattr(pkg, "router", None)
        if router is not None:
            root.include_router(router, prefix=f"/{mod.name}", tags=[mod.name])
    return root
