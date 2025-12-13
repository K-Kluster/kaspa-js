import { Router, Request, Response } from "express";
import { kaspaRpcService } from "../services/kaspaRpcService.ts";

const router = Router();

/**
 * @swagger
 * /kaspa/daginfo:
 *   get:
 *     summary: Retrieve Kaspa Block DAG information
 *     tags:
 *       - Kaspa RPC
 *     responses:
 *       200:
 *         description: Successfully retrieved Block DAG information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 networkName:
 *                   type: string
 *                   example: mainnet
 *                 daaScore:
 *                   type: string
 *                   example: "1234567890"
 *                 blockCount:
 *                   type: string
 *                   example: "1000000"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve DAG info"
 */
router.get("/daginfo", async (req: Request, res: Response) => {
  try {
    if (!kaspaRpcService.isRpcConnected()) {
      return res
        .status(500)
        .json({ error: "Kaspa RPC client is not connected." });
    }
    const dagInfo = await kaspaRpcService.getBlockDagInfo();
    res.json(dagInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /kaspa/balances:
 *   post:
 *     summary: Retrieve Kaspa balances for given addresses
 *     tags:
 *       - Kaspa RPC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addresses
 *             properties:
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["kaspa:qpamkvhgh0kzx50gwvvp5xs8ktmqutcy3dfs9dc3w7lm9rq0zs76vf959mmrp"]
 *     responses:
 *       200:
 *         description: Successfully retrieved balances.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 # Define properties based on IGetBalancesByAddressesResponse if available
 *                 # For now, a generic example:
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       balance:
 *                         type: string
 *                         format: int64
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Addresses are required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve balances"
 */
router.post("/balances", async (req: Request, res: Response) => {
  try {
    if (!kaspaRpcService.isRpcConnected()) {
      return res
        .status(500)
        .json({ error: "Kaspa RPC client is not connected." });
    }
    const { addresses } = req.body;
    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: "Addresses array is required." });
    }
    const balances = await kaspaRpcService.getBalancesByAddresses(addresses);
    res.json(balances);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
