"""Run once to build the vector store. Re-run with --reset to rebuild."""
import sys
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

from backend.rag.ingest import ingest

if __name__ == "__main__":
    reset = "--reset" in sys.argv
    print(f"Ingesting data{' (reset mode)' if reset else ''}...")
    count = ingest(reset=reset)
    print(f"Done! {count} articles in vector store.")
