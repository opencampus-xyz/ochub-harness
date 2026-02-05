# @opencampus/ochub-harness

A test harness for developing and testing OCID-authenticated mini apps. This tool provides a local development environment that use the Open Campus Hub authentication flow, allowing you to test your mini app's integration with OCID Connect without deploying to production.

## Usage

```bash
npx @opencampus/ochub-harness --url <mini-app-url>
```

### Options

| Option          | Description                | Default                 |
| --------------- | -------------------------- | ----------------------- |
| `--url <url>`   | URL of your mini app       | `http://localhost:3000` |
| `--port <port>` | Port to run the harness on | `8080`                  |

### Example

Start the harness pointing to your local mini app:

```bash
npx @opencampus/ochub-harness --url http://localhost:5173
```

Or use defaults (assumes your app runs on port 3000):

```bash
npx @opencampus/ochub-harness
```

Then open `http://localhost:8080` in your browser.
