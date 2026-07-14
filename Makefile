.PHONY: schema python-codegen schema-codegen-clean help

# Cross-language codegen for the canonical event schema. The TS toolchain
# (Zod -> zod-to-json-schema) generates JSON Schema; this Makefile turns those
# JSON Schemas into Pydantic v2 models so Python consumers share one contract.

PY ?= python3
CODEGEN_VENV := .codegen-venv
DATAMODEL_CODEGEN := $(CODEGEN_VENV)/bin/datamodel-codegen

JSON_DIR := dist
PY_PKG_DIR := $(JSON_DIR)/python/event_schema

help:
	@echo "Targets:"
	@echo "  schema                Build JS/TS schema (lib/) + JSON Schema (dist/)"
	@echo "  python-codegen        Build Pydantic v2 models from the JSON Schemas"
	@echo "  schema-codegen-clean  Remove .codegen-venv/ and dist/python/"

# === JS/TS schema build ====================================================
schema:
	npm run build

# === Codegen venv (project-local) ==========================================
$(DATAMODEL_CODEGEN): requirements-codegen.txt
	@if [ ! -d "$(CODEGEN_VENV)" ]; then \
		echo "Bootstrapping $(CODEGEN_VENV)/ with $(PY)…"; \
		$(PY) -m venv $(CODEGEN_VENV); \
		$(CODEGEN_VENV)/bin/pip install --quiet --upgrade pip; \
	fi
	$(CODEGEN_VENV)/bin/pip install --quiet -r requirements-codegen.txt
	@touch $(DATAMODEL_CODEGEN)

# === Python codegen ========================================================
python-codegen: $(DATAMODEL_CODEGEN)
	@npm run build --silent
	@mkdir -p $(PY_PKG_DIR)
	$(DATAMODEL_CODEGEN) \
		--input $(JSON_DIR)/event.schema.json \
		--input-file-type jsonschema \
		--output $(PY_PKG_DIR)/event.py \
		--output-model-type pydantic_v2.BaseModel \
		--target-python-version 3.11 \
		--use-double-quotes \
		--use-schema-description \
		--disable-timestamp
	$(DATAMODEL_CODEGEN) \
		--input $(JSON_DIR)/checkpoint.schema.json \
		--input-file-type jsonschema \
		--output $(PY_PKG_DIR)/checkpoint.py \
		--output-model-type pydantic_v2.BaseModel \
		--target-python-version 3.11 \
		--use-double-quotes \
		--use-schema-description \
		--disable-timestamp
	# datamodel-codegen emits invalid model_config on RootModel subclasses
	# (Pydantic v2 forbids it); strip those blocks before the package imports.
	$(CODEGEN_VENV)/bin/python scripts/fix_rootmodel_config.py \
		$(PY_PKG_DIR)/event.py \
		$(PY_PKG_DIR)/checkpoint.py

schema-codegen-clean:
	rm -rf $(CODEGEN_VENV) $(JSON_DIR)/python
