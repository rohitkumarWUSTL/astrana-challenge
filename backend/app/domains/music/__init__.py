from app.domains.music import models  # noqa: F401  (register models with Base.metadata)
from app.domains.music.router import router

__all__ = ["router"]
