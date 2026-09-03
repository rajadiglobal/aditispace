"""
Alembic environment configuration.

This file is run by Alembic when creating or applying migrations.
It must import all models so that autogenerate can detect schema changes.
"""

import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# ─── Path Setup ───────────────────────────────────────────────────────────────
# Add the backend/ directory to sys.path so our app modules are importable.
sys.path.insert(0, ".")

# ─── Load App Config ─────────────────────────────────────────────────────────
from app.config import settings
from app.database import Base

# Import ALL models so Alembic autogenerate sees them
import app.models  # noqa: F401 — triggers __init__.py which imports all models

# ─── Alembic Config ───────────────────────────────────────────────────────────
config = context.config

# Override the sqlalchemy.url from alembic.ini with our settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the target metadata for autogenerate
target_metadata = Base.metadata


# ─── Migration Functions ──────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.

    This configures the context with just a URL, without creating an
    actual database connection. Useful for generating SQL scripts.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.

    Creates an actual database connection and applies migrations.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,       # Detect column type changes
            compare_server_default=True,  # Detect default value changes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
