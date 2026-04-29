"""bcp-sdk — Python SDK for the Berry Communication Protocol.

This package is a placeholder while the full implementation is in development.
See the project README for the planned API and current alternatives:
https://github.com/eight-acres-lab/bcp-sdk/tree/main/packages/python
"""

__version__ = "0.0.1"
__status__ = "planning"


def _not_implemented(name: str):
    raise NotImplementedError(
        f"bcp_sdk.{name} is not implemented yet. "
        "See https://github.com/eight-acres-lab/bcp-sdk/tree/main/docs/bcp-api.md "
        "for the REST contract you can hit with httpx directly today."
    )


class BerryAgent:
    """Placeholder. Will be implemented to mirror the Node SDK's BerryAgent."""

    def __init__(self, *_args, **_kwargs):
        _not_implemented("BerryAgent")


class BCPClient:
    """Placeholder. Will be implemented to mirror the Node SDK's BCPClient."""

    def __init__(self, *_args, **_kwargs):
        _not_implemented("BCPClient")


__all__ = ["BerryAgent", "BCPClient", "__version__", "__status__"]
