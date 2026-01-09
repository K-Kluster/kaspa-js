"""Kaspa-specific response schemas."""

from pydantic import BaseModel, Field


class BlockDagInfoResponse(BaseModel):
    """Response schema for BlockDAG information."""

    network: str = Field(..., description="Name of the Kaspa network")
    block_count: int = Field(..., description="Total number of blocks in the DAG")
    header_count: int = Field(..., description="Total number of block headers")
    tip_hashes: list[str] = Field(..., description="Hashes of the current DAG tips")
    difficulty: float = Field(..., description="Current network difficulty")
    past_median_time: int = Field(..., description="Median time of past blocks")
    virtual_parent_hashes: list[str] = Field(..., description="Parent hashes of the virtual block")
    pruning_point_hash: str = Field(..., description="Hash of the pruning point")
    virtual_daa_score: int = Field(..., description="DAA score of the virtual block")
    sink: str = Field(..., description="The sink block hash")


class BlockResponse(BaseModel):
    """Response schema for block queries."""

    block_hash: str = Field(..., description="Block hash")
    data: dict = Field(..., description="Full block data")

