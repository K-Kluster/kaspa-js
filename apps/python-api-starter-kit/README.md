# Kaspa Python API Starter Kit

A REST API server for querying the Kaspa blockchain.

## Quick Start

### Prerequisites

- Python 3.10 or higher
- pip

### Installation

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

Key configuration options:

| Variable        | Description               | Default         |
| --------------- | ------------------------- | --------------- |
| `KASPA_NETWORK` | Network (mainnet/testnet) | mainnet         |
| `KASPA_RPC_URL` | Custom RPC endpoint       | (auto-detected) |
| `LOG_LEVEL`     | Logging level             | INFO            |
| `API_HOST`      | Server host               | 0.0.0.0         |
| `API_PORT`      | Server port               | 8000            |

## Usage

### Starting the Server

```bash
# Development mode with auto-reload
fastapi dev main.py

# Production mode
fastapi run main.py --host 0.0.0.0 --port 8000
```

### API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### API Endpoints

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/blockdag`           | Get BlockDAG information |
| GET    | `/api/block/{block_hash}` | Get block by hash        |
| GET    | `/health`                 | Health check             |
