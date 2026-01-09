"""Kaspa API routes."""

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_client
from schemas import (
    BlockDagInfoResponse,
    BlockResponse,
    ErrorResponse,
)
from utils import KaspaClient

router = APIRouter()


@router.get(
    "/blockdag",
    response_model=BlockDagInfoResponse,
    summary="Get BlockDAG information",
    responses={500: {"model": ErrorResponse}},
)
async def get_blockdag_info(client: KaspaClient = Depends(get_client)):
    """
    Get current Kaspa BlockDAG information.

    Returns comprehensive information about the state of the BlockDAG including:
    - Network name and difficulty
    - Block and header counts
    - Current tip hashes
    - Virtual block information
    - Pruning point hash
    """
    try:
        return await client.get_blockdag_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/block/{block_hash}",
    response_model=BlockResponse,
    summary="Get block by hash",
    responses={
        400: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_block(block_hash: str, client: KaspaClient = Depends(get_client)):
    """
    Get block details by block hash.

    Returns the full block data including:
    - Block header (hash, version, parents, timestamp, etc.)
    - Transactions contained in the block
    - Blue score and DAA score

    Args:
        block_hash: The hash of the block to retrieve (64 character hex string)
    """
    try:
        block = await client.get_block_by_hash(block_hash)
        return BlockResponse(
            block_hash=block_hash,
            data=block,
        )
    except Exception as e:
        error_msg = str(e).lower()
        if "not found" in error_msg or "invalid" in error_msg:
            raise HTTPException(status_code=404, detail=f"Block not found: {block_hash}")
        raise HTTPException(status_code=400, detail=str(e))
