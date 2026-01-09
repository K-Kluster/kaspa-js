"""Kaspa client wrapper for the Python API."""

from __future__ import annotations

from core import get_settings
from kaspa import Resolver, RpcClient
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base model that accepts camelCase input."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class BlockDagInfo(CamelModel):
    """BlockDAG information container."""

    network: str
    block_count: int
    header_count: int
    tip_hashes: list[str]
    difficulty: float
    past_median_time: int
    virtual_parent_hashes: list[str]
    pruning_point_hash: str
    virtual_daa_score: int
    sink: str


class KaspaClient:
    """High-level Kaspa client for querying the network."""

    def __init__(self) -> None:
        """Initialize the Kaspa client."""
        self.settings = get_settings()
        self._rpc: RpcClient | None = None
        self._resolver: Resolver | None = None

    async def connect(self) -> None:
        """Connect to the Kaspa network."""
        if self._rpc is not None:
            return

        # Create resolver for the network
        self._resolver = None
        rpc_url = None

        # Get RPC URL from resolver or use configured URL
        if self.settings.kaspa_rpc_url:
            rpc_url = self.settings.kaspa_rpc_url
        else:
            self._resolver = Resolver()

        # Create and connect RPC client
        network_id = (
            "mainnet" if self.settings.kaspa_network == "mainnet" else "testnet-10"
        )
        self._rpc = RpcClient(
            resolver=self._resolver, url=rpc_url, network_id=network_id
        )
        await self._rpc.connect(strategy="fallback", timeout_duration=10_000)

    async def disconnect(self) -> None:
        """Disconnect from the Kaspa network."""
        if self._rpc is not None:
            await self._rpc.disconnect()
            self._rpc = None

    async def __aenter__(self) -> "KaspaClient":
        """Async context manager entry."""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        """Async context manager exit."""
        await self.disconnect()

    @property
    def rpc(self) -> RpcClient:
        """Get the RPC client, raising if not connected."""
        if self._rpc is None:
            raise RuntimeError(
                "Client not connected. Call connect() first or use async context manager."
            )
        return self._rpc

    async def get_blockdag_info(self) -> BlockDagInfo:
        """Get BlockDAG information."""
        info = await self.rpc.get_block_dag_info()
        return BlockDagInfo.model_validate(info)

    async def get_block_by_hash(self, block_hash: str) -> dict:
        """Get block details by hash."""
        response = await self.rpc.get_block(
            request={
                "hash": block_hash,
                "includeTransactions": True,
            }
        )
        return response
