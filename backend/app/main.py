from fastapi import FastAPI, APIRouter
from sqlmodel import SQLModel

from .routers import user, transaction, ledger
from .core.db import engine
from .models import user as user_models
from .models import transaction as transaction_models
from .models import ledger as ledger_models

app = FastAPI()

# 在应用启动时创建所有表
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# 创建API路由组，添加 /api 前缀
api_router = APIRouter(prefix="/api")

# 将所有路由添加到API路由组
api_router.include_router(user.router)
api_router.include_router(transaction.router)
api_router.include_router(ledger.router)

# 将API路由组添加到应用
app.include_router(api_router)
