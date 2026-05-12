- [Config](#config)
    - [Format](#format)
    - [Locations](#locations)
        - [Precedence order](#precedence-order)
    - [Remote](#remote)
    - [Global](#global)
    - [Per project](#per-project)
    - [Custom path](#custom-path)
    - [Custom directory](#custom-directory)
    - [Managed settings](#managed-settings)
        - [File-based](#file-based)
        - [macOS managed preferences](#macos-managed-preferences)
        - [Creating a .mobileconfig](#creating-a-mobileconfig)
        - [Deploying via MDM](#deploying-via-mdm)
        - [Verifying on a device](#verifying-on-a-device)
    - [Schema](#schema)
    - [TUI](#tui)
    - [Server](#server)
    - [Shell](#shell)
    - [Tools](#tools)
    - [Models](#models)
    - [Provider-Specific Options](#provider-specific-options)
        - [Amazon Bedrock](#amazon-bedrock)
    - [Themes](#themes)
    - [Agents](#agents)
        - [Default agent](#default-agent)
    - [Sharing](#sharing)
    - [Commands](#commands)
    - [Keybinds](#keybinds)
    - [Snapshot](#snapshot)
    - [Autoupdate](#autoupdate)
    - [Formatters](#formatters)
    - [LSP Servers](#lsp-servers)
    - [Permissions](#permissions)
    - [Compaction](#compaction)
    - [Watcher](#watcher)
    - [MCP servers](#mcp-servers)
    - [Plugins](#plugins)
    - [Instructions](#instructions)
    - [Disabled providers](#disabled-providers)
    - [Enabled providers](#enabled-providers)
    - [Experimental](#experimental)
    - [Variables](#variables)
    - [Env vars](#env-vars)
    - [Files](#files)
- [GitHub](#github-1)
    - [Features](#features)
    - [Installation](#installation)
    - [Manual Setup](#manual-setup)
    - [Configuration](#configuration)
    - [Supported Events](#supported-events)
    - [Schedule Example](#schedule-example)
    - [Pull Request Example](#pull-request-example)
    - [Issues Triage Example](#issues-triage-example)
    - [Custom prompts](#custom-prompts)
    - [Examples](#examples)
- [Web](#web-1)
    - [Getting Started](#getting-started)
        - [Windows Users](#windows-users)
    - [Configuration](#configuration)
        - [Port](#port)
        - [Hostname](#hostname)
        - [mDNS Discovery](#mdns-discovery)
        - [CORS](#cors)
        - [Authentication](#authentication)
    - [Using the Web Interface](#using-the-web-interface)
        - [Sessions](#sessions-1)
        - [Server Status](#server-status)
        - [Attaching a Terminal](#attaching-a-terminal)
    - [Config File](#config-file)
- [Tools](#tools-1)
    - [Configure](#configure-1)
    - [Built-in](#built-in)
        - [bash](#bash)
        - [edit](#edit)
        - [write](#write)
        - [read](#read)
        - [grep](#grep)
        - [glob](#glob)
        - [lsp (experimental)](#lsp-experimental)
        - [apply_patch](#apply_patch)
        - [skill](#skill)
        - [todowrite](#todowrite)
        - [webfetch](#webfetch)
        - [websearch](#websearch)
        - [question](#question)
    - [Custom tools](#custom-tools)
    - [MCP servers](#mcp-servers-1)
    - [Internals](#internals)
        - [Ignore patterns](#ignore-patterns)
- [Rules](#rules)
    - [Initialize](#initialize)
    - [Example](#example)
    - [Types](#types)
        - [Project](#project)
        - [Global](#global-1)
    - [Claude Code Compatibility](#claude-code-compatibility)
    - [Precedence](#precedence)
    - [Custom Instructions](#custom-instructions)
    - [Referencing External Files](#referencing-external-files)
        - [Using opencode.json](#using-opencodejson)
        - [Manual Instructions in AGENTS.md](#manual-instructions-in-agentsmd)
- [Agents](#agents-1)
    - [Types](#types-1)
        - [Primary agents](#primary-agents)
        - [Subagents](#subagents)
    - [Built-in](#built-in-1)
        - [Use build](#use-build)
        - [Use plan](#use-plan)
        - [Use general](#use-general)
        - [Use explore](#use-explore)
        - [Use scout](#use-scout)
        - [Use compaction](#use-compaction)
        - [Use title](#use-title)
        - [Use summary](#use-summary)
    - [Usage](#usage)
    - [Configure](#configure-2)
        - [JSON](#json)
        - [Markdown](#markdown)
    - [Options](#options-1)
        - [Description](#description)
        - [Temperature](#temperature)
        - [Max steps](#max-steps)
        - [Disable](#disable)
        - [Prompt](#prompt)
        - [Model](#model)
        - [Tools (deprecated)](#tools-deprecated)
        - [Permissions](#permissions-1)
        - [Mode](#mode)
        - [Hidden](#hidden)
        - [Task permissions](#task-permissions)
        - [Color](#color)
        - [Top P](#top-p)
        - [Additional](#additional)
    - [Create agents](#create-agents)
    - [Use cases](#use-cases)
    - [Examples](#examples)
        - [Documentation agent](#documentation-agent)
        - [Security auditor](#security-auditor)
- [Models](#models-3)
    - [Providers](#providers)
    - [Select a model](#select-a-model)
    - [Recommended models](#recommended-models)
    - [Set a default](#set-a-default)
    - [Configure models](#configure-models)
    - [Variants](#variants)
        - [Built-in variants](#built-in-variants)
        - [Custom variants](#custom-variants)
        - [Cycle variants](#cycle-variants)
    - [Loading models](#loading-models)
- [Themes](#themes-2)
    - [Terminal requirements](#terminal-requirements)
    - [Built-in themes](#built-in-themes)
    - [System theme](#system-theme)
    - [Using a theme](#using-a-theme)
    - [Custom themes](#custom-themes)
        - [Hierarchy](#hierarchy)
        - [Creating a theme](#creating-a-theme)
        - [JSON format](#json-format)
        - [Color definitions](#color-definitions)
        - [Terminal defaults](#terminal-defaults)
    - [Example](#example-1)
- [Keybinds](#keybinds-1)
    - [Leader Key](#leader-key)
    - [Binding Values](#binding-values)
    - [Disable Keybind](#disable-keybind)
    - [Desktop Prompt Shortcuts](#desktop-prompt-shortcuts)
    - [Shift+Enter](#shiftenter)
        - [Windows Terminal](#windows-terminal)
- [Commands](#commands-3)
    - [Create command files](#create-command-files)
    - [Configure](#configure-3)
        - [JSON](#json-1)
        - [Markdown](#markdown-1)
    - [Prompt config](#prompt-config)
        - [Arguments](#arguments)
        - [Shell output](#shell-output)
        - [File references](#file-references-1)
    - [Options](#options-2)
        - [Template](#template)
        - [Description](#description-1)
        - [Agent](#agent-1)
        - [Subtask](#subtask)
        - [Model](#model-1)
    - [Built-in](#built-in-2)
- [Formatters](#formatters-1)
    - [Built-in](#built-in-3)
    - [How it works](#how-it-works)
    - [Configure](#configure-4)
        - [Disabling formatters](#disabling-formatters)
        - [Custom formatters](#custom-formatters)
- [Permissions](#permissions-2)
    - [Actions](#actions)
    - [Configuration](#configuration-1)
        - [Granular Rules (Object Syntax)](#granular-rules-object-syntax)
        - [Wildcards](#wildcards)
        - [Home Directory Expansion](#home-directory-expansion)
        - [External Directories](#external-directories)
    - [Available Permissions](#available-permissions)
    - [Defaults](#defaults)
    - [What “Ask” Does](#what-ask-does)
    - [Agents](#agents-2)
- [LSP Servers](#lsp-servers-1)
    - [Built-in](#built-in-4)
    - [How It Works](#how-it-works-1)
    - [Configure](#configure-5)
        - [Environment variables](#environment-variables-1)
        - [Initialization options](#initialization-options)
        - [Disabling LSP servers](#disabling-lsp-servers)
        - [Custom LSP servers](#custom-lsp-servers)
    - [Additional Information](#additional-information)
        - [PHP Intelephense](#php-intelephense)
- [MCP servers](#mcp-servers-2)
    - [Caveats](#caveats)
    - [Enable](#enable)
    - [Overriding remote defaults](#overriding-remote-defaults)
    - [Local](#local)
        - [Options](#options-3)
    - [Remote](#remote-1)
        - [Options](#options-4)
    - [OAuth](#oauth)
        - [Automatic](#automatic)
        - [Pre-registered](#pre-registered)
        - [Authenticating](#authenticating)
        - [Disabling OAuth](#disabling-oauth)
        - [OAuth Options](#oauth-options)
    - [Debugging](#debugging)
    - [Manage](#manage)
        - [Global](#global-2)
        - [Per agent](#per-agent)
        - [Glob patterns](#glob-patterns)
    - [Examples](#examples-1)
        - [Sentry](#sentry)
        - [Context7](#context7)
        - [Grep by Vercel](#grep-by-vercel)
- [ACP Support](#acp-support)
    - [Configure](#configure-6)
        - [Zed](#zed)
        - [JetBrains IDEs](#jetbrains-ides)
        - [Avante.nvim](#avante-nvim)
        - [CodeCompanion.nvim](#codecompanion-nvim)
    - [Support](#support)
- [Agent Skills](#agent-skills)
    - [Place files](#place-files)
    - [Understand discovery](#understand-discovery)
    - [Write frontmatter](#write-frontmatter)
    - [Validate names](#validate-names)
    - [Follow length rules](#follow-length-rules)
    - [Use an example](#use-an-example-2)
    - [Recognize tool description](#recognize-tool-description)
    - [Configure permissions](#configure-permissions-1)
    - [Override per agent](#override-per-agent)
    - [Disable the skill tool](#disable-the-skill-tool)
    - [Troubleshoot loading](#troubleshoot-loading)
- [Custom Tools](#custom-tools-1)
    - [Creating a tool](#creating-a-tool-1)
        - [Location](#location-1)
        - [Structure](#structure)
        - [Multiple tools per file](#multiple-tools-per-file)
        - [Name collisions with built-in tools](#name-collisions-with-built-in-tools)
    - [Arguments](#arguments-1)
    - [Context](#context)
    - [Examples](#examples-2)
        - [Write a tool in Python](#write-a-tool-in-python)
- [SDK](#sdk)
    - [Install](#install-2)
    - [Create client](#create-client)
        - [Options](#options-5)
    - [Config](#config-4)
    - [Client only](#client-only)
        - [Options](#options-6)
    - [Types](#types-2)
    - [Errors](#errors)
    - [Structured Output](#structured-output)
        - [Basic Usage](#basic-usage)
        - [Output Format Types](#output-format-types)
        - [JSON Schema Format](#json-schema-format)
    - [Error Handling](#error-handling-1)
    - [Best Practices](#best-practices)
    - [APIs](#apis)
        - [Global](#global-3)
        - [App](#app)
        - [Project](#project-1)
        - [Path](#path-1)
        - [Config](#config-5)
        - [Sessions](#sessions-2)
        - [Files](#files-1)
        - [TUI](#tui-3)
        - [Auth](#auth-2)
        - [Events](#events)
- [Server](#server-2)
    - [Usage](#usage-1)
    - [Options](#options-7)
    - [Authentication](#authentication-1)
    - [How it works](#how-it-works-2)
    - [Connect to an existing server](#connect-to-an-existing-server)
    - [Spec](#spec)
    - [APIs](#apis-1)
        - [Global](#global-4)
        - [Project](#project-2)
        - [Path & VCS](#path-vcs)
        - [Instance](#instance)
        - [Config](#config-6)
        - [Provider](#provider)
        - [Sessions](#sessions-3)
        - [Messages](#messages)
        - [Commands](#commands-4)
        - [Files](#files-2)
        - [Tools (Experimental)](#tools-experimental-1)
        - [LSP, Formatters & MCP](#lsp-formatters-mcp)
        - [Agents](#agents-3)
        - [Logging](#logging)
        - [TUI](#tui-4)
        - [Auth](#auth-3)
        - [Events](#events-1)
        - [Docs](#docs)
- [Plugins](#plugins-1)
    - [Use a plugin](#use-a-plugin)
        - [From local files](#from-local-files)
        - [From npm](#from-npm)
    - [How plugins are installed](#how-plugins-are-installed)
    - [Load order](#load-order)
    - [Create a plugin](#create-a-plugin)
        - [Dependencies](#dependencies)
        - [Basic structure](#basic-structure)
        - [TypeScript support](#typescript-support)
    - [Events](#events-2)
    - [Examples](#examples-3)
        - [Send notifications](#send-notifications)
        - [.env protection](#env-protection)
        - [Inject environment variables](#inject-environment-variables)
        - [Custom tools](#custom-tools-2)
        - [Logging](#logging-1)
        - [Compaction hooks](#compaction-hooks)
- [Ecosystem](#ecosystem)
    - [Plugins](#plugins-2)
    - [Projects](#projects)
    - [Agents](#agents-4)

# Config

Using the OpenCode JSON config.

You can configure OpenCode using a JSON config file.

## Format

OpenCode supports both JSON and JSONC (JSON with Comments) formats.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
  "server": {
    "port": 4096,
  },
}
```

## Locations

You can place your config in a couple of different locations and they have a different order of precedence.

> **Note**
> Configuration files are merged together, not replaced.

Configuration files are merged together, not replaced. Settings from the following config locations are combined. Later configs override earlier ones only for conflicting keys. Non-conflicting settings from all configs are preserved.

For example, if your global config sets `autoupdate: true` and your project config sets `model: "anthropic/claude-sonnet-4-5"`, the final configuration will include both settings.

### Precedence order

Config sources are loaded in this order (later sources override earlier ones):

* Remote config (from `.well-known/opencode`) - organizational defaults
* Global config (`~/.config/opencode/opencode.json`) - user preferences
* Custom config (`OPENCODE_CONFIG` env var) - custom overrides
* Project config (`opencode.json` in project) - project-specific settings
* `.opencode` directories - agents, commands, plugins
* Inline config (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides
* Managed config files (`/Library/Application Support/opencode/` on macOS) - admin-controlled
* macOS managed preferences (`.mobileconfig` via MDM) - highest priority, not user-overridable

This means project configs can override global defaults, and global configs can override remote organizational defaults. Managed settings override everything.

> **Note**
> The `.opencode` and `~/.config/opencode` directories use plural names for subdirectories: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`. Singular names (e.g., `agent/`) are also supported for backwards compatibility.

## Remote

Organizations can provide default configuration via the `.well-known/opencode` endpoint. This is fetched automatically when you authenticate with a provider that supports it.

Remote config is loaded first, serving as the base layer. All other config sources (global, project) can override these defaults.

For example, if your organization provides MCP servers that are disabled by default:

**Remote config from .well-known/opencode**
```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "[https://jira.example.com/mcp](https://jira.example.com/mcp)",
      "enabled": false
    }
  }
}
```

You can enable specific servers in your local config:

**opencode.json**
```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "[https://jira.example.com/mcp](https://jira.example.com/mcp)",
      "enabled": true
    }
  }
}
```

## Global

Place your global OpenCode config in `~/.config/opencode/opencode.json`. Use global config for user-wide server/runtime preferences like providers, models, and permissions.

For TUI-specific settings, use `~/.config/opencode/tui.json`.

Global config overrides remote organizational defaults.

## Per project

Add `opencode.json` in your project root. Project config has the highest precedence among standard config files - it overrides both global and remote configs.

For project-specific TUI settings, add `tui.json` alongside it.

> **Tip**
> Place project specific config in the root of your project.

When OpenCode starts up, it looks for a config file in the current directory or traverse up to the nearest Git directory.

This is also safe to be checked into Git and uses the same schema as the global one.

## Custom path

Specify a custom config file path using the `OPENCODE_CONFIG` environment variable.

**Terminal window**
```bash
export OPENCODE_CONFIG=/path/to/my/custom-config.json
opencode run "Hello world"
```

Custom config is loaded between global and project configs in the precedence order.

## Custom directory

Specify a custom config directory using the `OPENCODE_CONFIG_DIR` environment variable. This directory will be searched for agents, commands, modes, and plugins just like the standard `.opencode` directory, and should follow the same structure.

**Terminal window**
```bash
export OPENCODE_CONFIG_DIR=/path/to/my/config-directory
opencode run "Hello world"
```

The custom directory is loaded after the global config and `.opencode` directories, so it can override their settings.

## Managed settings

Organizations can enforce configuration that users cannot override. Managed settings are loaded at the highest priority tier.

### File-based

Drop an `opencode.json` or `opencode.jsonc` file in the system managed config directory:

| Platform | Path |
| :--- | :--- |
| macOS | `/Library/Application Support/opencode/` |
| Linux | `/etc/opencode/` |
| Windows | `%ProgramData%\opencode` |

These directories require admin/root access to write, so users cannot modify them.

### macOS managed preferences

On macOS, OpenCode reads managed preferences from the `ai.opencode.managed` preference domain. Deploy a `.mobileconfig` via MDM (Jamf, Kandji, FleetDM) and the settings are enforced automatically.

OpenCode checks these paths:
* `/Library/Managed Preferences/<user>/ai.opencode.managed.plist`
* `/Library/Managed Preferences/ai.opencode.managed.plist`

The plist keys map directly to `opencode.json` fields. MDM metadata keys (PayloadUUID, `PayloadType`, etc.) are stripped automatically.

### Creating a .mobileconfig

Use the `ai.opencode.managed` PayloadType. The OpenCode config keys go directly in the payload dict:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "[http://www.apple.com/DTDs/PropertyList-1.0.dtd](http://www.apple.com/DTDs/PropertyList-1.0.dtd)">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>ai.opencode.managed</string>
      <key>PayloadIdentifier</key>
      <string>com.example.opencode.config</string>
      <key>PayloadUUID</key>
      <string>GENERATE-YOUR-OWN-UUID</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>share</key>
      <string>disabled</string>
      <key>server</key>
      <dict>
        <key>hostname</key>
        <string>127.0.0.1</string>
      </dict>
      <key>permission</key>
      <dict>
        <key>*</key>
        <string>ask</string>
        <key>bash</key>
        <dict>
          <key>*</key>
          <string>ask</string>
          <key>rm -rf *</key>
          <string>deny</string>
        </dict>
      </dict>
    </dict>
  </array>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.example.opencode</string>
  <key>PayloadUUID</key>
  <string>GENERATE-YOUR-OWN-UUID</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Generate unique UUIDs with `uuidgen`. Customize the settings to match your organization’s requirements.

### Deploying via MDM

* Jamf Pro: Computers > Configuration Profiles > Upload > scope to target devices or smart groups
* FleetDM: Add the `.mobileconfig` to your gitops repo under `mdm.macos_settings.custom_settings` and run `fleetctl apply`

### Verifying on a device

Double-click the `.mobileconfig` to install locally for testing (shows in System Settings > Privacy & Security > Profiles), then run:

**Terminal window**
```bash
opencode debug config
```

All managed preference keys appear in the resolved config and cannot be overridden by user or project configuration.

## Schema

The server/runtime config schema is defined in `opencode.ai/config.json`.

TUI config uses `opencode.ai/tui.json`.

Your editor should be able to validate and autocomplete based on the schema.

## TUI

Use a dedicated `tui.json` (or `tui.jsonc`) file for TUI-specific settings.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
  },
  "diff_style": "auto",
  "mouse": true
}
```

Use `OPENCODE_TUI_CONFIG` to point to a custom TUI config file.

Legacy `theme`, `keybinds`, and `tui` keys in `opencode.json` are deprecated and automatically migrated when possible.

## Server

You can configure server settings for the `opencode serve` and `opencode web` commands through the `server` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  }
}
```

Available options:
* `port` - Port to listen on.
* `hostname` - Hostname to listen on. When `mdns` is enabled and no hostname is set, defaults to `0.0.0.0`.
* `mdns` - Enable mDNS service discovery. This allows other devices on the network to discover your OpenCode server.
* `mdnsDomain` - Custom domain name for mDNS service. Defaults to `opencode.local`. Useful for running multiple instances on the same network.
* `cors` - Additional origins to allow for CORS when using the HTTP server from a browser-based client. Values must be full origins (scheme + host + optional port), eg `https://app.example.com`.

Learn more about the server here.

## Shell

You can configure the shell used for the interactive terminal using the `shell` option. Compatible shells are also used for agent tool calls.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "shell": "pwsh"
}
```

If not specified, OpenCode will automatically discover and use a sensible default based on your operating system (e.g. `pwsh` or `cmd.exe` on Windows, `/bin/zsh` or `/bin/bash` on macOS/Linux). You can provide an absolute path or a short name.

## Tools

You can manage the tools an LLM can use through the `tools` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "tools": {
    "write": false,
    "bash": false
  }
}
```

Learn more about tools here.

## Models

You can configure the providers and models you want to use in your OpenCode config through the `provider`, `model` and `small_model` options.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {},
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

The `small_model` option configures a separate model for lightweight tasks like title generation. By default, OpenCode tries to use a cheaper model if one is available from your provider, otherwise it falls back to your main model.

Provider options can include `timeout`, `chunkTimeout`, and `setCacheKey`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "chunkTimeout": 30000,
        "setCacheKey": true
      }
    }
  }
}
```

* `timeout` - Request timeout in milliseconds (default: 300000). Set to `false` to disable.
* `chunkTimeout` - Timeout in milliseconds between streamed response chunks. If no chunk arrives in time, the request is aborted.
* `setCacheKey` - Ensure a cache key is always set for designated provider.

You can also configure local models. Learn more.

## Provider-Specific Options

Some providers support additional configuration options beyond the generic `timeout` and `apiKey` settings.

### Amazon Bedrock

Amazon Bedrock supports AWS-specific configuration:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "[https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com](https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com)"
      }
    }
  }
}
```

* `region` - AWS region for Bedrock (defaults to `AWS_REGION` env var or `us-east-1`)
* `profile` - AWS named profile from `~/.aws/credentials` (defaults to `AWS_PROFILE` env var)
* `endpoint` - Custom endpoint URL for VPC endpoints. This is an alias for the generic `baseURL` option using AWS-specific terminology. If both are specified, `endpoint` takes precedence.

> **Note**
> Bearer tokens (`AWS_BEARER_TOKEN_BEDROCK` or `/connect`) take precedence over profile-based authentication. See authentication precedence for details.

Learn more about Amazon Bedrock configuration.

## Themes

Set your UI theme in `tui.json`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "theme": "tokyonight"
}
```

Learn more here.

## Agents

You can configure specialized agents for specific tasks through the `agent` option.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        // Disable file modification tools for review-only agent
        "write": false,
        "edit": false,
      },
    },
  },
}
```

You can also define agents using markdown files in `~/.config/opencode/agents/` or `.opencode/agents/`. Learn more here.

### Default agent

You can set the default agent using the `default_agent` option. This determines which agent is used when none is explicitly specified.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "default_agent": "plan"
}
```

The default agent must be a primary agent (not a subagent). This can be a built-in agent like `"build"` or `"plan"`, or a custom agent you’ve defined. If the specified agent doesn’t exist or is a subagent, OpenCode will fall back to `"build"` with a warning.

This setting applies across all interfaces: TUI, CLI (`opencode run`), desktop app, and GitHub Action.

## Sharing

You can configure the `share` feature through the `share` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "share": "manual"
}
```

This takes:
* `"manual"` - Allow manual sharing via commands (default)
* `"auto"` - Automatically share new conversations
* `"disabled"` - Disable sharing entirely

By default, sharing is set to manual mode where you need to explicitly share conversations using the `/share` command.

## Commands

You can configure custom commands for repetitive tasks through the `command` option.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5",
    },
    "component": {
      "template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",
      "description": "Create a new component",
    },
  },
}
```

You can also define commands using markdown files in `~/.config/opencode/commands/` or `.opencode/commands/`. Learn more here.

## Keybinds

Customize TUI keyboard shortcuts in `tui.json` with `keybinds`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "keybinds": {
    "command_list": "ctrl+p"
  }
}
```

`keybinds` is merged with built-in defaults, so you only need to configure the shortcuts you want to change.

Learn more here.

## Snapshot

OpenCode uses snapshots to track file changes during agent operations, enabling you to undo and revert changes within a session. Snapshots are enabled by default.

For large repositories or projects with many submodules, the snapshot system can cause slow indexing and significant disk usage as it tracks all changes using an internal git repository. You can disable snapshots using the `snapshot` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "snapshot": false
}
```

Note that disabling snapshots means changes made by the agent cannot be rolled back through the UI.

## Autoupdate

OpenCode will automatically download any new updates when it starts up. You can disable this with the `autoupdate` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "autoupdate": false
}
```

If you don’t want updates but want to be notified when a new version is available, set `autoupdate` to `"notify"`. Notice that this only works if it was not installed using a package manager such as Homebrew.

## Formatters

You can enable and configure code formatters through the `formatter` option. Omit it to keep formatters disabled.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom formatters.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

Learn more about formatters here.

## LSP Servers

You can enable and configure LSP servers through the `lsp` option. Omit it to keep LSP disabled.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom LSP servers.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

Learn more about LSP servers here.

## Permissions

By default, opencode allows all operations without requiring explicit approval. You can change this using the `permission` option.

For example, to ensure that the `edit` and `bash` tools require user approval:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

Learn more about permissions here.

## Compaction

You can control context compaction behavior through the `compaction` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "compaction": {
    "auto": true,
    "prune": true,
    "reserved": 10000
  }
}
```

* `auto` - Automatically compact the session when context is full (default: `true`).
* `prune` - Remove old tool outputs to save tokens (default: `true`).
* `reserved` - Token buffer for compaction. Leaves enough window to avoid overflow during compaction

## Watcher

You can configure file watcher ignore patterns through the `watcher` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

Patterns follow glob syntax. Use this to exclude noisy directories from file watching.

## MCP servers

You can configure MCP servers you want to use through the `mcp` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {}
}
```

Learn more here.

## Plugins

Plugins extend OpenCode with custom tools, hooks, and integrations.

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`. You can also load plugins from npm through the `plugin` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

Learn more here.

## Instructions

You can configure the instructions for the model you’re using through the `instructions` option.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

This takes an array of paths and glob patterns to instruction files. Learn more about rules here.

## Disabled providers

You can disable providers that are loaded automatically through the `disabled_providers` option. This is useful when you want to prevent certain providers from being loaded even if their credentials are available.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "disabled_providers": ["openai", "gemini"]
}
```

> **Note**
> The `disabled_providers` takes priority over `enabled_providers`.

The `disabled_providers` option accepts an array of provider IDs. When a provider is disabled:
* It won’t be loaded even if environment variables are set.
* It won’t be loaded even if API keys are configured through the `/connect` command.
* The provider’s models won’t appear in the model selection list.

## Enabled providers

You can specify an allowlist of providers through the `enabled_providers` option. When set, only the specified providers will be enabled and all others will be ignored.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "enabled_providers": ["anthropic", "openai"]
}
```

This is useful when you want to restrict OpenCode to only use specific providers rather than disabling them one by one.

> **Note**
> The `disabled_providers` takes priority over `enabled_providers`.
> If a provider appears in both `enabled_providers` and `disabled_providers`, the `disabled_providers` takes priority for backwards compatibility.

## Experimental

The `experimental` key contains options that are under active development.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "experimental": {}
}
```

> **Caution**
> Experimental options are not stable. They may change or be removed without notice.

## Variables

You can use variable substitution in your config files to reference environment variables and file contents.

### Env vars

Use `{env:VARIABLE_NAME}` to substitute environment variables:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "models": {},
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

If the environment variable is not set, it will be replaced with an empty string.

### Files

Use `{file:path/to/file}` to substitute the contents of a file:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "instructions": ["./custom-instructions.md"],
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

File paths can be:
* Relative to the config file directory
* Or absolute paths starting with `/` or `~`

These are useful for:
* Keeping sensitive data like API keys in separate files.
* Including large instruction files without cluttering your config.
* Sharing common configuration snippets across multiple config files.

# TUI

Using the OpenCode terminal user interface.

OpenCode provides an interactive terminal interface or TUI for working on your projects with an LLM.

Running OpenCode starts the TUI for the current directory.

**Terminal window**
```bash
opencode
```

Or you can start it for a specific working directory.

**Terminal window**
```bash
opencode /path/to/project
```

Once you’re in the TUI, you can prompt it with a message.

> Give me a quick summary of the codebase.

## File references

You can reference files in your messages using `@`. This does a fuzzy file search in the current working directory.

> **Tip:**
> You can also use `@` to reference files in your messages.

```text
How is auth handled in @packages/functions/src/api/index.ts?
```

The content of the file is added to the conversation automatically.

Configured references also appear in `@` autocomplete. Type `@alias` to add the reference root as context, or type `@alias/` to autocomplete files inside that reference.

```text
Compare our setup with @docs/README.md
```

## Bash commands

Start a message with `!` to run a shell command.

```bash
!ls -la
```

The output of the command is added to the conversation as a tool result.

## Commands

When using the OpenCode TUI, you can type `/` followed by a command name to quickly execute actions. For example:

```text
/help
```

Most commands also have keyboard shortcuts using `ctrl+x` as the default leader key. Learn more.

Here are all available slash commands:

### `/connect`

Add a provider to OpenCode. Allows you to select from available providers and add their API keys.

```text
/connect
```

### `/compact`

Compact the current session. **Alias:** `/summarize`

```text
/compact
```

**Keybind:** `ctrl+x c`

### `/details`

Toggle tool execution details.

```text
/details
```

### `/editor`

Open external editor for composing messages. Uses the editor set in your `EDITOR` environment variable. Learn more.

```text
/editor
```

**Keybind:** `ctrl+x e`

### `/exit`

Exit OpenCode. **Aliases:** `/quit`, `/q`

```text
/exit
```

**Keybind:** `ctrl+x q`

### `/export`

Export current conversation to Markdown and open in your default editor. Uses the editor set in your `EDITOR` environment variable. Learn more.

```text
/export
```

**Keybind:** `ctrl+x x`

### `/help`

Show the help dialog.

```text
/help
```

### `/init`

Guided setup for creating or updating `AGENTS.md`. Learn more.

```text
/init
```

### `/models`

List available models.

```text
/models
```

**Keybind:** `ctrl+x m`

### `/new`

Start a new session. **Alias:** `/clear`

```text
/new
```

**Keybind:** `ctrl+x n`

### `/redo`

Redo a previously undone message. Only available after using `/undo`.

> **Tip:**
> Any file changes will also be restored. Internally, this uses Git to manage the file changes. So your project needs to be a Git repository.

```text
/redo
```

**Keybind:** `ctrl+x r`

### `/sessions`

List and switch between sessions. **Aliases:** `/resume`, `/continue`

```text
/sessions
```

**Keybind:** `ctrl+x l`

### `/share`

Share current session. Learn more.

```text
/share
```

### `/themes`

List available themes.

```text
/themes
```

**Keybind:** `ctrl+x t`

### `/thinking`

Toggle the visibility of thinking/reasoning blocks in the conversation. When enabled, you can see the model’s reasoning process for models that support extended thinking.

> **Note:**
> This command only controls whether thinking blocks are displayed - it does not enable or disable the model’s reasoning capabilities. To toggle actual reasoning capabilities, use `ctrl+t` to cycle through model variants.

```text
/thinking
```

### `/undo`

Undo last message in the conversation. Removes the most recent user message, all subsequent responses, and any file changes.

> **Tip:**
> Any file changes made will also be reverted. Internally, this uses Git to manage the file changes. So your project needs to be a Git repository.

```text
/undo
```

**Keybind:** `ctrl+x u`

### `/unshare`

Unshare current session. Learn more.

```text
/unshare
```

## Editor setup

Both the `/editor` and `/export` commands use the editor specified in your `EDITOR` environment variable.

*(Works on Linux/macOS, Windows CMD, and Windows PowerShell)*

**Terminal window**
```bash
# Example for nano or vim
export EDITOR=nano
export EDITOR=vim

# For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.
# include --wait
export EDITOR="code --wait"
```

To make it permanent, add this to your shell profile; `~/.bashrc`, `~/.zshrc`, etc.

Popular editor options include:

*   `code` - Visual Studio Code
*   `cursor` - Cursor
*   `windsurf` - Windsurf
*   `nvim` - Neovim editor
*   `vim` - Vim editor
*   `nano` - Nano editor
*   `notepad` - Windows Notepad
*   `subl` - Sublime Text

> **Note:**
> Some editors like VS Code need to be started with the `--wait` flag. Some editors need command-line arguments to run in blocking mode. The `--wait` flag makes the editor process block until closed.

## Configure

You can customize TUI behavior through `tui.json` (or `tui.jsonc`).

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "theme": "opencode",
  "leader_timeout": 2000,
  "keybinds": {
    "leader": "ctrl+x",
    "command_list": "ctrl+p"
  },
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": false
  },
  "diff_style": "auto",
  "mouse": true
}
```

This is separate from `opencode.json`, which configures server/runtime behavior.

`keybinds` is merged with built-in defaults, so you only need to configure the shortcuts you want to change.

### Options

*   `theme` - Sets your UI theme. Learn more.
*   `keybinds` - Customizes keyboard shortcuts. Learn more.
*   `leader_timeout` - Controls how long OpenCode waits after the leader key. Defaults to `2000`.
*   `scroll_acceleration.enabled` - Enable macOS-style scroll acceleration for smooth, natural scrolling. When enabled, scroll speed increases with rapid scrolling gestures and stays precise for slower movements. This setting takes precedence over `scroll_speed` and overrides it when enabled.
*   `scroll_speed` - Controls how fast the TUI scrolls when using scroll commands (minimum: `0.001`, supports decimal values). Defaults to `3`. Note: This is ignored if `scroll_acceleration.enabled` is set to `true`.
*   `diff_style` - Controls diff rendering. `"auto"` adapts to terminal width, `"stacked"` always shows a single-column layout.
*   `mouse` - Enable or disable mouse capture in the TUI (default: `true`). When disabled, the terminal’s native mouse selection/scrolling behavior is preserved.

Use `OPENCODE_TUI_CONFIG` to load a custom TUI config path.

## Customization

You can customize various aspects of the TUI view using the command palette (`ctrl+p`). These settings persist across restarts.

### Username display

Toggle whether your username appears in chat messages. Access this through:

*   **Command palette:** Search for “username” or “hide username”

The setting persists automatically and will be remembered across TUI sessions.

# CLI

OpenCode CLI options and commands.

The OpenCode CLI by default starts the TUI when run without any arguments.

**Terminal window**
```bash
opencode
```

But it also accepts commands as documented on this page. This allows you to interact with OpenCode programmatically.

**Terminal window**
```bash
opencode run "Explain how closures work in JavaScript"
```

## tui

Start the OpenCode terminal user interface.

**Terminal window**
```bash
opencode [project]
```

### Flags

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` | | Fork the session when continuing (use with `--continue` or `--session`) |
| `--prompt` | | Prompt to use |
| `--model` | `-m` | Model to use in the form of provider/model |
| `--agent` | | Agent to use |
| `--port` | | Port to listen on |
| `--hostname` | | Hostname to listen on |
| `--mdns` | | Enable mDNS discovery |
| `--mdns-domain` | | Custom mDNS domain name |
| `--cors` | | Additional browser origin(s) to allow CORS |

## Commands

The OpenCode CLI also has the following commands.

### agent

Manage agents for OpenCode.

**Terminal window**
```bash
opencode agent [command]
```

#### create

Create a new agent with custom configuration.

**Terminal window**
```bash
opencode agent create
```

This command will guide you through creating a new agent with a custom system prompt and permission configuration. Anything you don’t allow is denied in the generated agent’s frontmatter.

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--path` | | Directory to write the agent file to (defaults to global or `.opencode/agent` based on the prompt) |
| `--description` | | What the agent should do |
| `--mode` | | Agent mode: `all`, `primary`, or `subagent` |
| `--permissions` | | Comma-separated list of permissions to allow (default: all). Available: `bash`, `read`, `edit`, `glob`, `grep`, `webfetch`, `task`, `todowrite`, `websearch`, `lsp`, `skill`. Anything omitted is denied. Alias: `--tools` |
| `--model` | `-m` | Model to use, in `provider/model` format |

Passing all of `--path`, `--description`, `--mode`, and `--permissions` runs the command non-interactively.

#### list

List all available agents.

**Terminal window**
```bash
opencode agent list
```

### attach

Attach a terminal to an already running OpenCode backend server started via `serve` or `web` commands.

**Terminal window**
```bash
opencode attach [url]
```

This allows using the TUI with a remote OpenCode backend. For example:

**Terminal window**
```bash
# Start the backend server for web/mobile access
opencode web --port 4096 --hostname 0.0.0.0

# In another terminal, attach the TUI to the running backend
opencode attach [http://10.20.30.40:4096](http://10.20.30.40:4096)
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--dir` | | Working directory to start TUI in |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` | | Fork the session when continuing (use with `--continue` or `--session`) |
| `--password` | `-p` | Basic auth password (defaults to `OPENCODE_SERVER_PASSWORD`) |
| `--username` | `-u` | Basic auth username (defaults to `OPENCODE_SERVER_USERNAME` or `opencode`) |

### auth

Command to manage credentials and login for providers.

**Terminal window**
```bash
opencode auth [command]
```

#### login

OpenCode is powered by the provider list at Models.dev, so you can use `opencode auth login` to configure API keys for any provider you’d like to use. This is stored in `~/.local/share/opencode/auth.json`.

**Terminal window**
```bash
opencode auth login
```

When OpenCode starts up it loads the providers from the credentials file. And if there are any keys defined in your environments or a `.env` file in your project.

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--provider` | `-p` | Provider ID or name to log in to |
| `--method` | `-m` | Login method label to use, skipping method selection |

#### list

Lists all the authenticated providers as stored in the credentials file.

**Terminal window**
```bash
opencode auth list
```

Or the short version.

**Terminal window**
```bash
opencode auth ls
```

#### logout

Logs you out of a provider by clearing it from the credentials file.

**Terminal window**
```bash
opencode auth logout
```

### github

Manage the GitHub agent for repository automation.

**Terminal window**
```bash
opencode github [command]
```

#### install

Install the GitHub agent in your repository.

**Terminal window**
```bash
opencode github install
```

This sets up the necessary GitHub Actions workflow and guides you through the configuration process. Learn more.

#### run

Run the GitHub agent. This is typically used in GitHub Actions.

**Terminal window**
```bash
opencode github run
```

**Flags**

| Flag | Description |
| :--- | :--- |
| `--event` | GitHub mock event to run the agent for |
| `--token` | GitHub personal access token |

### mcp

Manage Model Context Protocol servers.

**Terminal window**
```bash
opencode mcp [command]
```

#### add

Add an MCP server to your configuration.

**Terminal window**
```bash
opencode mcp add
```

This command will guide you through adding either a local or remote MCP server.

#### list

List all configured MCP servers and their connection status.

**Terminal window**
```bash
opencode mcp list
```

Or use the short version.

**Terminal window**
```bash
opencode mcp ls
```

#### auth

Authenticate with an OAuth-enabled MCP server.

**Terminal window**
```bash
opencode mcp auth [name]
```

If you don’t provide a server name, you’ll be prompted to select from available OAuth-capable servers.
You can also list OAuth-capable servers and their authentication status.

**Terminal window**
```bash
opencode mcp auth list
```

Or use the short version.

**Terminal window**
```bash
opencode mcp auth ls
```

#### logout

Remove OAuth credentials for an MCP server.

**Terminal window**
```bash
opencode mcp logout [name]
```

#### debug

Debug OAuth connection issues for an MCP server.

**Terminal window**
```bash
opencode mcp debug <name>
```

### models

List all available models from configured providers.

**Terminal window**
```bash
opencode models [provider]
```

This command displays all models available across your configured providers in the format `provider/model`.
This is useful for figuring out the exact model name to use in your config.

You can optionally pass a provider ID to filter models by that provider.

**Terminal window**
```bash
opencode models anthropic
```

**Flags**

| Flag | Description |
| :--- | :--- |
| `--refresh` | Refresh the models cache from models.dev |
| `--verbose` | Use more verbose model output (includes metadata like costs) |

Use the `--refresh` flag to update the cached model list. This is useful when new models have been added to a provider and you want to see them in OpenCode.

**Terminal window**
```bash
opencode models --refresh
```

### run

Run opencode in non-interactive mode by passing a prompt directly.

**Terminal window**
```bash
opencode run [message..]
```

This is useful for scripting, automation, or when you want a quick answer without launching the full TUI. For example.

**Terminal window**
```bash
opencode run Explain the use of context in Go
```

You can also attach to a running `opencode serve` instance to avoid MCP server cold boot times on every run:

**Terminal window**
```bash
# Start a headless server in one terminal
opencode serve

# In another terminal, run commands that attach to it
opencode run --attach http://localhost:4096 "Explain async/await in JavaScript"
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--command` | | The command to run, use message for args |
| `--continue` | `-c` | Continue the last session |
| `--session` | `-s` | Session ID to continue |
| `--fork` | | Fork the session when continuing (use with `--continue` or `--session`) |
| `--share` | | Share the session |
| `--model` | `-m` | Model to use in the form of provider/model |
| `--agent` | | Agent to use |
| `--file` | `-f` | File(s) to attach to message |
| `--format` | | Format: default (formatted) or json (raw JSON events) |
| `--title` | | Title for the session (uses truncated prompt if no value provided) |
| `--attach` | | Attach to a running opencode server (e.g., `http://localhost:4096`) |
| `--password` | `-p` | Basic auth password (defaults to `OPENCODE_SERVER_PASSWORD`) |
| `--username` | `-u` | Basic auth username (defaults to `OPENCODE_SERVER_USERNAME` or `opencode`) |
| `--dir` | | Directory to run in, or path on the remote server when attaching |
| `--port` | | Port for the local server (defaults to random port) |
| `--variant` | | Model variant (provider-specific reasoning effort) |
| `--thinking` | | Show thinking blocks |
| `--dangerously-skip-permissions` | | Auto-approve permissions that are not explicitly denied (dangerous!) |

### serve

Start a headless OpenCode server for API access. Check out the server docs for the full HTTP interface.

**Terminal window**
```bash
opencode serve
```

This starts an HTTP server that provides API access to opencode functionality without the TUI interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

**Flags**

| Flag | Description |
| :--- | :--- |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--mdns-domain` | Custom mDNS domain name |
| `--cors` | Additional browser origin(s) to allow CORS |

### session

Manage OpenCode sessions.

**Terminal window**
```bash
opencode session [command]
```

#### list

List all OpenCode sessions.

**Terminal window**
```bash
opencode session list
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--max-count` | `-n` | Limit to N most recent sessions |
| `--format` | | Output format: `table` or `json` (table) |

#### delete

Delete an OpenCode session.

**Terminal window**
```bash
opencode session delete <sessionID>
```

#### stats

Show token usage and cost statistics for your OpenCode sessions.

**Terminal window**
```bash
opencode stats
```

**Flags**

| Flag | Description |
| :--- | :--- |
| `--days` | Show stats for the last N days (all time) |
| `--tools` | Number of tools to show (all) |
| `--models` | Show model usage breakdown (hidden by default). Pass a number to show top N |
| `--project` | Filter by project (all projects, empty string: current project) |

### export

Export session data as JSON.

**Terminal window**
```bash
opencode export [sessionID]
```

If you don’t provide a session ID, you’ll be prompted to select from available sessions.

**Flags**

| Flag | Description |
| :--- | :--- |
| `--sanitize` | Redact sensitive transcript/file data |

### import

Import session data from a JSON file or OpenCode share URL.

**Terminal window**
```bash
opencode import <file>
```

You can import from a local file or an OpenCode share URL.

**Terminal window**
```bash
opencode import session.json
opencode import [https://opncd.ai/s/abc123](https://opncd.ai/s/abc123)
```

### web

Start a headless OpenCode server with a web interface.

**Terminal window**
```bash
opencode web
```

This starts an HTTP server and opens a web browser to access OpenCode through a web interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

**Flags**

| Flag | Description |
| :--- | :--- |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--mdns-domain` | Custom mDNS domain name |
| `--cors` | Additional browser origin(s) to allow CORS |

### acp

Start an ACP (Agent Client Protocol) server.

**Terminal window**
```bash
opencode acp
```

This command starts an ACP server that communicates via stdin/stdout using nd-JSON.

**Flags**

| Flag | Description |
| :--- | :--- |
| `--cwd` | Working directory |
| `--port` | Port to listen on |
| `--hostname` | Hostname to listen on |
| `--mdns` | Enable mDNS discovery |
| `--mdns-domain` | Custom mDNS domain name |
| `--cors` | Additional browser origin(s) to allow CORS |

### plugin

Install a plugin and update your config.

**Terminal window**
```bash
opencode plugin <module>
```

Or use the alias.

**Terminal window**
```bash
opencode plug <module>
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--global` | `-g` | Install in global config |
| `--force` | `-f` | Replace existing plugin version |

### pr

Fetch and checkout a GitHub PR branch, then run OpenCode.

**Terminal window**
```bash
opencode pr <number>
```

### db

Database tools.

**Terminal window**
```bash
opencode db [query]
```

**Flags**

| Flag | Description |
| :--- | :--- |
| `--format` | Output format: `json` or `tsv` |

#### path

Print the database path.

**Terminal window**
```bash
opencode db path
```

### debug

Debugging and troubleshooting tools.

**Terminal window**
```bash
opencode debug [command]
```

### uninstall

Uninstall OpenCode and remove all related files.

**Terminal window**
```bash
opencode uninstall
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--keep-config` | `-c` | Keep configuration files |
| `--keep-data` | `-d` | Keep session data and snapshots |
| `--dry-run` | | Show what would be removed without removing |
| `--force` | `-f` | Skip confirmation prompts |

### upgrade

Updates opencode to the latest version or a specific version.

**Terminal window**
```bash
opencode upgrade [target]
```

To upgrade to the latest version.

**Terminal window**
```bash
opencode upgrade
```

To upgrade to a specific version.

**Terminal window**
```bash
opencode upgrade v0.1.48
```

**Flags**

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--method` | `-m` | The installation method that was used; curl, npm, pnpm, bun, brew |

## Global Flags

The opencode CLI takes the following global flags.

| Flag | Short | Description |
| :--- | :--- | :--- |
| `--help` | `-h` | Display help |
| `--version` | `-v` | Print version number |
| `--print-logs` | | Print logs to stderr |
| `--log-level` | | Log level (DEBUG, INFO, WARN, ERROR) |
| `--pure` | | Run without external plugins |

## Environment variables

OpenCode can be configured using environment variables.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `OPENCODE_AUTO_SHARE` | boolean | Automatically share sessions |
| `OPENCODE_GIT_BASH_PATH` | string | Path to Git Bash executable on Windows |
| `OPENCODE_CONFIG` | string | Path to config file |
| `OPENCODE_TUI_CONFIG` | string | Path to TUI config file |
| `OPENCODE_CONFIG_DIR` | string | Path to config directory |
| `OPENCODE_CONFIG_CONTENT` | string | Inline json config content |
| `OPENCODE_DISABLE_AUTOUPDATE` | boolean | Disable automatic update checks |
| `OPENCODE_DISABLE_PRUNE` | boolean | Disable pruning of old data |
| `OPENCODE_DISABLE_TERMINAL_TITLE` | boolean | Disable automatic terminal title updates |
| `OPENCODE_PERMISSION` | string | Inlined json permissions config |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS` | boolean | Disable default plugins |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` | boolean | Disable automatic LSP server downloads |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | boolean | Enable experimental models |
| `OPENCODE_DISABLE_AUTOCOMPACT` | boolean | Disable automatic context compaction |
| `OPENCODE_DISABLE_CLAUDE_CODE` | boolean | Disable reading from `.claude` (prompt + skills) |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | boolean | Disable reading `~/.claude/CLAUDE.md` |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | boolean | Disable loading `.claude/skills` |
| `OPENCODE_DISABLE_MODELS_FETCH` | boolean | Disable fetching models from remote sources |
| `OPENCODE_DISABLE_MOUSE` | boolean | Disable mouse capture in the TUI |
| `OPENCODE_FAKE_VCS` | string | Fake VCS provider for testing purposes |
| `OPENCODE_CLIENT` | string | Client identifier (defaults to `cli`) |
| `OPENCODE_ENABLE_EXA` | boolean | Enable Exa web search tools |
| `OPENCODE_SERVER_PASSWORD` | string | Enable basic auth for `serve/web` |
| `OPENCODE_SERVER_USERNAME` | string | Override basic auth username (default `opencode`) |
| `OPENCODE_MODELS_URL` | string | Custom URL for fetching models configuration |

## Experimental

These environment variables enable experimental features that may change or be removed.

| Variable | Type | Description |
| :--- | :--- | :--- |
| `OPENCODE_EXPERIMENTAL` | boolean | Enable all experimental features |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY` | boolean | Enable icon discovery |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT` | boolean | Disable copy on select in TUI |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number | Default timeout for bash commands in ms |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | number | Max output tokens for LLM responses |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER` | boolean | Enable file watcher for entire dir |
| `OPENCODE_EXPERIMENTAL_OXFMT` | boolean | Enable oxfmt formatter |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL` | boolean | Enable experimental LSP tool |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER` | boolean | Disable file watcher |
| `OPENCODE_EXPERIMENTAL_EXA` | boolean | Enable experimental Exa features |
| `OPENCODE_EXPERIMENTAL_LSP_TY` | boolean | Enable TY LSP for python files |
| `OPENCODE_EXPERIMENTAL_MARKDOWN` | boolean | Enable experimental markdown features |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE` | boolean | Enable plan mode |

# GitHub

Use OpenCode in GitHub issues and pull-requests.

OpenCode integrates with your GitHub workflow. Mention `/opencode` or `/oc` in your comment, and OpenCode will execute tasks within your GitHub Actions runner.

## Features

- **Triage issues:** Ask OpenCode to look into an issue and explain it to you.
- **Fix and implement:** Ask OpenCode to fix an issue or implement a feature. And it will work in a new branch and submits a PR with all the changes.
- **Secure:** OpenCode runs inside your GitHub's runners.

## Installation

Run the following command in a project that is in a GitHub repo:

```bash
opencode github install
```

This will walk you through installing the GitHub app, creating the workflow, and setting up secrets.

## Manual Setup

Or you can set it up manually.

### Install the GitHub app

Head over to `github.com/apps/opencode-agent`. Make sure it's installed on the target repository.

### Add the workflow

Add the following workflow file to `.github/workflows/opencode.yml` in your repo. Make sure to set the appropriate `model` and required API keys in `env`.

`.github/workflows/opencode.yml`
```yaml
name: opencode

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
       - name: Checkout repository
         uses: actions/checkout@v6
         with:
           fetch-depth: 1
           persist-credentials: false

       - name: Run OpenCode
         uses: anomalyco/opencode/github@latest
         env:
           ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
         with:
           model: anthropic/claude-sonnet-4-20250514
           # share: true
           # github_token: xxxx
```

### Store the API keys in secrets

In your organization or project settings, expand **Secrets and variables** on the left and select **Actions**. And add the required API keys.

## Configuration

- `model`: The model to use with OpenCode. Takes the format of `provider/model`. This is **required**.
- `agent`: The agent to use. Must be a primary agent. Falls back to `default_agent` from config or `"build"` if not found.
- `share`: Whether to share the OpenCode session. Defaults to `true` for public repositories.
- `prompt`: Optional custom prompt to override the default behavior. Use this to customize how OpenCode processes requests.
- `token`: Optional GitHub access token for performing operations such as creating comments, committing changes, and opening pull requests. By default, OpenCode uses the installation access token from the OpenCode GitHub App, so commits, comments, and pull requests appear as coming from the app.

Alternatively, you can use the GitHub Action runner's built-in `GITHUB_TOKEN` without installing the OpenCode GitHub App. Just make sure to grant the required permissions in your workflow:

```yaml
permissions:
  id-token: write
  contents: write
  pull-requests: write
  issues: write
```

You can also use a personal access tokens(PAT) if preferred.

## Supported Events

OpenCode can be triggered by the following GitHub events:

| Event Type | Triggered By | Details |
| :--- | :--- | :--- |
| `issue_comment` | Comment on an issue or PR | Mention `/opencode` or `/oc` in your comment. OpenCode reads context and can create branches, open PRs, or reply. |
| `pull_request_review_comment` | Comment on specific code lines in a PR | Mention `/opencode` or `/oc` while reviewing code. OpenCode receives file path, line numbers, and diff context. |
| `issues` | Issue opened or edited | Automatically trigger OpenCode when issues are created or modified. Requires `prompt` input. |
| `pull_request` | PR opened or updated | Automatically trigger OpenCode when PRs are opened, synchronized, or reopened. Useful for automated reviews. |
| `schedule` | Cron-based schedule | Run OpenCode on a schedule. Requires `prompt` input. Output goes to logs and PRs (no issue to comment on). |
| `workflow_dispatch` | Manual trigger from GitHub UI | Trigger OpenCode on demand via Actions tab. Requires `prompt` input. Output goes to logs and PRs. |

## Schedule Example

Run OpenCode on a schedule to perform automated tasks:

`.github/workflows/opencode-scheduled.yml`
```yaml
name: Scheduled OpenCode Task

on:
  schedule:
    - cron: "0 9 * * 1" # Every Monday at 9am UTC

jobs:
  opencode:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Run OpenCode
        uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review the codebase for any TODO comments and create a summary.
            If you find issues worth addressing, open an issue to track them.
```

For scheduled events, the `prompt` input is **required** since there's no comment to extract instructions from. Scheduled workflows run without a user context to permission-check, so the workflow must grant `contents: write` and `pull-requests: write` if you expect OpenCode to create branches or PRs.

## Pull Request Example

Automatically review PRs when they are opened or updated:

`.github/workflows/opencode-review.yml`
```yaml
name: opencode-review

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: read
      issues: read
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          use_github_token: true
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
```

For `pull_request` events, if no `prompt` is provided, OpenCode defaults to reviewing the pull request.

## Issues Triage Example

Automatically triage new issues. This example filters to accounts older than 30 days to reduce spam:

`.github/workflows/opencode-triage.yml`
```yaml
name: Issue Triage

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - name: Check account age
        id: check
        uses: actions/github-script@v7
        with:
          script: |
            const user = await github.rest.users.getByUsername({
              username: context.payload.issue.user.login
            });
            const created = new Date(user.data.created_at);
            const days = (Date.now() - created) / (1000 * 60 * 60 * 24);
            return days >= 30;
          result-encoding: string

      - uses: actions/checkout@v6
        if: steps.check.outputs.result == 'true'
        with:
          persist-credentials: false

      - uses: anomalyco/opencode/github@latest
        if: steps.check.outputs.result == 'true'
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          prompt: |
            Review this issue. If there's a clear fix or relevant docs:
            - Provide documentation links
            - Add error handling guidance for code examples
            Otherwise, do not comment.
```

For `issues` events, the `prompt` input is **required** since there's no comment to extract instructions from.

## Custom prompts

Override the default prompt to customize OpenCode's behavior for your workflow.

`.github/workflows/opencode.yml`
```yaml
- uses: anomalyco/opencode/github@latest
  with:
    model: anthropic/claude-sonnet-4-5
    prompt: |
      Review this pull request:
      - Check for code quality issues
      - Look for potential bugs
      - Suggest improvements
```

This is useful for enforcing specific review criteria, coding standards, or focus areas relevant to your project.

## Examples

Here are some examples of how you can use OpenCode in GitHub.

### Explain an issue

Add this comment in a GitHub issue:

```
/opencode explain this issue
```

OpenCode will read the entire thread, including all comments, and reply with a clear explanation.

### Fix an issue

In a GitHub issue, say:

```
/opencode fix this
```

And OpenCode will create a new branch, implement the changes, and open a PR with the changes.

### Review PRs and make changes

Leave the following comment on a GitHub PR:

```
Delete the attachment from S3 when the note is removed /oc
```

OpenCode will implement the requested change and commit it to the same PR.

### Review specific code lines

Leave a comment directly on code lines in the PR's "Files" tab. OpenCode automatically detects the file, line numbers, and diff context to provide precise responses.

```
[Comment on specific lines in Files tab]
/oc add error handling here
```

When commenting on specific lines, OpenCode receives:
- The exact file being reviewed
- The specific lines of code
- The surrounding diff context
- Line number information

This allows for more targeted requests without needing to specify file paths or line numbers manually.

# Web

Using OpenCode in your browser.

OpenCode can run as a web application in your browser, providing the same powerful AI coding experience without needing a terminal.

## Getting Started

Start the web interface by running:

**Terminal window**
```bash
opencode web
```

This starts a local server on `127.0.0.1` with a random available port and automatically opens OpenCode in your default browser.

> **Caution:**
> If `OPENCODE_SERVER_PASSWORD` is not set, the server will be unsecured. This is fine for local use but should be set for network access.

### Windows Users

For the best experience, run `opencode web` from WSL rather than PowerShell. This ensures proper file system access and terminal integration.

## Configuration

You can configure the web server using command line flags or in your config file.

### Port

By default, OpenCode picks an available port. You can specify a port:

**Terminal window**
```bash
opencode web --port 4096
```

### Hostname

By default, the server binds to `127.0.0.1` (localhost only). To make OpenCode accessible on your network:

**Terminal window**
```bash
opencode web --hostname 0.0.0.0
```

When using `0.0.0.0`, OpenCode will display both local and network addresses:

```text
  Local access:       http://localhost:4096
  Network access:     [http://192.168.1.100:4096](http://192.168.1.100:4096)
```

### mDNS Discovery

Enable mDNS to make your server discoverable on the local network:

**Terminal window**
```bash
opencode web --mdns
```

This automatically sets the hostname to `0.0.0.0` and advertises the server as `opencode.local`.

You can customize the mDNS domain name to run multiple instances on the same network:

**Terminal window**
```bash
opencode web --mdns --mdns-domain myproject.local
```

### CORS

To allow additional domains for CORS (useful for custom frontends):

**Terminal window**
```bash
opencode web --cors [https://example.com](https://example.com)
```

### Authentication

To protect access, set a password using the `OPENCODE_SERVER_PASSWORD` environment variable:

**Terminal window**
```bash
OPENCODE_SERVER_PASSWORD=secret opencode web
```

The username defaults to `opencode` but can be changed with `OPENCODE_SERVER_USERNAME`.

## Using the Web Interface

Once started, the web interface provides access to your OpenCode sessions.

### Sessions

View and manage your sessions from the homepage. You can see active sessions and start new ones.

### Server Status

Click “See Servers” to view connected servers and their status.

### Attaching a Terminal

You can attach a terminal TUI to a running web server:

**Terminal window**
```bash
# Start the web server
opencode web --port 4096

# In another terminal, attach the TUI
opencode attach http://localhost:4096
```

This allows you to use both the web interface and terminal simultaneously, sharing the same sessions and state.

## Config File

You can also configure server settings in your `opencode.json` config file:

**opencode.json**
```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "cors": ["[https://example.com](https://example.com)"]
  }
}
```

Command line flags take precedence over config file settings.

# Tools

Manage the tools an LLM can use.

Tools allow the LLM to perform actions in your codebase. OpenCode comes with a set of built-in tools, but you can extend it with custom tools or MCP servers.

By default, all tools are enabled and don’t need permission to run. You can control tool behavior through permissions.

## Configure

Use the `permission` field to control tool behavior. You can allow, deny, or require approval for each tool.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "deny",
    "bash": "ask",
    "webfetch": "allow"
  }
}
```

You can also use wildcards to control multiple tools at once. For example, to require approval for all tools from an MCP server:

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "mymcp_*": "ask"
  }
}
```

Learn more about configuring permissions.

## Built-in

Here are all the built-in tools available in OpenCode.

### bash

Execute shell commands in your project environment.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": "allow"
  }
}
```

This tool allows the LLM to run terminal commands like `npm install`, `git status`, or any other shell command.

### edit

Modify existing files using exact string replacements.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

This tool performs precise edits to files by replacing exact text matches. It’s the primary way the LLM modifies code.

### write

Create new files or overwrite existing ones.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

Use this to allow the LLM to create new files. It will overwrite existing files if they already exist.

> **Note:**
> The `write` tool is controlled by the `edit` permission, which covers all file modifications (`edit`, `write`, `apply_patch`).

### read

Read file contents from your codebase.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "read": "allow"
  }
}
```

This tool reads files and returns their contents. It supports reading specific line ranges for large files.

### grep

Search file contents using regular expressions.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "grep": "allow"
  }
}
```

Fast content search across your codebase. Supports full regex syntax and file pattern filtering.

### glob

Find files by pattern matching.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "glob": "allow"
  }
}
```

Search for files using glob patterns like `**/*.js` or `src/**/*.ts`. Returns matching file paths sorted by modification time.

### lsp (experimental)

Interact with your configured LSP servers to get code intelligence features like definitions, references, hover info, and call hierarchy.

> **Note:**
> This tool is only available when `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` (or `OPENCODE_EXPERIMENTAL=true`).

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "lsp": "allow"
  }
}
```

Supported operations include `goToDefinition`, `findReferences`, `hover`, `documentSymbol`, `workspaceSymbol`, `goToImplementation`, `prepareCallHierarchy`, `incomingCalls`, and `outgoingCalls`.

To configure which LSP servers are available for your project, see LSP Servers.

### apply_patch

Apply patches to files.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

This tool applies patch files to your codebase. Useful for applying diffs and patches from various sources.

When handling `tool.execute.before` or `tool.execute.after` hooks, check `input.tool === "apply_patch"` (not `"patch"`).

`apply_patch` uses `output.args.patchText` instead of `output.args.filePath`. Paths are embedded in marker lines within `patchText` and are relative to the project root (for example: `*** Add File: src/new-file.ts`, `*** Update File: src/existing.ts`, `*** Move to: src/renamed.ts`, `*** Delete File: src/obsolete.ts`).

> **Note:**
> The `apply_patch` tool is controlled by the `edit` permission, which covers all file modifications (`edit`, `write`, `apply_patch`).

### skill

Load a skill (a `SKILL.md` file) and return its content in the conversation.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "skill": "allow"
  }
}
```

### todowrite

Manage todo lists during coding sessions.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "todowrite": "allow"
  }
}
```

Creates and updates task lists to track progress during complex operations. The LLM uses this to organize multi-step tasks.

> **Note:**
> This tool is disabled for subagents by default, but you can enable it manually. Learn more.

### webfetch

Fetch web content.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "webfetch": "allow"
  }
}
```

Allows the LLM to fetch and read web pages. Useful for looking up documentation or researching online resources.

### websearch

Search the web for information.

> **Note:**
> This tool is only available when using the OpenCode provider or when the `OPENCODE_ENABLE_EXA` environment variable is set to any truthy value (e.g., `true` or `1`).

To enable when launching OpenCode:

**Terminal window**
```bash
OPENCODE_ENABLE_EXA=1 opencode
```

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "websearch": "allow"
  }
}
```

Performs web searches using Exa AI to find relevant information online. Useful for researching topics, finding current events, or gathering information beyond the training data cutoff.

No API key is required — the tool connects directly to Exa AI’s hosted MCP service without authentication.

> **Tip:**
> Use `websearch` when you need to find information (discovery), and `webfetch` when you need to retrieve content from a specific URL (retrieval).

### question

Ask the user questions during execution.

**opencode.json**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "question": "allow"
  }
}
```

This tool allows the LLM to ask the user questions during a task. It’s useful for:

*   Gathering user preferences or requirements
*   Clarifying ambiguous instructions
*   Getting decisions on implementation choices
*   Offering choices about what direction to take

Each question includes a header, the question text, and a list of options. Users can select from the provided options or type a custom answer. When there are multiple questions, users can navigate between them before submitting all answers.

## Custom tools

Custom tools let you define your own functions that the LLM can call. These are defined in your config file and can execute arbitrary code.

Learn more about creating custom tools.

## MCP servers

MCP (Model Context Protocol) servers allow you to integrate external tools and services. This includes database access, API integrations, and third-party services.

Learn more about configuring MCP servers.

## Internals

Internally, tools like `grep` and `glob` use ripgrep under the hood. By default, ripgrep respects `.gitignore` patterns, which means files and directories listed in your `.gitignore` will be excluded from searches and listings.

### Ignore patterns

To include files that would normally be ignored, create a `.ignore` file in your project root. This file can explicitly allow certain paths.

**.ignore**
```text
!node_modules/
!dist/
!build/
```

For example, this `.ignore` file allows ripgrep to search within `node_modules/`, `dist/`, and `build/` directories even if they’re listed in `.gitignore`.

# Rules

Set custom instructions for opencode.

You can provide custom instructions to opencode by creating an `AGENTS.md` file. This is similar to Cursor’s rules. It contains instructions that will be included in the LLM’s context to customize its behavior for your specific project.

## Initialize

To create a new `AGENTS.md` file, you can run the `/init` command in opencode.

> **Tip**
> 
> You should commit your project’s `AGENTS.md` file to Git.

`/init` scans the important files in your repo, may ask a couple of targeted questions when the codebase cannot answer them, and then creates or updates `AGENTS.md` with concise project-specific guidance.

It focuses on the things future agent sessions are most likely to need:

- build, lint, and test commands
- command order and focused verification steps when they matter
- architecture and repo structure that are not obvious from filenames alone
- project-specific conventions, setup quirks, and operational gotchas
- references to existing instruction sources like Cursor or Copilot rules

If you already have an `AGENTS.md`, `/init` will improve it in place instead of blindly replacing it.

## Example

You can also just create this file manually. Here’s an example of some things you can put into an `AGENTS.md` file.

**AGENTS.md**

```markdown
# SST v3 Monorepo Project

This is an SST v3 monorepo with TypeScript. The project uses bun workspaces for package management.

## Project Structure

- `packages/` - Contains all workspace packages (functions, core, web, etc.)
- `infra/` - Infrastructure definitions split by service (storage.ts, api.ts, web.ts)
- `sst.config.ts` - Main SST configuration with dynamic imports

## Code Standards

- Use TypeScript with strict mode enabled
- Shared code goes in `packages/core/` with proper exports configuration
- Functions go in `packages/functions/`
- Infrastructure should be split into logical files in `infra/`

## Monorepo Conventions

- Import shared modules using workspace names: `@my-app/core/example`
```

We are adding project-specific instructions here and this will be shared across your team.

## Types

opencode also supports reading the `AGENTS.md` file from multiple locations. And this serves different purposes.

### Project

Place an `AGENTS.md` in your project root for project-specific rules. These only apply when you are working in this directory or its sub-directories.

### Global

You can also have global rules in a `~/.config/opencode/AGENTS.md` file. This gets applied across all opencode sessions.

Since this isn’t committed to Git or shared with your team, we recommend using this to specify any personal rules that the LLM should follow.

## Claude Code Compatibility

For users migrating from Claude Code, OpenCode supports Claude Code’s file conventions as fallbacks:

- Project rules: `CLAUDE.md` in your project directory (used if no `AGENTS.md` exists)
- Global rules: `~/.claude/CLAUDE.md` (used if no `~/.config/opencode/AGENTS.md` exists)
- Skills: `~/.claude/skills/` — see Agent Skills for details

To disable Claude Code compatibility, set one of these environment variables:

**Terminal window**

```bash
export OPENCODE_DISABLE_CLAUDE_CODE=1        # Disable all .claude support
export OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1 # Disable only ~/.claude/CLAUDE.md
export OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1 # Disable only .claude/skills
```

## Precedence

When opencode starts, it looks for rule files in this order:

1. Local files by traversing up from the current directory (`AGENTS.md`, `CLAUDE.md`)
2. Global file at `~/.config/opencode/AGENTS.md`
3. Claude Code file at `~/.claude/CLAUDE.md` (unless disabled)

The first matching file wins in each category. For example, if you have both `AGENTS.md` and `CLAUDE.md`, only `AGENTS.md` is used. Similarly, `~/.config/opencode/AGENTS.md` takes precedence over `~/.claude/CLAUDE.md`.

## Custom Instructions

You can specify custom instruction files in your `opencode.json` or the global `~/.config/opencode/opencode.json`. This allows you and your team to reuse existing rules rather than having to duplicate them to `AGENTS.md`.

Example:

**opencode.json**

```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

You can also use remote URLs to load instructions from the web.

**opencode.json**

```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "instructions": ["[https://raw.githubusercontent.com/my-org/shared-rules/main/style.md](https://raw.githubusercontent.com/my-org/shared-rules/main/style.md)"]
}
```

Remote instructions are fetched with a 5 second timeout.

All instruction files are combined with your `AGENTS.md` files.

## Referencing External Files

While opencode doesn’t automatically parse file references in `AGENTS.md`, you can achieve similar functionality in two ways:

### Using opencode.json

The recommended approach is to use the `instructions` field in `opencode.json`:

**opencode.json**

```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "instructions": ["docs/development-standards.md", "test/testing-guidelines.md", "packages/*/AGENTS.md"]
}
```

### Manual Instructions in AGENTS.md

You can teach opencode to read external files by providing explicit instructions in your `AGENTS.md`. Here’s a practical example:

**AGENTS.md**

```markdown
# TypeScript Project Rules

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @rules/general.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For TypeScript code style and best practices: @docs/typescript-guidelines.md
For React component architecture and hooks patterns: @docs/react-patterns.md
For REST API design and error handling: @docs/api-standards.md
For testing strategies and coverage requirements: @test/testing-guidelines.md

## General Guidelines

Read the following file immediately as it's relevant to all workflows: @rules/general-guidelines.md.
```

This approach allows you to:

- Create modular, reusable rule files
- Share rules across projects via symlinks or git submodules
- Keep `AGENTS.md` concise while referencing detailed guidelines
- Ensure opencode loads files only when needed for the specific task

> **Tip**
> 
> For monorepos or projects with shared standards, using `opencode.json` with glob patterns (like `packages/*/AGENTS.md`) is more maintainable than manual instructions.

---

# Agents

Configure and use specialized agents.

Agents are specialized AI assistants that can be configured for specific tasks and workflows. They allow you to create focused tools with custom prompts, models, and tool access.

> **Tip**
> 
> Use the plan agent to analyze code and review suggestions without making any code changes.
> You can switch between agents during a session or invoke them with the `@` mention.

## Types

There are two types of agents in OpenCode; primary agents and subagents.

### Primary agents

Primary agents are the main assistants you interact with directly. You can cycle through them using the `Tab` key, or your configured `switch_agent` keybind. These agents handle your main conversation. Tool access is configured via permissions — for example, Build has all tools enabled while Plan is restricted.

> **Tip**
> 
> You can use the `Tab` key to switch between primary agents during a session.

OpenCode comes with two built-in primary agents, **Build** and **Plan**. We’ll look at these below.

### Subagents

Subagents are specialized assistants that primary agents can invoke for specific tasks. You can also manually invoke them by `@` mentioning them in your messages.

OpenCode comes with three built-in subagents, **General**, **Explore**, and **Scout**. We’ll look at this below.

## Built-in

OpenCode comes with two built-in primary agents and three built-in subagents.

### Use build
**Mode:** `primary`
Build is the **default** primary agent with all tools enabled. This is the standard agent for development work where you need full access to file operations and system commands.

### Use plan
**Mode:** `primary`
A restricted agent designed for planning and analysis. We use a permission system to give you more control and prevent unintended changes. By default, all of the following are set to `ask`:
- file edits: All writes, patches, and edits
- bash: All bash commands

This agent is useful when you want the LLM to analyze code, suggest changes, or create plans without making any actual modifications to your codebase.

### Use general
**Mode:** `subagent`
A general-purpose agent for researching complex questions and executing multi-step tasks. Has full tool access (except todo), so it can make file changes when needed. Use this to run multiple units of work in parallel.

### Use explore
**Mode:** `subagent`
A fast, read-only agent for exploring codebases. Cannot modify files. Use this when you need to quickly find files by patterns, search code for keywords, or answer questions about the codebase.

### Use scout
**Mode:** `subagent`
A read-only agent for external docs and dependency research. Use this when you need to clone a dependency repository into OpenCode’s managed cache, inspect library source, or cross-reference local code against upstream implementations without modifying your workspace.

### Use compaction
**Mode:** `primary`
Hidden system agent that compacts long context into a smaller summary. It runs automatically when needed and is not selectable in the UI.

### Use title
**Mode:** `primary`
Hidden system agent that generates short session titles. It runs automatically and is not selectable in the UI.

### Use summary
**Mode:** `primary`
Hidden system agent that creates session summaries. It runs automatically and is not selectable in the UI.

## Usage

For primary agents, use the `Tab` key to cycle through them during a session. You can also use your configured `switch_agent` keybind.

Subagents can be invoked:
- **Automatically** by primary agents for specialized tasks based on their descriptions.
- **Manually** by `@` mentioning a subagent in your message. For example:

```text
@general help me search for this function
```

**Navigation between sessions:** When subagents create child sessions, use `session_child_first` (default: `<Leader>+Down`) to enter the first child session from the parent.

Once you are in a child session, use:
- `session_child_cycle` (default: `Right`) to cycle to the next child session
- `session_child_cycle_reverse` (default: `Left`) to cycle to the previous child session
- `session_parent` (default: `Up`) to return to the parent session

This lets you switch between the main conversation and specialized subagent work.

## Configure

You can customize the built-in agents or create your own through configuration. Agents can be configured in two ways:

### JSON

Configure agents in your `opencode.json` config file:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "permission": {
        "edit": "allow",
        "bash": "allow"
      }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

### Markdown

You can also define agents using markdown files. Place them in:
- Global: `~/.config/opencode/agents/`
- Per-project: `.opencode/agents/`

**~/.config/opencode/agents/review.md**
```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

The markdown file name becomes the agent name. For example, `review.md` creates a `review` agent.

## Options

Let’s look at these configuration options in detail.

### Description

Use the `description` option to provide a brief description of what the agent does and when to use it.

**opencode.json**
```json
{
  "agent": {
    "review": {
      "description": "Reviews code for best practices and potential issues"
    }
  }
}
```

This is a **required** config option.

### Temperature

Control the randomness and creativity of the LLM’s responses with the `temperature` config.
Lower values make responses more focused and deterministic, while higher values increase creativity and variability.

**opencode.json**
```json
{
  "agent": {
    "plan": {
      "temperature": 0.1
    },
    "creative": {
      "temperature": 0.8
    }
  }
}
```

Temperature values typically range from 0.0 to 1.0:
- **0.0-0.2:** Very focused and deterministic responses, ideal for code analysis and planning
- **0.3-0.5:** Balanced responses with some creativity, good for general development tasks
- **0.6-1.0:** More creative and varied responses, useful for brainstorming and exploration

**opencode.json**
```json
{
  "agent": {
    "analyze": {
      "temperature": 0.1,
      "prompt": "{file:./prompts/analysis.txt}"
    },
    "build": {
      "temperature": 0.3
    },
    "brainstorm": {
      "temperature": 0.7,
      "prompt": "{file:./prompts/creative.txt}"
    }
  }
}
```

If no temperature is specified, OpenCode uses model-specific defaults; typically 0 for most models, 0.55 for Qwen models.

### Max steps

Control the maximum number of agentic iterations an agent can perform before being forced to respond with text only. This allows users who wish to control costs to set a limit on agentic actions.

If this is not set, the agent will continue to iterate until the model chooses to stop or the user interrupts the session.

**opencode.json**
```json
{
  "agent": {
    "quick-thinker": {
      "description": "Fast reasoning with limited iterations",
      "prompt": "You are a quick thinker. Solve problems with minimal steps.",
      "steps": 5
    }
  }
}
```

When the limit is reached, the agent receives a special system prompt instructing it to respond with a summarization of its work and recommended remaining tasks.

> **Caution**
> 
> The legacy `maxSteps` field is deprecated. Use `steps` instead.

### Disable

Set to `true` to disable the agent.

**opencode.json**
```json
{
  "agent": {
    "review": {
      "disable": true
    }
  }
}
```

### Prompt

Specify a custom system prompt file for this agent with the `prompt` config. The prompt file should contain instructions specific to the agent’s purpose.

**opencode.json**
```json
{
  "agent": {
    "review": {
      "prompt": "{file:./prompts/code-review.txt}"
    }
  }
}
```

This path is relative to where the config file is located. So this works for both the global OpenCode config and the project specific config.

### Model

Use the `model` config to override the model for this agent. Useful for using different models optimized for different tasks. For example, a faster model for planning, a more capable model for implementation.

> **Tip**
> 
> If you don’t specify a model, primary agents use the model globally configured while subagents will use the model of the primary agent that invoked the subagent.

**opencode.json**
```json
{
  "agent": {
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514"
    }
  }
}
```

The model ID in your OpenCode config uses the format `provider/model-id`. For example, if you’re using OpenCode Zen, you would use `opencode/gpt-5.1-codex` for GPT 5.1 Codex.

### Tools (deprecated)

`tools` is **deprecated**. Prefer the agent’s `permission` field for new configs, updates and more fine-grained control.

Allows you to control which tools are available in this agent. You can enable or disable specific tools by setting them to `true` or `false`. In an agent’s `tools` config, `true` is equivalent to `{"*": "allow"}` permission and `false` is equivalent to `{"*": "deny"}` permission.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "tools": {
    "write": true,
    "bash": true
  },
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "bash": false
      }
    }
  }
}
```

> **Note**
> 
> The agent-specific config overrides the global config.

You can also use wildcards in legacy `tools` entries to control multiple tools at once. For example, to disable all tools from an MCP server:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "readonly": {
      "tools": {
        "mymcp_*": false,
        "write": false,
        "edit": false
      }
    }
  }
}
```

Learn more about tools.

### Permissions

You can configure permissions to manage what actions an agent can take. Each permission key can be set to:
- `"ask"` — Prompt for approval before running the tool
- `"allow"` — Allow all operations without approval
- `"deny"` — Disable the tool

The available permission keys are:

| Key | Tools it gates |
|---|---|
| `read` | `read` |
| `edit` | `write`, `edit`, `apply_patch` |
| `glob` | `glob` |
| `grep` | `grep` |
| `list` | `list` |
| `bash` | `bash` |
| `task` | `task` |
| `external_directory` | Any tool that reads or writes files outside the project worktree |
| `todo` | `todowrite`, `todoread` |
| `webfetch` | `webfetch` |
| `websearch` | `websearch` |
| `lsp` | `lsp` |
| `skill` | `skill` |
| `question` | `question` |
| `doom_loop` | Recovery prompts when an agent appears stuck |

`read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `external_directory`, `lsp`, and `skill` accept either a shorthand action (`"allow"` | `"ask"` | `"deny"`) or an object of glob/pattern → action for fine-grained control. The remaining keys accept the shorthand action only.

> **Note**
> 
> Permission keys are matched as wildcard patterns against the underlying tool name, so the same syntax works for built-ins, custom tools, and MCP tools — for example `"mymcp_*": "deny"` denies every tool from an MCP server, and `"mymcp_search": "ask"` targets a single one.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "edit": "deny"
  }
}
```

You can override these permissions per agent.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "edit": "deny"
  },
  "agent": {
    "build": {
      "permission": {
        "edit": "ask"
      }
    }
  }
}
```

You can also set permissions in Markdown agents.

**~/.config/opencode/agents/review.md**
```markdown
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
    "grep *": allow
  webfetch: deny
---

Only analyze code and suggest changes.
```

You can set permissions for specific bash commands.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git push": "ask",
          "grep *": "allow"
        }
      }
    }
  }
}
```

This can take a glob pattern.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git *": "ask"
        }
      }
    }
  }
}
```

And you can also use the `*` wildcard to manage permissions for all commands. Since the last matching rule takes precedence, put the `*` wildcard first and specific rules after.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git status *": "allow"
        }
      }
    }
  }
}
```

Learn more about permissions.

### Mode

Control the agent’s mode with the `mode` config. The `mode` option is used to determine how the agent can be used.

**opencode.json**
```json
{
  "agent": {
    "review": {
      "mode": "subagent"
    }
  }
}
```

The `mode` option can be set to `primary`, `subagent`, or `all`. If no `mode` is specified, it defaults to `all`.

### Hidden

Hide a subagent from the `@` autocomplete menu with `hidden: true`. Useful for internal subagents that should only be invoked programmatically by other agents via the Task tool.

**opencode.json**
```json
{
  "agent": {
    "internal-helper": {
      "mode": "subagent",
      "hidden": true
    }
  }
}
```

This only affects user visibility in the autocomplete menu. Hidden agents can still be invoked by the model via the Task tool if permissions allow.

> **Note**
> 
> Only applies to `mode: subagent` agents.

### Task permissions

Control which subagents an agent can invoke via the Task tool with `permission.task`. Uses glob patterns for flexible matching.

**opencode.json**
```json
{
  "agent": {
    "orchestrator": {
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

When set to `deny`, the subagent is removed from the Task tool description entirely, so the model won’t attempt to invoke it.

> **Tip**
> 
> Rules are evaluated in order, and the **last matching rule wins**. In the example above, `orchestrator-planner` matches both `*` (deny) and `orchestrator-*` (allow), but since `orchestrator-*` comes after `*`, the result is `allow`.

> **Tip**
> 
> Users can always invoke any subagent directly via the `@` autocomplete menu, even if the agent’s task permissions would deny it.

### Color

Customize the agent’s visual appearance in the UI with the `color` option. This affects how the agent appears in the interface.

Use a valid hex color (e.g., `#FF5733`) or theme color: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`.

**opencode.json**
```json
{
  "agent": {
    "creative": {
      "color": "#ff6b6b"
    },
    "code-reviewer": {
      "color": "accent"
    }
  }
}
```

### Top P

Control response diversity with the `top_p` option. Alternative to temperature for controlling randomness.

**opencode.json**
```json
{
  "agent": {
    "brainstorm": {
      "top_p": 0.9
    }
  }
}
```

Values range from 0.0 to 1.0. Lower values are more focused, higher values more diverse.

### Additional

Any other options you specify in your agent configuration will be **passed through directly** to the provider as model options. This allows you to use provider-specific features and parameters.

For example, with OpenAI’s reasoning models, you can control the reasoning effort:

**opencode.json**
```json
{
  "agent": {
    "deep-thinker": {
      "description": "Agent that uses high reasoning effort for complex problems",
      "model": "openai/gpt-5",
      "reasoningEffort": "high",
      "textVerbosity": "low"
    }
  }
}
```

These additional options are model and provider-specific. Check your provider’s documentation for available parameters.

> **Tip**
> 
> Run `opencode models` to see a list of the available models.

## Create agents

You can create new agents using the following command:

**Terminal window**
```bash
opencode agent create
```

This interactive command will:
1. Ask where to save the agent; global or project-specific.
2. Description of what the agent should do.
3. Generate an appropriate system prompt and identifier.
4. Let you select which permissions the agent should be allowed (anything you don’t select is denied).
5. Finally, create a markdown file with the agent configuration.

## Use cases

Here are some common use cases for different agents:
- **Build agent:** Full development work with all tools enabled
- **Plan agent:** Analysis and planning without making changes
- **Review agent:** Code review with read-only access plus documentation tools
- **Debug agent:** Focused on investigation with bash and read tools enabled
- **Docs agent:** Documentation writing with file operations but no system commands

## Examples

Here are some example agents you might find useful.

> **Tip**
> 
> Do you have an agent you’d like to share? Submit a PR.

### Documentation agent

**~/.config/opencode/agents/docs-writer.md**
```markdown
---
description: Writes and maintains project documentation
mode: subagent
permission:
  bash: deny
---

You are a technical writer. Create clear, comprehensive documentation.

Focus on:

- Clear explanations
- Proper structure
- Code examples
- User-friendly language
```

### Security auditor

**~/.config/opencode/agents/security-auditor.md**
```markdown
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
permission:
  edit: deny
---

You are a security expert. Focus on identifying potential security issues.

Look for:

- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
```

# Models

Configuring an LLM provider and model.

OpenCode uses the AI SDK and Models.dev to support 75+ LLM providers and it supports running local models.

## Providers

Most popular providers are preloaded by default. If you’ve added the credentials for a provider through the `/connect` command, they’ll be available when you start OpenCode.
Learn more about providers.

## Select a model

Once you’ve configured your provider you can select the model you want by typing in:
`/models`

## Recommended models

There are a lot of models out there, with new models coming out every week.

> **Tip**
> 
> Consider using one of the models we recommend.

However, there are only a few of them that are good at both generating code and tool calling.
Here are several models that work well with OpenCode, in no particular order. (This is not an exhaustive list nor is it necessarily up to date):

- GPT 5.2
- GPT 5.1 Codex
- Claude Opus 4.5
- Claude Sonnet 4.5
- Minimax M2.1
- Gemini 3 Pro

## Set a default

To set one of these as the default model, you can set the `model` key in your OpenCode config.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "model": "lmstudio/google/gemma-3n-e4b"
}
```

Here the full ID is `provider_id/model_id`. For example, if you’re using OpenCode Zen, you would use `opencode/gpt-5.1-codex` for GPT 5.1 Codex.
If you’ve configured a custom provider, the `provider_id` is key from the `provider` part of your config, and the `model_id` is the key from `provider.models`.

## Configure models

You can globally configure a model’s options through the config.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "options": {
            "reasoningEffort": "high",
            "textVerbosity": "low",
            "reasoningSummary": "auto",
            "include": ["reasoning.encrypted_content"]
          }
        }
      }
    },
    "anthropic": {
      "models": {
        "claude-sonnet-4-5-20250929": {
          "options": {
            "thinking": {
              "type": "enabled",
              "budgetTokens": 16000
            }
          }
        }
      }
    }
  }
}
```

Here we’re configuring global settings for two built-in models: `gpt-5` when accessed via the `openai` provider, and `claude-sonnet-4-20250514` when accessed via the `anthropic` provider. The built-in provider and model names can be found on Models.dev.

You can also configure these options for any agents that you are using. The agent config overrides any global options here. Learn more.

You can also define custom variants that extend built-in ones. Variants let you configure different settings for the same model without creating duplicate entries:

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {
    "opencode": {
      "models": {
        "gpt-5": {
          "variants": {
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "low",
              "reasoningSummary": "auto"
            },
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto"
            }
          }
        }
      }
    }
  }
}
```

## Variants

Many models support multiple variants with different configurations. OpenCode ships with built-in default variants for popular providers.

### Built-in variants

OpenCode ships with default variants for many providers:

**Anthropic:**
- `high` - High thinking budget (default)
- `max` - Maximum thinking budget

**OpenAI:**
Varies by model but roughly:
- `none` - No reasoning
- `minimal` - Minimal reasoning effort
- `low` - Low reasoning effort
- `medium` - Medium reasoning effort
- `high` - High reasoning effort
- `xhigh` - Extra high reasoning effort

**Google:**
- `low` - Lower effort/token budget
- `high` - Higher effort/token budget

> **Tip**
> 
> This list is not comprehensive. Many other providers have built-in defaults too.

### Custom variants

You can override existing variants or add your own:

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "variants": {
            "thinking": {
              "reasoningEffort": "high",
              "textVerbosity": "low"
            },
            "fast": {
              "disabled": true
            }
          }
        }
      }
    }
  }
}
```

### Cycle variants

Use the keybind `variant_cycle` to quickly switch between variants. Learn more.

## Loading models

When OpenCode starts up, it checks for models in the following priority order:

1. The `--model` or `-m` command line flag. The format is the same as in the config file: `provider_id/model_id`.
2. The model list in the OpenCode config.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "model": "anthropic/claude-sonnet-4-20250514"
}
```

The format here is `provider/model`.

3. The last used model.
4. The first model using an internal priority.

# Themes

Select a built-in theme or define your own.

With OpenCode you can select from one of several built-in themes, use a theme that adapts to your terminal theme, or define your own custom theme.
By default, OpenCode uses our own `opencode` theme.

## Terminal requirements

For themes to display correctly with their full color palette, your terminal must support **truecolor** (24-bit color). Most modern terminals support this by default, but you may need to enable it:

- **Check support:** Run `echo $COLORTERM` - it should output `truecolor` or `24bit`
- **Enable truecolor:** Set the environment variable `COLORTERM=truecolor` in your shell profile
- **Terminal compatibility:** Ensure your terminal emulator supports 24-bit color (most modern terminals like iTerm2, Alacritty, Kitty, Windows Terminal, and recent versions of GNOME Terminal do)

Without truecolor support, themes may appear with reduced color accuracy or fall back to the nearest 256-color approximation.

## Built-in themes

OpenCode comes with several built-in themes.

| Name | Description |
|---|---|
| `system` | Adapts to your terminal’s background color |
| `tokyonight` | Based on the Tokyonight theme |
| `everforest` | Based on the Everforest theme |
| `ayu` | Based on the Ayu dark theme |
| `catppuccin` | Based on the Catppuccin theme |
| `catppuccin-macchiato` | Based on the Catppuccin theme |
| `gruvbox` | Based on the Gruvbox theme |
| `kanagawa` | Based on the Kanagawa theme |
| `nord` | Based on the Nord theme |
| `matrix` | Hacker-style green on black theme |
| `one-dark` | Based on the Atom One Dark theme |

And more, we are constantly adding new themes.

## System theme

The `system` theme is designed to automatically adapt to your terminal’s color scheme. Unlike traditional themes that use fixed colors, the `system` theme:

- **Generates gray scale:** Creates a custom gray scale based on your terminal’s background color, ensuring optimal contrast.
- **Uses ANSI colors:** Leverages standard ANSI colors (0-15) for syntax highlighting and UI elements, which respect your terminal’s color palette.
- **Preserves terminal defaults:** Uses `none` for text and background colors to maintain your terminal’s native appearance.

The system theme is for users who:
- Want OpenCode to match their terminal’s appearance
- Use custom terminal color schemes
- Prefer a consistent look across all terminal applications

## Using a theme

You can select a theme by bringing up the theme select with the `/theme` command. Or you can specify it in `tui.json`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "theme": "tokyonight"
}
```

## Custom themes

OpenCode supports a flexible JSON-based theme system that allows users to create and customize themes easily.

### Hierarchy

Themes are loaded from multiple directories in the following order where later directories override earlier ones:
1. **Built-in themes** - These are embedded in the binary
2. **User config directory** - Defined in `~/.config/opencode/themes/*.json` or `$XDG_CONFIG_HOME/opencode/themes/*.json`
3. **Project root directory** - Defined in `<project-root>/.opencode/themes/*.json`
4. **Current working directory** - Defined in `./.opencode/themes/*.json`

If multiple directories contain a theme with the same name, the theme from the directory with higher priority will be used.

### Creating a theme

To create a custom theme, create a JSON file in one of the theme directories.

For user-wide themes:

**Terminal window**
```bash
mkdir -p ~/.config/opencode/themes
vim ~/.config/opencode/themes/my-theme.json
```

And for project-specific themes:

**Terminal window**
```bash
mkdir -p .opencode/themes
vim .opencode/themes/my-theme.json
```

### JSON format

Themes use a flexible JSON format with support for:
- **Hex colors:** `"#ffffff"`
- **ANSI colors:** `3` (0-255)
- **Color references:** `"primary"` or custom definitions
- **Dark/light variants:** `{"dark": "#000", "light": "#fff"}`
- **No color:** `"none"` - Uses the terminal’s default color or transparent

### Color definitions

The `defs` section is optional and it allows you to define reusable colors that can be referenced in the theme.

### Terminal defaults

The special value `"none"` can be used for any color to inherit the terminal’s default color. This is particularly useful for creating themes that blend seamlessly with your terminal’s color scheme:
- `"text": "none"` - Uses terminal’s default foreground color
- `"background": "none"` - Uses terminal’s default background color

## Example

Here’s an example of a custom theme:

**my-theme.json**
```json
{
  "$schema": "[https://opencode.ai/theme.json](https://opencode.ai/theme.json)",
  "defs": {
    "nord0": "#2E3440",
    "nord1": "#3B4252",
    "nord2": "#434C5E",
    "nord3": "#4C566A",
    "nord4": "#D8DEE9",
    "nord5": "#E5E9F0",
    "nord6": "#ECEFF4",
    "nord7": "#8FBCBB",
    "nord8": "#88C0D0",
    "nord9": "#81A1C1",
    "nord10": "#5E81AC",
    "nord11": "#BF616A",
    "nord12": "#D08770",
    "nord13": "#EBCB8B",
    "nord14": "#A3BE8C",
    "nord15": "#B48EAD"
  },
  "theme": {
    "primary": {
      "dark": "nord8",
      "light": "nord10"
    },
    "secondary": {
      "dark": "nord9",
      "light": "nord9"
    },
    "accent": {
      "dark": "nord7",
      "light": "nord7"
    },
    "error": {
      "dark": "nord11",
      "light": "nord11"
    },
    "warning": {
      "dark": "nord12",
      "light": "nord12"
    },
    "success": {
      "dark": "nord14",
      "light": "nord14"
    },
    "info": {
      "dark": "nord8",
      "light": "nord10"
    },
    "text": {
      "dark": "nord4",
      "light": "nord0"
    },
    "textMuted": {
      "dark": "nord3",
      "light": "nord1"
    },
    "background": {
      "dark": "nord0",
      "light": "nord6"
    },
    "backgroundPanel": {
      "dark": "nord1",
      "light": "nord5"
    },
    "backgroundElement": {
      "dark": "nord1",
      "light": "nord4"
    },
    "border": {
      "dark": "nord2",
      "light": "nord3"
    },
    "borderActive": {
      "dark": "nord3",
      "light": "nord2"
    },
    "borderSubtle": {
      "dark": "nord2",
      "light": "nord3"
    },
    "diffAdded": {
      "dark": "nord14",
      "light": "nord14"
    },
    "diffRemoved": {
      "dark": "nord11",
      "light": "nord11"
    },
    "diffContext": {
      "dark": "nord3",
      "light": "nord3"
    },
    "diffHunkHeader": {
      "dark": "nord3",
      "light": "nord3"
    },
    "diffHighlightAdded": {
      "dark": "nord14",
      "light": "nord14"
    },
    "diffHighlightRemoved": {
      "dark": "nord11",
      "light": "nord11"
    },
    "diffAddedBg": {
      "dark": "#3B4252",
      "light": "#E5E9F0"
    },
    "diffRemovedBg": {
      "dark": "#3B4252",
      "light": "#E5E9F0"
    },
    "diffContextBg": {
      "dark": "nord1",
      "light": "nord5"
    },
    "diffLineNumber": {
      "dark": "nord2",
      "light": "nord4"
    },
    "diffAddedLineNumberBg": {
      "dark": "#3B4252",
      "light": "#E5E9F0"
    },
    "diffRemovedLineNumberBg": {
      "dark": "#3B4252",
      "light": "#E5E9F0"
    },
    "markdownText": {
      "dark": "nord4",
      "light": "nord0"
    },
    "markdownHeading": {
      "dark": "nord8",
      "light": "nord10"
    },
    "markdownLink": {
      "dark": "nord9",
      "light": "nord9"
    },
    "markdownLinkText": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownCode": {
      "dark": "nord14",
      "light": "nord14"
    },
    "markdownBlockQuote": {
      "dark": "nord3",
      "light": "nord3"
    },
    "markdownEmph": {
      "dark": "nord12",
      "light": "nord12"
    },
    "markdownStrong": {
      "dark": "nord13",
      "light": "nord13"
    },
    "markdownHorizontalRule": {
      "dark": "nord3",
      "light": "nord3"
    },
    "markdownListItem": {
      "dark": "nord8",
      "light": "nord10"
    },
    "markdownListEnumeration": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownImage": {
      "dark": "nord9",
      "light": "nord9"
    },
    "markdownImageText": {
      "dark": "nord7",
      "light": "nord7"
    },
    "markdownCodeBlock": {
      "dark": "nord4",
      "light": "nord0"
    },
    "syntaxComment": {
      "dark": "nord3",
      "light": "nord3"
    },
    "syntaxKeyword": {
      "dark": "nord9",
      "light": "nord9"
    },
    "syntaxFunction": {
      "dark": "nord8",
      "light": "nord8"
    },
    "syntaxVariable": {
      "dark": "nord7",
      "light": "nord7"
    },
    "syntaxString": {
      "dark": "nord14",
      "light": "nord14"
    },
    "syntaxNumber": {
      "dark": "nord15",
      "light": "nord15"
    },
    "syntaxType": {
      "dark": "nord7",
      "light": "nord7"
    },
    "syntaxOperator": {
      "dark": "nord9",
      "light": "nord9"
    },
    "syntaxPunctuation": {
      "dark": "nord4",
      "light": "nord0"
    }
  }
}
```

# Keybinds

Customize your keybinds.

OpenCode has a list of keybinds that you can customize through `tui.json`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "leader_timeout": 2000,
  "keybinds": {
    "leader": "ctrl+x",
    "app_exit": "ctrl+c,ctrl+d,<leader>q",
    "app_debug": "none",
    "app_console": "none",
    "app_heap_snapshot": "none",
    "app_toggle_animations": "none",
    "app_toggle_file_context": "none",
    "app_toggle_diffwrap": "none",
    "app_toggle_paste_summary": "none",
    "app_toggle_session_directory_filter": "none",
    "command_list": "ctrl+p",
    "help_show": "none",
    "docs_open": "none",

    "editor_open": "<leader>e",
    "theme_list": "<leader>t",
    "theme_switch_mode": "none",
    "theme_mode_lock": "none",
    "sidebar_toggle": "<leader>b",
    "scrollbar_toggle": "none",
    "status_view": "<leader>s",

    "session_export": "<leader>x",
    "session_copy": "none",
    "session_new": "<leader>n",
    "session_list": "<leader>l",
    "session_timeline": "<leader>g",
    "session_fork": "none",
    "session_rename": "ctrl+r",
    "session_delete": "ctrl+d",
    "session_share": "none",
    "session_unshare": "none",
    "session_interrupt": "escape",
    "session_compact": "<leader>c",
    "session_toggle_timestamps": "none",
    "session_toggle_generic_tool_output": "none",
    "session_child_first": "<leader>down",
    "session_child_cycle": "right",
    "session_child_cycle_reverse": "left",
    "session_parent": "up",

    "stash_delete": "ctrl+d",
    "model_provider_list": "ctrl+a",
    "model_favorite_toggle": "ctrl+f",
    "model_list": "<leader>m",
    "model_cycle_recent": "f2",
    "model_cycle_recent_reverse": "shift+f2",
    "model_cycle_favorite": "none",
    "model_cycle_favorite_reverse": "none",
    "mcp_list": "none",
    "provider_connect": "none",
    "console_org_switch": "none",
    "agent_list": "<leader>a",
    "agent_cycle": "tab",
    "agent_cycle_reverse": "shift+tab",
    "variant_cycle": "ctrl+t",
    "variant_list": "none",

    "messages_page_up": "pageup,ctrl+alt+b",
    "messages_page_down": "pagedown,ctrl+alt+f",
    "messages_line_up": "ctrl+alt+y",
    "messages_line_down": "ctrl+alt+e",
    "messages_half_page_up": "ctrl+alt+u",
    "messages_half_page_down": "ctrl+alt+d",
    "messages_first": "ctrl+g,home",
    "messages_last": "ctrl+alt+g,end",
    "messages_next": "none",
    "messages_previous": "none",
    "messages_last_user": "none",
    "messages_copy": "<leader>y",
    "messages_undo": "<leader>u",
    "messages_redo": "<leader>r",
    "messages_toggle_conceal": "<leader>h",
    "tool_details": "none",
    "display_thinking": "none",

    "prompt_submit": "none",
    "prompt_editor_context_clear": "none",
    "prompt_skills": "none",
    "prompt_stash": "none",
    "prompt_stash_pop": "none",
    "prompt_stash_list": "none",
    "workspace_set": "none",

    "input_clear": "ctrl+c",
    "input_paste": {
      "key": "ctrl+v",
      "preventDefault": false
    },
    "input_submit": "return",
    "input_newline": "shift+return,ctrl+return,alt+return,ctrl+j",
    "input_move_left": "left,ctrl+b",
    "input_move_right": "right,ctrl+f",
    "input_move_up": "up",
    "input_move_down": "down",
    "input_select_left": "shift+left",
    "input_select_right": "shift+right",
    "input_select_up": "shift+up",
    "input_select_down": "shift+down",
    "input_line_home": "ctrl+a",
    "input_line_end": "ctrl+e",
    "input_select_line_home": "ctrl+shift+a",
    "input_select_line_end": "ctrl+shift+e",
    "input_visual_line_home": "alt+a",
    "input_visual_line_end": "alt+e",
    "input_select_visual_line_home": "alt+shift+a",
    "input_select_visual_line_end": "alt+shift+e",
    "input_buffer_home": "home",
    "input_buffer_end": "end",
    "input_select_buffer_home": "shift+home",
    "input_select_buffer_end": "shift+end",
    "input_delete_line": "ctrl+shift+d",
    "input_delete_to_line_end": "ctrl+k",
    "input_delete_to_line_start": "ctrl+u",
    "input_backspace": "backspace,shift+backspace",
    "input_delete": "ctrl+d,delete,shift+delete",
    "input_undo": "ctrl+-,super+z",
    "input_redo": "ctrl+.,super+shift+z",
    "input_word_forward": "alt+f,alt+right,ctrl+right",
    "input_word_backward": "alt+b,alt+left,ctrl+left",
    "input_select_word_forward": "alt+shift+f,alt+shift+right",
    "input_select_word_backward": "alt+shift+b,alt+shift+left",
    "input_delete_word_forward": "alt+d,alt+delete,ctrl+delete",
    "input_delete_word_backward": "ctrl+w,ctrl+backspace,alt+backspace",
    "input_select_all": "super+a",
    "history_previous": "up",
    "history_next": "down",

    "dialog.select.prev": "up,ctrl+p",
    "dialog.select.next": "down,ctrl+n",
    "dialog.select.page_up": "pageup",
    "dialog.select.page_down": "pagedown",
    "dialog.select.home": "home",
    "dialog.select.end": "end",
    "dialog.select.submit": "return",
    "dialog.mcp.toggle": "space",
    "prompt.autocomplete.prev": "up,ctrl+p",
    "prompt.autocomplete.next": "down,ctrl+n",
    "prompt.autocomplete.hide": "escape",
    "prompt.autocomplete.select": "return",
    "prompt.autocomplete.complete": "tab",
    "permission.prompt.fullscreen": "ctrl+f",
    "plugins.toggle": "space",
    "dialog.plugins.install": "shift+i",

    "terminal_suspend": "ctrl+z",
    "terminal_title_toggle": "none",
    "tips_toggle": "<leader>h",
    "plugin_manager": "none",
    "plugin_install": "none",

    "which_key_toggle": "ctrl+alt+k",
    "which_key_layout_toggle": "ctrl+alt+shift+k",
    "which_key_pending_toggle": "ctrl+alt+shift+p",
    "which_key_group_previous": "ctrl+alt+left,ctrl+alt+[",
    "which_key_group_next": "ctrl+alt+right,ctrl+alt+]",
    "which_key_scroll_up": "ctrl+alt+up,ctrl+alt+p",
    "which_key_scroll_down": "ctrl+alt+down,ctrl+alt+n",
    "which_key_page_up": "ctrl+alt+pageup",
    "which_key_page_down": "ctrl+alt+pagedown",
    "which_key_home": "ctrl+alt+home",
    "which_key_end": "ctrl+alt+end"
  }
}
```

> **Note**
> 
> On Windows, the defaults for `input_undo` and `terminal_suspend` are different:
> - `input_undo` defaults to `ctrl+z,ctrl+-,super+z` when it is not explicitly configured. The `ctrl+z` binding is added because Windows terminals do not support POSIX suspend.
> - `terminal_suspend` is forced to `none` because native Windows terminals do not support POSIX suspend.

## Leader Key

OpenCode uses a `leader` key for many keybinds. This avoids conflicts in your terminal.

By default, `ctrl+x` is the leader key and many actions require you to first press the leader key and then the shortcut. For example, to start a new session you first press `ctrl+x` and then press `n`.

You don’t need to use a leader key for your keybinds but we recommend doing so.

Some navigation keybinds intentionally do not use the leader key by default. For subagent sessions, the defaults are `session_child_first` = `<leader>down`, `session_child_cycle` = `right`, `session_child_cycle_reverse` = `left`, and `session_parent` = `up`.

`leader_timeout` controls how long OpenCode waits for the next key after the leader key. It defaults to `2000` milliseconds.

## Binding Values

A string can contain one shortcut or multiple comma-separated shortcuts. You can also use an array for multiple shortcuts.

For advanced cases, use an object with `key`, `event`, `preventDefault`, or `fallthrough`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "keybinds": {
    "messages_copy": ["<leader>y", "ctrl+shift+c"],
    "input_paste": {
      "key": "ctrl+v",
      "preventDefault": false
    }
  }
}
```

## Disable Keybind

You can disable a keybind by adding the key to `tui.json` with a value of `"none"` or `false`.

**tui.json**
```json
{
  "$schema": "[https://opencode.ai/tui.json](https://opencode.ai/tui.json)",
  "keybinds": {
    "session_compact": "none"
  }
}
```

## Desktop Prompt Shortcuts

The OpenCode desktop app prompt input supports common Readline/Emacs-style shortcuts for editing text. These are built-in and currently not configurable via `opencode.json`.

| Shortcut | Action |
|---|---|
| `ctrl+a` | Move to start of current line |
| `ctrl+e` | Move to end of current line |
| `ctrl+b` | Move cursor back one character |
| `ctrl+f` | Move cursor forward one character |
| `alt+b` | Move cursor back one word |
| `alt+f` | Move cursor forward one word |
| `ctrl+d` | Delete character under cursor |
| `ctrl+k` | Kill to end of line |
| `ctrl+u` | Kill to start of line |
| `ctrl+w` | Kill previous word |
| `alt+d` | Kill next word |
| `ctrl+t` | Transpose characters |
| `ctrl+g` | Cancel popovers / abort running response |

## Shift+Enter

Some terminals don’t send modifier keys with Enter by default. You may need to configure your terminal to send `Shift+Enter` as an escape sequence.

### Windows Terminal

Open your `settings.json` at:
`%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json`

Add this to the root-level `actions` array:
```json
"actions": [
  {
    "command": {
      "action": "sendInput",
      "input": "\u001b[13;2u"
    },
    "id": "User.sendInput.ShiftEnterCustom"
  }
]
```

Add this to the root-level `keybindings` array:
```json
"keybindings": [
  {
    "keys": "shift+enter",
    "id": "User.sendInput.ShiftEnterCustom"
  }
]
```

Save the file and restart Windows Terminal or open a new tab.

# Commands

Create custom commands for repetitive tasks.

Custom commands let you specify a prompt you want to run when that command is executed in the TUI.

```text
/my-command
```

Custom commands are in addition to the built-in commands like `/init`, `/undo`, `/redo`, `/share`, `/help`. Learn more.

## Create command files

Create markdown files in the `commands/` directory to define custom commands.

Create `.opencode/commands/test.md`:

**.opencode/commands/test.md**
```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

The frontmatter defines command properties. The content becomes the template.

Use the command by typing `/` followed by the command name.

```text
/test
```

## Configure

You can add custom commands through the OpenCode config or by creating markdown files in the `commands/` directory.

### JSON

Use the `command` option in your OpenCode config:

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "command": {
    // This becomes the name of the command
    "test": {
      // This is the prompt that will be sent to the LLM
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      // This is shown as the description in the TUI
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

Now you can run this command in the TUI:

```text
/test
```

### Markdown

You can also define commands using markdown files. Place them in:
- Global: `~/.config/opencode/commands/`
- Per-project: `.opencode/commands/`

**~/.config/opencode/commands/test.md**
```markdown
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

The markdown file name becomes the command name. For example, `test.md` lets you run:

```text
/test
```

## Prompt config

The prompts for the custom commands support several special placeholders and syntax.

### Arguments

Pass arguments to commands using the `$ARGUMENTS` placeholder.

**.opencode/commands/component.md**
```markdown
---
description: Create a new component
---

Create a new React component named $ARGUMENTS with TypeScript support.
Include proper typing and basic structure.
```

Run the command with arguments:

```text
/component Button
```

And `$ARGUMENTS` will be replaced with `Button`.

You can also access individual arguments using positional parameters:
- `$1` - First argument
- `$2` - Second argument
- `$3` - Third argument

And so on…

For example:

**.opencode/commands/create-file.md**
```markdown
---
description: Create a new file with content
---

Create a file named $1 in the directory $2
with the following content: $3
```

Run the command:

```text
/create-file config.json src "{ \"key\": \"value\" }"
```

This replaces:
- `$1` with `config.json`
- `$2` with `src`
- `$3` with `{ "key": "value" }`

### Shell output

Use `!command` to inject bash command output into your prompt.

For example, to create a custom command that analyzes test coverage:

**.opencode/commands/analyze-coverage.md**
```markdown
---
description: Analyze test coverage
---

Here are the current test results:
!`npm test`

Based on these results, suggest improvements to increase coverage.
```

Or to review recent changes:

**.opencode/commands/review-changes.md**
```markdown
---
description: Review recent changes
---

Recent git commits:
!`git log --oneline -10`

Review these changes and suggest any improvements.
```

Commands run in your project’s root directory and their output becomes part of the prompt.

### File references

Include files in your command using `@` followed by the filename.

**.opencode/commands/review-component.md**
```markdown
---
description: Review component
---

Review the component in @src/components/Button.tsx.
Check for performance issues and suggest improvements.
```

The file content gets included in the prompt automatically.

## Options

Let’s look at the configuration options in detail.

### Template

The `template` option defines the prompt that will be sent to the LLM when the command is executed.

**opencode.json**
```json
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes."
    }
  }
}
```

This is a **required** config option.

### Description

Use the `description` option to provide a brief description of what the command does.

**opencode.json**
```json
{
  "command": {
    "test": {
      "description": "Run tests with coverage"
    }
  }
}
```

This is shown as the description in the TUI when you type in the command.

### Agent

Use the `agent` config to optionally specify which agent should execute this command. If this is a subagent the command will trigger a subagent invocation by default. To disable this behavior, set `subtask` to `false`.

**opencode.json**
```json
{
  "command": {
    "review": {
      "agent": "plan"
    }
  }
}
```

This is an **optional** config option. If not specified, defaults to your current agent.

### Subtask

Use the `subtask` boolean to force the command to trigger a subagent invocation. This is useful if you want the command to not pollute your primary context and will force the agent to act as a subagent, even if `mode` is set to `primary` on the agent configuration.

**opencode.json**
```json
{
  "command": {
    "analyze": {
      "subtask": true
    }
  }
}
```

This is an **optional** config option.

### Model

Use the `model` config to override the default model for this command.

**opencode.json**
```json
{
  "command": {
    "analyze": {
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

This is an **optional** config option.

## Built-in

opencode includes several built-in commands like `/init`, `/undo`, `/redo`, `/share`, `/help`; learn more.

> **Note**
> 
> Custom commands can override built-in commands.
> If you define a custom command with the same name, it will override the built-in command.

# Formatters

OpenCode uses language specific formatters.

OpenCode can format files after they are written or edited using language-specific formatters. Formatters are disabled by default; enable them in your config before OpenCode will run them.

## Built-in

OpenCode comes with several built-in formatters for popular languages and frameworks. Below is a list of the formatters, supported file extensions, and commands or config options it needs.

| Formatter | Extensions | Requirements |
|---|---|---|
| `air` | .R | `air` command available |
| `biome` | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml, and more | `biome.json(c)` config file |
| `cargofmt` | .rs | `cargo fmt` command available |
| `clang-format` | .c, .cpp, .h, .hpp, .ino, and more | `.clang-format` config file |
| `cljfmt` | .clj, .cljs, .cljc, .edn | `cljfmt` command available |
| `dart` | .dart | `dart` command available |
| `dfmt` | .d | `dfmt` command available |
| `gleam` | .gleam | `gleam` command available |
| `gofmt` | .go | `gofmt` command available |
| `htmlbeautifier` | .erb, .html.erb | `htmlbeautifier` command available |
| `ktlint` | .kt, .kts | `ktlint` command available |
| `mix` | .ex, .exs, .eex, .heex, .leex, .neex, .sface | `mix` command available |
| `nixfmt` | .nix | `nixfmt` command available |
| `ocamlformat` | .ml, .mli | `ocamlformat` command available and `.ocamlformat` config file |
| `ormolu` | .hs | `ormolu` command available |
| `oxfmt` (Experimental) | .js, .jsx, .ts, .tsx | `oxfmt` dependency in `package.json` and an experimental env variable flag |
| `pint` | .php | `laravel/pint` dependency in `composer.json` |
| `prettier` | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml, and more | `prettier` dependency in `package.json` |
| `rubocop` | .rb, .rake, .gemspec, .ru | `rubocop` command available |
| `ruff` | .py, .pyi | `ruff` command available with config |
| `rustfmt` | .rs | `rustfmt` command available |
| `shfmt` | .sh, .bash | `shfmt` command available |
| `standardrb` | .rb, .rake, .gemspec, .ru | `standardrb` command available |
| `terraform` | .tf, .tfvars | `terraform` command available |
| `uv` | .py, .pyi | `uv` command available |
| `zig` | .zig, .zon | `zig` command available |

When formatters are enabled, OpenCode will use `prettier` for matching files if your project has `prettier` in `package.json`.

## How it works

When OpenCode writes or edits a file and formatters are enabled, it:
1. Checks the file extension against all enabled formatters.
2. Runs the appropriate formatter command on the file.
3. Applies the formatting changes.

This process happens in the background for enabled formatters.

## Configure

You can enable and customize formatters through the `formatter` section in your OpenCode config.

To enable all built-in formatters, set `formatter` to `true`.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom formatters.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": {}
}
```

Each formatter configuration supports the following:

| Property | Type | Description |
|---|---|---|
| `disabled` | boolean | Set this to `true` to disable the formatter |
| `command` | string[] | The command to run for formatting. Required for custom formatters; optional for built-ins. |
| `environment` | object | Environment variables to set when running the formatter |
| `extensions` | string[] | File extensions this formatter should handle |

Let’s look at some examples.

### Disabling formatters

If `formatter` is omitted, all formatters are disabled. To disable all formatters after another config enabled them, set `formatter` to `false`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": false
}
```

To disable a **specific** formatter, set `disabled` to `true`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

### Custom formatters

You can configure built-in formatters with options like `environment` or `extensions`. To add a custom formatter, specify a `command` and `extensions`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-markdown-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

The `$FILE` placeholder in the command will be replaced with the path to the file being formatted.

# Permissions

Control which actions require approval to run.

OpenCode uses the `permission` config to decide whether a given action should run automatically, prompt you, or be blocked.
As of v1.1.1, the legacy `tools` boolean config is deprecated and has been merged into `permission`. The old `tools` config is still supported for backwards compatibility.

## Actions

Each permission rule resolves to one of:
- `"allow"` — run without approval
- `"ask"` — prompt for approval
- `"deny"` — block the action

## Configuration

You can set permissions globally (with `*`), and override specific tools.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "*": "ask",
    "bash": "allow",
    "edit": "deny"
  }
}
```

You can also set all permissions at once:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": "allow"
}
```

### Granular Rules (Object Syntax)

For most permissions, you can use an object to apply different actions based on the tool input.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    },
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    }
  }
}
```

Rules are evaluated by pattern match, with the **last matching rule winning**. A common pattern is to put the catch-all `"*"` rule first, and more specific rules after it.

### Wildcards

Permission patterns use simple wildcard matching:
- `*` matches zero or more of any character
- `?` matches exactly one character
- All other characters match literally

### Home Directory Expansion

You can use `~` or `$HOME` at the start of a pattern to reference your home directory. This is particularly useful for `external_directory` rules.
- `~/projects/*` -> `/Users/username/projects/*`
- `$HOME/projects/*` -> `/Users/username/projects/*`
- `~` -> `/Users/username`

### External Directories

Use `external_directory` to allow tool calls that touch paths outside the working directory where OpenCode was started. This applies to any tool that takes a path as input (for example `read`, `edit`, `glob`, `grep`, and many `bash` commands).

Home expansion (like `~/...`) only affects how a pattern is written. It does not make an external path part of the current workspace, so paths outside the working directory must still be allowed via `external_directory`.

For example, this allows access to everything under `~/projects/personal/`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    }
  }
}
```

Any directory allowed here inherits the same defaults as the current workspace. Since `read` defaults to `allow`, reads are also allowed for entries under `external_directory` unless overridden. Add explicit rules when a tool should be restricted in these paths, such as blocking edits while keeping reads:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    },
    "edit": {
      "~/projects/personal/**": "deny"
    }
  }
}
```

Keep the list focused on trusted paths, and layer extra allow or deny rules as needed for other tools (for example `bash`).

## Available Permissions

OpenCode permissions are keyed by tool name, plus a couple of safety guards:
- `read` — reading a file (matches the file path)
- `edit` — all file modifications (covers `edit`, `write`, `patch`)
- `glob` — file globbing (matches the glob pattern)
- `grep` — content search (matches the regex pattern)
- `bash` — running shell commands (matches parsed commands like `git status --porcelain`)
- `task` — launching subagents (matches the subagent type)
- `skill` — loading a skill (matches the skill name)
- `lsp` — running LSP queries (currently non-granular)
- `question` — asking the user questions during execution
- `webfetch` — fetching a URL (matches the URL)
- `websearch` — web search (matches the query)
- `external_directory` — triggered when a tool touches paths outside the project working directory
- `doom_loop` — triggered when the same tool call repeats 3 times with identical input

## Defaults

If you don’t specify anything, OpenCode starts from permissive defaults:
- Most permissions default to `"allow"`.
- `doom_loop` and `external_directory` default to `"ask"`.
- `read` is `"allow"`, but `.env` files are denied by default:

**opencode.json**
```json
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    }
  }
}
```

## What “Ask” Does

When OpenCode prompts for approval, the UI offers three outcomes:
- `once` — approve just this request
- `always` — approve future requests matching the suggested patterns (for the rest of the current OpenCode session)
- `reject` — deny the request

The set of patterns that `always` would approve is provided by the tool (for example, bash approvals typically whitelist a safe command prefix like `git status*`).

## Agents

You can override permissions per agent. Agent permissions are merged with the global config, and agent rules take precedence. Learn more about agent permissions.

> **Note**
> 
> Refer to the Granular Rules (Object Syntax) section above for more detailed pattern matching examples.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "git commit *": "deny",
      "git push *": "deny",
      "grep *": "allow"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git *": "allow",
          "git commit *": "ask",
          "git push *": "deny",
          "grep *": "allow"
        }
      }
    }
  }
}
```

You can also configure agent permissions in Markdown:

**~/.config/opencode/agents/review.md**
```markdown
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

Only analyze code and suggest changes.
```

> **Tip**
> 
> Use pattern matching for commands with arguments. `"grep *"` allows `grep pattern file.txt`, while `"grep"` alone would block it. Commands like `git status` work for default behavior but require explicit permission (like `"git status *"`) when arguments are passed.

# LSP Servers

OpenCode integrates with your LSP servers.

OpenCode can integrate with your Language Server Protocol (LSP) to help the LLM interact with your codebase. It uses diagnostics to provide feedback to the LLM.

## Built-in

OpenCode comes with several built-in LSP servers for popular languages:

| LSP Server | Extensions | Requirements |
|---|---|---|
| `astro` | .astro | Auto-installs for Astro projects |
| `bash` | .sh, .bash, .zsh, .ksh | Auto-installs bash-language-server |
| `clangd` | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++ | Auto-installs for C/C++ projects |
| `csharp` | .cs, .csx | .NET SDK installed |
| `clojure-lsp` | .clj, .cljs, .cljc, .edn | `clojure-lsp` command available |
| `dart` | .dart | `dart` command available |
| `deno` | .ts, .tsx, .js, .jsx, .mjs | `deno` command available (auto-detects deno.json/deno.jsonc) |
| `elixir-ls` | .ex, .exs | `elixir` command available |
| `eslint` | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | `eslint` dependency in project |
| `fsharp` | .fs, .fsi, .fsx, .fsscript | .NET SDK installed |
| `gleam` | .gleam | `gleam` command available |
| `gopls` | .go | `go` command available |
| `hls` | .hs, .lhs | `haskell-language-server-wrapper` command available |
| `jdtls` | .java | Java SDK (version 21+) installed |
| `julials` | .jl | `julia` and `LanguageServer.jl` installed |
| `kotlin-ls` | .kt, .kts | Auto-installs for Kotlin projects |
| `lua-ls` | .lua | Auto-installs for Lua projects |
| `nixd` | .nix | `nixd` command available |
| `ocaml-lsp` | .ml, .mli | `ocamllsp` command available |
| `oxlint` | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue, .astro, .svelte | `oxlint` dependency in project |
| `php intelephense` | .php | Auto-installs for PHP projects |
| `prisma` | .prisma | `prisma` command available |
| `pyright` | .py, .pyi | `pyright` dependency installed |
| `razor` | .razor, .cshtml | .NET SDK and VS Code C# extension installed |
| `ruby-lsp (rubocop)` | .rb, .rake, .gemspec, .ru | `ruby` and `gem` commands available |
| `rust` | .rs | `rust-analyzer` command available |
| `sourcekit-lsp` | .swift, .objc, .objcpp | `swift` installed (`xcode` on macOS) |
| `svelte` | .svelte | Auto-installs for Svelte projects |
| `terraform` | .tf, .tfvars | Auto-installs from GitHub releases |
| `tinymist` | .typ, .typc | Auto-installs from GitHub releases |
| `typescript` | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | `typescript` dependency in project |
| `vue` | .vue | Auto-installs for Vue projects |
| `yaml-ls` | .yaml, .yml | Auto-installs Red Hat yaml-language-server |
| `zls` | .zig, .zon | `zig` command available |

When LSP is enabled, servers start when one of the above file extensions is detected and the requirements are met.

> **Note**
> 
> You can disable automatic LSP server downloads by setting the `OPENCODE_DISABLE_LSP_DOWNLOAD` environment variable to `true`.

## How It Works

When LSP is enabled and opencode opens a file, it:

- Checks the file extension against all enabled LSP servers.
- Starts the appropriate LSP server if not already running.

## Configure

You can enable and customize LSP servers through the `lsp` section in your opencode config.

To enable all built-in LSP servers, set `lsp` to `true`.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom servers.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {}
}
```

Each configured LSP server entry supports the following:

Server entries need `command` unless they only disable a server.

| Property | Type | Description |
|---|---|---|
| `disabled` | boolean | Set this to `true` to disable the LSP server |
| `command` | string[] | The command to start the LSP server |
| `extensions` | string[] | File extensions this LSP server should handle |
| `env` | object | Environment variables to set when starting server |
| `initialization` | object | Initialization options to send to the LSP server |

Let’s look at some examples.

### Environment variables

Use the `env` property to set environment variables when starting the LSP server:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {
    "rust": {
      "command": ["rust-analyzer"],
      "env": {
        "RUST_LOG": "debug"
      }
    }
  }
}
```

### Initialization options

Use the `initialization` property to pass initialization options to the LSP server. These are server-specific settings sent during the LSP `initialize` request:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"],
      "initialization": {
        "preferences": {
          "importModuleSpecifierPreference": "relative"
        }
      }
    }
  }
}
```

> **Note**
> 
> Initialization options vary by LSP server. Check your LSP server’s documentation for available options.

### Disabling LSP servers

If `lsp` is omitted, all LSP servers are disabled. To disable all LSP servers after another config enabled them, set `lsp` to `false`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": false
}
```

To disable a **specific** LSP server, set `disabled` to `true`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

### Custom LSP servers

You can add custom LSP servers by specifying the command and file extensions:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"]
    }
  }
}
```

## Additional Information

### PHP Intelephense

PHP Intelephense offers premium features through a license key. You can provide a license key by placing (only) the key in a text file at:

- On macOS/Linux: `$HOME/intelephense/license.txt`
- On Windows: `%USERPROFILE%/intelephense/license.txt`

The file should contain only the license key with no additional content.

# MCP servers

Add local and remote MCP tools.

You can add external tools to OpenCode using the Model Context Protocol, or MCP. OpenCode supports both local and remote servers.
Once added, MCP tools are automatically available to the LLM alongside built-in tools.

## Caveats

When you use an MCP server, it adds to the context. This can quickly add up if you have a lot of tools. So we recommend being careful with which MCP servers you use.

> **Tip**
> 
> MCP servers add to your context, so you want to be careful with which ones you enable.
> Certain MCP servers, like the GitHub MCP server, tend to add a lot of tokens and can easily exceed the context limit.

## Enable

You can define MCP servers in your OpenCode Config under `mcp`. Add each MCP with a unique name. You can refer to that MCP by name when prompting the LLM.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "name-of-mcp-server": {
      // ...
      "enabled": true,
    },
    "name-of-other-mcp-server": {
      // ...
    },
  },
}
```

You can also disable a server by setting `enabled` to `false`. This is useful if you want to temporarily disable a server without removing it from your config.

## Overriding remote defaults

Organizations can provide default MCP servers via their `.well-known/opencode` endpoint. These servers may be disabled by default, allowing users to opt-in to the ones they need.
To enable a specific server from your organization’s remote config, add it to your local config with `enabled: true`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "[https://jira.example.com/mcp](https://jira.example.com/mcp)",
      "enabled": true
    }
  }
}
```

Your local config values override the remote defaults. See config precedence for more details.

## Local

Add local MCP servers using `type` to `"local"` within the MCP object.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-local-mcp-server": {
      "type": "local",
      // Or ["bun", "x", "my-mcp-command"]
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "my_env_var_value",
      },
    },
  },
}
```

The command is how the local MCP server is started. You can also pass in a list of environment variables as well.
For example, here’s how you can add the test `@modelcontextprotocol/server-everything` MCP server.

**opencode.jsonc**
```jsonc
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
    },
  },
}
```

And to use it I can add `use the mcp_everything tool` to my prompts.

```text
use the mcp_everything tool to add the number 3 and 4
```

### Options

Here are all the options for configuring a local MCP server.

| Option | Type | Required | Description |
|---|---|---|---|
| `type` | String | Y | Type of MCP server connection, must be `"local"`. |
| `command` | Array | Y | Command and arguments to run the MCP server. |
| `environment` | Object | | Environment variables to set when running the server. |
| `enabled` | Boolean | | Enable or disable the MCP server on startup. |
| `timeout` | Number | | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds). |

## Remote

Add remote MCP servers by setting `type` to `"remote"`.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "[https://my-mcp-server.com](https://my-mcp-server.com)",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer MY_API_KEY"
      }
    }
  }
}
```

The `url` is the URL of the remote MCP server and with the `headers` option you can pass in a list of headers.

### Options

| Option | Type | Required | Description |
|---|---|---|---|
| `type` | String | Y | Type of MCP server connection, must be `"remote"`. |
| `url` | String | Y | URL of the remote MCP server. |
| `enabled` | Boolean | | Enable or disable the MCP server on startup. |
| `headers` | Object | | Headers to send with the request. |
| `oauth` | Object | | OAuth authentication configuration. See OAuth section below. |
| `timeout` | Number | | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds). |

## OAuth

OpenCode automatically handles OAuth authentication for remote MCP servers. When a server requires authentication, OpenCode will:
- Detect the 401 response and initiate the OAuth flow
- Use Dynamic Client Registration (RFC 7591) if supported by the server
- Store tokens securely for future requests

### Automatic

For most OAuth-enabled MCP servers, no special configuration is needed. Just configure the remote server:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "[https://mcp.example.com/mcp](https://mcp.example.com/mcp)"
    }
  }
}
```

If the server requires authentication, OpenCode will prompt you to authenticate when you first try to use it. If not, you can manually trigger the flow with `opencode mcp auth <server-name>`.

### Pre-registered

If you have client credentials from the MCP server provider, you can configure them:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "[https://mcp.example.com/mcp](https://mcp.example.com/mcp)",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### Authenticating

You can manually trigger authentication or manage credentials.

Authenticate with a specific MCP server:

**Terminal window**
```bash
opencode mcp auth my-oauth-server
```

List all MCP servers and their auth status:

**Terminal window**
```bash
opencode mcp list
```

Remove stored credentials:

**Terminal window**
```bash
opencode mcp logout my-oauth-server
```

The `mcp auth` command will open your browser for authorization. After you authorize, OpenCode will store the tokens securely in `~/.local/share/opencode/mcp-auth.json`.

### Disabling OAuth

If you want to disable automatic OAuth for a server (e.g., for servers that use API keys instead), set `oauth` to `false`:

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-api-key-server": {
      "type": "remote",
      "url": "[https://mcp.example.com/mcp](https://mcp.example.com/mcp)",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

### OAuth Options

| Option | Type | Description |
|---|---|---|
| `oauth` | Object \| false | OAuth config object, or `false` to disable OAuth auto-detection. |
| `clientId` | String | OAuth client ID. If not provided, dynamic client registration will be attempted. |
| `clientSecret` | String | OAuth client secret, if required by the authorization server. |
| `scope` | String | OAuth scopes to request during authorization. |

## Debugging

If a remote MCP server is failing to authenticate, you can diagnose issues with:

**Terminal window**
```bash
# View auth status for all OAuth-capable servers
opencode mcp auth list

# Debug connection and OAuth flow for a specific server
opencode mcp debug my-oauth-server
```

The `mcp debug` command shows the current auth status, tests HTTP connectivity, and attempts the OAuth discovery flow.

## Manage

Your MCPs are available as tools in OpenCode, alongside built-in tools. So you can manage them through the OpenCode config like any other tool.

### Global

This means that you can enable or disable them globally.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "tools": {
    "my-mcp-foo": false
  }
}
```

We can also use a glob pattern to disable all matching MCPs.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "tools": {
    "my-mcp*": false
  }
}
```

Here we are using the glob pattern `my-mcp*` to disable all MCPs.

### Per agent

If you have a large number of MCP servers you may want to only enable them per agent and disable them globally. To do this:
1. Disable it as a tool globally.
2. In your agent config, enable the MCP server as a tool.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"],
      "enabled": true
    }
  },
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "my-agent": {
      "tools": {
        "my-mcp*": true
      }
    }
  }
}
```

### Glob patterns

The glob pattern uses simple regex globbing patterns:
- `*` matches zero or more of any character (e.g., `"my-mcp*"` matches `my-mcp_search`, `my-mcp_list`, etc.)
- `?` matches exactly one character
- All other characters match literally

> **Note**
> 
> MCP server tools are registered with server name as prefix, so to disable all tools for a server simply use:
> 
> `"mymcpservername_*": false`

## Examples

Below are examples of some common MCP servers. You can submit a PR if you want to document other servers.

### Sentry

Add the Sentry MCP server to interact with your Sentry projects and issues.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "[https://mcp.sentry.dev/mcp](https://mcp.sentry.dev/mcp)",
      "oauth": {}
    }
  }
}
```

After adding the configuration, authenticate with Sentry:

**Terminal window**
```bash
opencode mcp auth sentry
```

This will open a browser window to complete the OAuth flow and connect OpenCode to your Sentry account.
Once authenticated, you can use Sentry tools in your prompts to query issues, projects, and error data.

```text
Show me the latest unresolved issues in my project. use sentry
```

### Context7

Add the Context7 MCP server to search through docs.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "[https://mcp.context7.com/mcp](https://mcp.context7.com/mcp)"
    }
  }
}
```

If you have signed up for a free account, you can use your API key and get higher rate-limits.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "[https://mcp.context7.com/mcp](https://mcp.context7.com/mcp)",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

Here we are assuming that you have the `CONTEXT7_API_KEY` environment variable set.
Add `use context7` to your prompts to use Context7 MCP server.

```text
Configure a Cloudflare Worker script to cache JSON API responses for five minutes. use context7
```

Alternatively, you can add something like this to your `AGENTS.md`.

**AGENTS.md**
```markdown
When you need to search docs, use `context7` tools.
```

### Grep by Vercel

Add the Grep by Vercel MCP server to search through code snippets on GitHub.

**opencode.json**
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "[https://mcp.grep.app](https://mcp.grep.app)"
    }
  }
}
```

Since we named our MCP server `gh_grep`, you can add `use the gh_grep tool` to your prompts to get the agent to use it.

```text
What's the right way to set a custom domain in an SST Astro component? use the gh_grep tool
```

Alternatively, you can add something like this to your `AGENTS.md`.

**AGENTS.md**
```markdown
If you are unsure how to do something, use `gh_grep` to search code examples from GitHub.
```

# ACP Support

Use OpenCode in any ACP-compatible editor.

OpenCode supports the Agent Client Protocol or (ACP), allowing you to use it directly in compatible editors and IDEs.

> **Tip**
> 
> For a list of editors and tools that support ACP, check out the ACP progress report.
> ACP is an open protocol that standardizes communication between code editors and AI coding agents.

## Configure

To use OpenCode via ACP, configure your editor to run the `opencode acp` command.
The command starts OpenCode as an ACP-compatible subprocess that communicates with your editor over JSON-RPC via stdio.
Below are examples for popular editors that support ACP.

### Zed

Add to your Zed configuration (`~/.config/zed/settings.json`):

**~/.config/zed/settings.json**
```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the `agent: new thread` action in the Command Palette.
You can also bind a keyboard shortcut by editing your `keymap.json`:

**keymap.json**
```json
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

### JetBrains IDEs

Add to your JetBrains IDE `acp.json` according to the documentation:

**acp.json**
```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the new ‘OpenCode’ agent in the AI Chat agent selector.

### Avante.nvim

Add to your Avante.nvim configuration:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

If you need to pass environment variables:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

### CodeCompanion.nvim

To use OpenCode as an ACP agent in CodeCompanion.nvim, add the following to your Neovim config:

```lua
require("codecompanion").setup({
  interactions = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

This config sets up CodeCompanion to use OpenCode as the ACP agent for chat.
If you need to pass environment variables (like `OPENCODE_API_KEY`), refer to Configuring Adapters: Environment Variables in the CodeCompanion.nvim documentation for full details.

## Support

OpenCode works the same via ACP as it does in the terminal. All features are supported:

> **Note**
> 
> Some built-in slash commands like `/undo` and `/redo` are currently unsupported.

- Built-in tools (file operations, terminal commands, etc.)
- Custom tools and slash commands
- MCP servers configured in your OpenCode config
- Project-specific rules from `AGENTS.md`
- Custom formatters and linters
- Agents and permissions system

# Agent Skills

Define reusable behavior via SKILL.md definitions

Agent skills let OpenCode discover reusable instructions from your repo or home directory. Skills are loaded on-demand via the native skill tool—agents see available skills and can load the full content when needed.

## Place files

Create one folder per skill name and put a SKILL.md inside it. OpenCode searches these locations:
- Project config: `.opencode/skills/<name>/SKILL.md`
- Global config: `~/.config/opencode/skills/<name>/SKILL.md`
- Project Claude-compatible: `.claude/skills/<name>/SKILL.md`
- Global Claude-compatible: `~/.claude/skills/<name>/SKILL.md`
- Project agent-compatible: `.agents/skills/<name>/SKILL.md`
- Global agent-compatible: `~/.agents/skills/<name>/SKILL.md`

## Understand discovery

For project-local paths, OpenCode walks up from your current working directory until it reaches the git worktree. It loads any matching `skills/*/SKILL.md` in `.opencode/` and any matching `.claude/skills/*/SKILL.md` or `.agents/skills/*/SKILL.md` along the way.

Global definitions are also loaded from `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, and `~/.agents/skills/*/SKILL.md`.

## Write frontmatter

Each SKILL.md must start with YAML frontmatter. Only these fields are recognized:
- `name` (required)
- `description` (required)
- `license` (optional)
- `compatibility` (optional)
- `metadata` (optional, string-to-string map)

Unknown frontmatter fields are ignored.

## Validate names

`name` must:
- Be 1–64 characters
- Be lowercase alphanumeric with single hyphen separators
- Not start or end with `-`
- Not contain consecutive `--`
- Match the directory name that contains SKILL.md

Equivalent regex:
```regex
^[a-z0-9]+(-[a-z0-9]+)*$
```

## Follow length rules

`description` must be 1-1024 characters. Keep it specific enough for the agent to choose correctly.

## Use an example

Create `.opencode/skills/git-release/SKILL.md` like this:

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do

- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me

Use this when you are preparing a tagged release.
Ask clarifying questions if the target versioning scheme is unclear.
```

## Recognize tool description

OpenCode lists available skills in the skill tool description. Each entry includes the skill name and description:

```xml
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

The agent loads a skill by calling the tool:

```javascript
skill({ name: "git-release" })
```

## Configure permissions

Control which skills agents can access using pattern-based permissions in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

- **allow**: Skill loads immediately
- **deny**: Skill hidden from agent, access rejected
- **ask**: User prompted for approval before loading

Patterns support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

## Override per agent

Give specific agents different permissions than the global defaults.

For custom agents (in agent frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

For built-in agents (in `opencode.json`):

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

## Disable the skill tool

Completely disable skills for agents that shouldn’t use them:

For custom agents:

```yaml
---
tools:
  skill: false
---
```

For built-in agents:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

When disabled, the `<available_skills>` section is omitted entirely.

## Troubleshoot loading

If a skill does not show up:
- Verify SKILL.md is spelled in all caps
- Check that frontmatter includes name and description
- Ensure skill names are unique across all locations
- Check permissions—skills with deny are hidden from agents

# Custom Tools

Create tools the LLM can call in opencode.

Custom tools are functions you create that the LLM can call during conversations. They work alongside opencode’s built-in tools like `read`, `write`, and `bash`.

## Creating a tool

Tools are defined as TypeScript or JavaScript files. However, the tool definition can invoke scripts written in any language — TypeScript or JavaScript is only used for the tool definition itself.

### Location

They can be defined:

- Locally by placing them in the `.opencode/tools/` directory of your project.

- Or globally, by placing them in `~/.config/opencode/tools/`.

### Structure

The easiest way to create tools is using the `tool()` helper which provides type-safety and validation.

`.opencode/tools/database.ts`
```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Query the project database",
  args: {
    query: tool.schema.string().describe("SQL query to execute"),
  },
  async execute(args) {
    // Your database logic here
    return `Executed query: ${args.query}`
  },
})
```

The filename becomes the tool name. The above creates a `database` tool.

### Multiple tools per file

You can also export multiple tools from a single file. Each export becomes a separate tool with the name `<filename>_<exportname>`:

`.opencode/tools/math.ts`
```typescript
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "Add two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a + args.b
  },
})

export const multiply = tool({
  description: "Multiply two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return args.a * args.b
  },
})
```

This creates two tools: `math_add` and `math_multiply`.

### Name collisions with built-in tools

Custom tools are keyed by tool name. If a custom tool uses the same name as a built-in tool, the custom tool takes precedence.

For example, this file replaces the built-in `bash` tool:

`.opencode/tools/bash.ts`
```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Restricted bash wrapper",
  args: {
    command: tool.schema.string(),
  },
  async execute(args) {
    return `blocked: ${args.command}`
  },
})
```

> **Note**
> Prefer unique names unless you intentionally want to replace a built-in tool. If you want to disable a built in tool but not override it, use permissions.

## Arguments

You can use `tool.schema`, which is just Zod, to define argument types.

```typescript
args: {
  query: tool.schema.string().describe("SQL query to execute")
}
```

You can also import Zod directly and return a plain object:

```typescript
import { z } from "zod"

export default {
  description: "Tool description",
  args: {
    param: z.string().describe("Parameter description"),
  },
  async execute(args, context) {
    // Tool implementation
    return "result"
  },
}
```

## Context

Tools receive context about the current session:

`.opencode/tools/project.ts`
```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    // Access context information
    const { agent, sessionID, messageID, directory, worktree } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Directory: ${directory}, Worktree: ${worktree}`
  },
})
```

Use `context.directory` for the session working directory. Use `context.worktree` for the git worktree root.

## Examples

### Write a tool in Python

You can write your tools in any language you want. Here’s an example that adds two numbers using Python.

First, create the tool as a Python script:

`.opencode/tools/add.py`
```python
import sys

a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```

Then create the tool definition that invokes it:

`.opencode/tools/python-add.ts`
```typescript
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

Here we are using the `Bun.$` utility to run the Python script.

# SDK

Type-safe JS client for opencode server.

The opencode JS/TS SDK provides a type-safe client for interacting with the server. Use it to build integrations and control opencode programmatically.

Learn more about how the server works. For examples, check out the projects built by the community.

## Install

Install the SDK from npm:

```bash
npm install @opencode-ai/sdk
```

## Create client

Create an instance of opencode:

```typescript
import { createOpencode } from "@opencode-ai/sdk"

const { client } = await createOpencode()
```

This starts both a server and a client.

### Options

| Option | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `hostname` | `string` | Server hostname | `127.0.0.1` |
| `port` | `number` | Server port | `4096` |
| `signal` | `AbortSignal` | Abort signal for cancellation | `undefined` |
| `timeout` | `number` | Timeout in ms for server start | `5000` |
| `config` | `Config` | Configuration object | `{}` |

## Config

You can pass a configuration object to customize behavior. The instance still picks up your `opencode.json`, but you can override or add configuration inline:

```typescript
import { createOpencode } from "@opencode-ai/sdk"

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
  },
})

console.log(`Server running at ${opencode.server.url}`)

opencode.server.close()
```

## Client only

If you already have a running instance of opencode, you can create a client instance to connect to it:

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
})
```

### Options

| Option | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `baseUrl` | `string` | URL of the server | `http://localhost:4096` |
| `fetch` | `function` | Custom fetch implementation | `globalThis.fetch` |
| `parseAs` | `string` | Response parsing method | `auto` |
| `responseStyle` | `string` | Return style: `data` or `fields` | `fields` |
| `throwOnError` | `boolean` | Throw errors instead of return | `false` |

## Types

The SDK includes TypeScript definitions for all API types. Import them directly:

```typescript
import type { Session, Message, Part } from "@opencode-ai/sdk"
```

All types are generated from the server’s OpenAPI specification and available in the types file.

## Errors

The SDK can throw errors that you can catch and handle:

```typescript
try {
  await client.session.get({ path: { id: "invalid-id" } })
} catch (error) {
  console.error("Failed to get session:", (error as Error).message)
}
```

## Structured Output

You can request structured JSON output from the model by specifying a `format` with a JSON schema. The model will use a `StructuredOutput` tool to return validated JSON matching your schema.

### Basic Usage

```typescript
const result = await client.session.prompt({
  path: { id: sessionId },
  body: {
    parts: [{ type: "text", text: "Research Anthropic and provide company info" }],
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          company: { type: "string", description: "Company name" },
          founded: { type: "number", description: "Year founded" },
          products: {
            type: "array",
            items: { type: "string" },
            description: "Main products",
          },
        },
        required: ["company", "founded"],
      },
    },
  },
})

// Access the structured output
console.log(result.data.info.structured_output)
// { company: "Anthropic", founded: 2021, products: ["Claude", "Claude API"] }
```

### Output Format Types

| Type | Description |
| :--- | :--- |
| `text` | Default. Standard text response (no structured output) |
| `json_schema` | Returns validated JSON matching the provided schema |

### JSON Schema Format

When using `type: 'json_schema'`, provide:

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | `'json_schema'` | Required. Specifies JSON schema mode |
| `schema` | `object` | Required. JSON Schema object defining the output structure |
| `retryCount` | `number` | Optional. Number of validation retries (default: `2`) |

## Error Handling

If the model fails to produce valid structured output after all retries, the response will include a `StructuredOutputError`:

```typescript
if (result.data.info.error?.name === "StructuredOutputError") {
  console.error("Failed to produce structured output:", result.data.info.error.message)
  console.error("Attempts:", result.data.info.error.retries)
}
```

## Best Practices

- **Provide clear descriptions** in your schema properties to help the model understand what data to extract
- **Use `required`** to specify which fields must be present
- **Keep schemas focused** - complex nested schemas may be harder for the model to fill correctly
- **Set appropriate `retryCount`** - increase for complex schemas, decrease for simple ones

## APIs

The SDK exposes all server APIs through a type-safe client.

### Global

| Method | Description | Response |
| :--- | :--- | :--- |
| `global.health()` | Check server health and version | `{ healthy: true, version: string }` |

**Examples**
```typescript
const health = await client.global.health()
console.log(health.data.version)
```

### App

| Method | Description | Response |
| :--- | :--- | :--- |
| `app.log()` | Write a log entry | `boolean` |
| `app.agents()` | List all available agents | `Agent[]` |

**Examples**
```typescript
// Write a log entry
await client.app.log({
  body: {
    service: "my-app",
    level: "info",
    message: "Operation completed",
  },
})

// List available agents
const agents = await client.app.agents()
```

### Project

| Method | Description | Response |
| :--- | :--- | :--- |
| `project.list()` | List all projects | `Project[]` |
| `project.current()` | Get current project | `Project` |

**Examples**
```typescript
// List all projects
const projects = await client.project.list()

// Get current project
const currentProject = await client.project.current()
```

### Path

| Method | Description | Response |
| :--- | :--- | :--- |
| `path.get()` | Get current path | `Path` |

**Examples**
```typescript
// Get current path information
const pathInfo = await client.path.get()
```

### Config

| Method | Description | Response |
| :--- | :--- | :--- |
| `config.get()` | Get config info | `Config` |
| `config.providers()` | List providers and default models | `{ providers: Provider[], default: { [key: string]: string } }` |

**Examples**
```typescript
const config = await client.config.get()

const { providers, default: defaults } = await client.config.providers()
```

### Sessions

| Method | Description | Notes |
| :--- | :--- | :--- |
| `session.list()` | List sessions | Returns `Session[]` |
| `session.get({ path })` | Get session | Returns `Session` |
| `session.children({ path })` | List child sessions | Returns `Session[]` |
| `session.create({ body })` | Create session | Returns `Session` |
| `session.delete({ path })` | Delete session | Returns `boolean` |
| `session.update({ path, body })` | Update session properties | Returns `Session` |
| `session.init({ path, body })` | Analyze app and create `AGENTS.md` | Returns `boolean` |
| `session.abort({ path })` | Abort a running session | Returns `boolean` |
| `session.share({ path })` | Share session | Returns `Session` |
| `session.unshare({ path })` | Unshare session | Returns `Session` |
| `session.summarize({ path, body })` | Summarize session | Returns `boolean` |
| `session.messages({ path })` | List messages in a session | Returns `{ info: Message, parts: Part[]}[]` |
| `session.message({ path })` | Get message details | Returns `{ info: Message, parts: Part[]}` |
| `session.prompt({ path, body })` | Send prompt message | `body.noReply: true` returns UserMessage (context only). Default returns `AssistantMessage` with AI response. Supports `body.outputFormat` for structured output |
| `session.command({ path, body })` | Send command to session | Returns `{ info: AssistantMessage, parts: Part[]}` |
| `session.shell({ path, body })` | Run a shell command | Returns `AssistantMessage` |
| `session.revert({ path, body })` | Revert a message | Returns `Session` |
| `session.unrevert({ path })` | Restore reverted messages | Returns `Session` |
| `postSessionByIdPermissionsByPermissionId({ path, body })` | Respond to a permission request | Returns `boolean` |

**Examples**
```typescript
// Create and manage sessions
const session = await client.session.create({
  body: { title: "My session" },
})

const sessions = await client.session.list()

// Send a prompt message
const result = await client.session.prompt({
  path: { id: session.id },
  body: {
    model: { providerID: "anthropic", modelID: "claude-3-5-sonnet-20241022" },
    parts: [{ type: "text", text: "Hello!" }],
  },
})

// Inject context without triggering AI response (useful for plugins)
await client.session.prompt({
  path: { id: session.id },
  body: {
    noReply: true,
    parts: [{ type: "text", text: "You are a helpful assistant." }],
  },
})
```

### Files

| Method | Description | Response |
| :--- | :--- | :--- |
| `find.text({ query })` | Search for text in files | Array of match objects with `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| `find.files({ query })` | Find files and directories by name | `string[]` (paths) |
| `find.symbols({ query })` | Find workspace symbols | `Symbol[]` |
| `file.read({ query })` | Read a file | `{ type: "raw" \| "patch", content: string }` |
| `file.status({ query? })` | Get status for tracked files | `File[]` |

`find.files` supports a few optional query fields:
- `type`: `"file"` or `"directory"`
- `directory`: override the project root for the search
- `limit`: max results (1–200)

**Examples**
```typescript
// Search and read files
const textResults = await client.find.text({
  query: { pattern: "function.*opencode" },
})

const files = await client.find.files({
  query: { query: "*.ts", type: "file" },
})

const directories = await client.find.files({
  query: { query: "packages", type: "directory", limit: 20 },
})

const content = await client.file.read({
  query: { path: "src/index.ts" },
})
```

### TUI

| Method | Description | Response |
| :--- | :--- | :--- |
| `tui.appendPrompt({ body })` | Append text to the prompt | `boolean` |
| `tui.openHelp()` | Open the help dialog | `boolean` |
| `tui.openSessions()` | Open the session selector | `boolean` |
| `tui.openThemes()` | Open the theme selector | `boolean` |
| `tui.openModels()` | Open the model selector | `boolean` |
| `tui.submitPrompt()` | Submit the current prompt | `boolean` |
| `tui.clearPrompt()` | Clear the prompt | `boolean` |
| `tui.executeCommand({ body })` | Execute a command | `boolean` |
| `tui.showToast({ body })` | Show toast notification | `boolean` |

**Examples**
```typescript
// Control TUI interface
await client.tui.appendPrompt({
  body: { text: "Add this to prompt" },
})

await client.tui.showToast({
  body: { message: "Task completed", variant: "success" },
})
```

### Auth

| Method | Description | Response |
| :--- | :--- | :--- |
| `auth.set({ ... })` | Set authentication credentials | `boolean` |

**Examples**
```typescript
await client.auth.set({
  path: { id: "anthropic" },
  body: { type: "api", key: "your-api-key" },
})
```

### Events

| Method | Description | Response |
| :--- | :--- | :--- |
| `event.subscribe()` | Server-sent events stream | Server-sent events stream |

**Examples**
```typescript
// Listen to real-time events
const events = await client.event.subscribe()
for await (const event of events.stream) {
  console.log("Event:", event.type, event.properties)
}
```

# Server

Interact with opencode server over HTTP.

The `opencode serve` command runs a headless HTTP server that exposes an OpenAPI endpoint that an opencode client can use.

## Usage

```bash
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

## Options

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--port` | Port to listen on | `4096` |
| `--hostname` | Hostname to listen on | `127.0.0.1` |
| `--mdns` | Enable mDNS discovery | `false` |
| `--mdns-domain` | Custom domain name for mDNS service | `opencode.local` |
| `--cors` | Additional browser origins to allow | `[]` |

`--cors` can be passed multiple times:

```bash
opencode serve --cors http://localhost:5173 --cors [https://app.example.com](https://app.example.com)
```

## Authentication

Set `OPENCODE_SERVER_PASSWORD` to protect the server with HTTP basic auth. The username defaults to `opencode`, or set `OPENCODE_SERVER_USERNAME` to override it. This applies to both `opencode serve` and `opencode web`.

```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

## How it works

When you run `opencode` it starts a TUI and a server. Where the TUI is the client that talks to the server. The server exposes an OpenAPI 3.1 spec endpoint. This endpoint is also used to generate an SDK.

> **Tip**
> Use the opencode server to interact with opencode programmatically.

This architecture lets opencode support multiple clients and allows you to interact with opencode programmatically.

You can run `opencode serve` to start a standalone server. If you have the opencode TUI running, `opencode serve` will start a new server.

## Connect to an existing server

When you start the TUI it randomly assigns a port and hostname. You can instead pass in the `--hostname` and `--port` flags. Then use this to connect to its server.

The `/tui` endpoint can be used to drive the TUI through the server. For example, you can prefill or run a prompt. This setup is used by the OpenCode IDE plugins.

## Spec

The server publishes an OpenAPI 3.1 spec that can be viewed at:

`http://<hostname>:<port>/doc`

For example, `http://localhost:4096/doc`. Use the spec to generate clients or inspect request and response types. Or view it in a Swagger explorer.

## APIs

The opencode server exposes the following APIs.

### Global

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/global/health` | Get server health and version | `{ healthy: true, version: string }` |
| GET | `/global/event` | Get global events (SSE stream) | Event stream |

### Project

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/project` | List all projects | `Project[]` |
| GET | `/project/current` | Get the current project | `Project` |

### Path & VCS

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/path` | Get the current path | `Path` |
| GET | `/vcs` | Get VCS info for the current project | `VcsInfo` |

### Instance

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| POST | `/instance/dispose` | Dispose the current instance | `boolean` |

### Config

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/config` | Get config info | `Config` |
| PATCH | `/config` | Update config | `Config` |
| GET | `/config/providers` | List providers and default models | `{ providers: Provider[], default: { [key: string]: string } }` |

### Provider

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/provider` | List all providers | `{ all: Provider[], default: {...}, connected: string[] }` |
| GET | `/provider/auth` | Get provider authentication methods | `{ [providerID: string]: ProviderAuthMethod[] }` |
| POST | `/provider/{id}/oauth/authorize` | Authorize a provider using OAuth | `ProviderAuthAuthorization` |
| POST | `/provider/{id}/oauth/callback` | Handle OAuth callback for a provider | `boolean` |

### Sessions

| Method | Path | Description | Notes |
| :--- | :--- | :--- | :--- |
| GET | `/session` | List all sessions | Returns `Session[]` |
| POST | `/session` | Create a new session | body: `{ parentID?, title? }`, returns `Session` |
| GET | `/session/status` | Get session status for all sessions | Returns `{ [sessionID: string]: SessionStatus }` |
| GET | `/session/:id` | Get session details | Returns `Session` |
| DELETE | `/session/:id` | Delete a session and all its data | Returns `boolean` |
| PATCH | `/session/:id` | Update session properties | body: `{ title? }`, returns `Session` |
| GET | `/session/:id/children` | Get a session’s child sessions | Returns `Session[]` |
| GET | `/session/:id/todo` | Get the todo list for a session | Returns `Todo[]` |
| POST | `/session/:id/init` | Analyze app and create `AGENTS.md` | body: `{ messageID, providerID, modelID }`, returns `boolean` |
| POST | `/session/:id/fork` | Fork an existing session at a message | body: `{ messageID? }`, returns `Session` |
| POST | `/session/:id/abort` | Abort a running session | Returns `boolean` |
| POST | `/session/:id/share` | Share a session | Returns `Session` |
| DELETE | `/session/:id/share` | Unshare a session | Returns `Session` |
| GET | `/session/:id/diff` | Get the diff for this session | query: `messageID?`, returns `FileDiff[]` |
| POST | `/session/:id/summarize` | Summarize the session | body: `{ providerID, modelID }`, returns `boolean` |
| POST | `/session/:id/revert` | Revert a message | body: `{ messageID, partID? }`, returns `boolean` |
| POST | `/session/:id/unrevert` | Restore all reverted messages | Returns `boolean` |
| POST | `/session/:id/permissions/:permissionID` | Respond to a permission request | body: `{ response, remember? }`, returns `boolean` |

### Messages

| Method | Path | Description | Notes |
| :--- | :--- | :--- | :--- |
| GET | `/session/:id/message` | List messages in a session | query: `limit?`, returns `{ info: Message, parts: Part[]}[]` |
| POST | `/session/:id/message` | Send a message and wait for response | body: `{ messageID?, model?, agent?, noReply?, system?, tools?, parts }`, returns `{ info: Message, parts: Part[]}` |
| GET | `/session/:id/message/:messageID` | Get message details | Returns `{ info: Message, parts: Part[]}` |
| POST | `/session/:id/prompt_async` | Send a message asynchronously (no wait) | body: same as `/session/:id/message`, returns `204 No Content` |
| POST | `/session/:id/command` | Execute a slash command | body: `{ messageID?, agent?, model?, command, arguments }`, returns `{ info: Message, parts: Part[]}` |
| POST | `/session/:id/shell` | Run a shell command | body: `{ agent, model?, command }`, returns `{ info: Message, parts: Part[]}` |

### Commands

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/command` | List all commands | `Command[]` |

### Files

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/find?pattern=<pat>` | Search for text in files | Array of match objects with `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| GET | `/find/file?query=<q>` | Find files and directories by name | `string[]` (paths) |
| GET | `/find/symbol?query=<q>` | Find workspace symbols | `Symbol[]` |
| GET | `/file?path=<path>` | List files and directories | `FileNode[]` |
| GET | `/file/content?path=<p>` | Read a file | `FileContent` |
| GET | `/file/status` | Get status for tracked files | `File[]` |

**/find/file query parameters**

*   `query` (required) — search string (fuzzy match)
*   `type` (optional) — limit results to `"file"` or `"directory"`
*   `directory` (optional) — override the project root for the search
*   `limit` (optional) — max results (1–200)
*   `dirs` (optional) — legacy flag (`"false"` returns only files)

### Tools (Experimental)

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/experimental/tool/ids` | List all tool IDs | `ToolIDs` |
| GET | `/experimental/tool?provider=<p>&model=<m>` | List tools with JSON schemas for a model | `ToolList` |

### LSP, Formatters & MCP

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/lsp` | Get LSP server status | `LSPStatus[]` |
| GET | `/formatter` | Get formatter status | `FormatterStatus[]` |
| GET | `/mcp` | Get MCP server status | `{ [name: string]: MCPStatus }` |
| POST | `/mcp` | Add MCP server dynamically | body: `{ name, config }`, returns MCP status object |

### Agents

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/agent` | List all available agents | `Agent[]` |

### Logging

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| POST | `/log` | Write log entry. Body: `{ service, level, message, extra? }` | `boolean` |

### TUI

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| POST | `/tui/append-prompt` | Append text to the prompt | `boolean` |
| POST | `/tui/open-help` | Open the help dialog | `boolean` |
| POST | `/tui/open-sessions` | Open the session selector | `boolean` |
| POST | `/tui/open-themes` | Open the theme selector | `boolean` |
| POST | `/tui/open-models` | Open the model selector | `boolean` |
| POST | `/tui/submit-prompt` | Submit the current prompt | `boolean` |
| POST | `/tui/clear-prompt` | Clear the prompt | `boolean` |
| POST | `/tui/execute-command` | Execute a command (`{ command }`) | `boolean` |
| POST | `/tui/show-toast` | Show toast (`{ title?, message, variant }`) | `boolean` |
| GET | `/tui/control/next` | Wait for the next control request | Control request object |
| POST | `/tui/control/response` | Respond to a control request (`{ body }`) | `boolean` |

### Auth

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| PUT | `/auth/:id` | Set authentication credentials. Body must match provider schema | `boolean` |

### Events

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/event` | Server-sent events stream. First event is `server.connected`, then bus events | Server-sent events stream |

### Docs

| Method | Path | Description | Response |
| :--- | :--- | :--- | :--- |
| GET | `/doc` | OpenAPI 3.1 specification | HTML page with OpenAPI spec |

# Plugins

Write your own plugins to extend OpenCode.

Plugins allow you to extend OpenCode by hooking into various events and customizing behavior. You can create plugins to add new features, integrate with external services, or modify OpenCode’s default behavior.

For examples, check out the plugins created by the community.

## Use a plugin

There are two ways to load plugins.

### From local files

Place JavaScript or TypeScript files in the plugin directory.

- `.opencode/plugins/` - Project-level plugins
- `~/.config/opencode/plugins/` - Global plugins

Files in these directories are automatically loaded at startup.

### From npm

Specify npm packages in your config file.

`opencode.json`
```json
{
  "$schema": "[https://opencode.ai/config.json](https://opencode.ai/config.json)",
  "plugin": ["opencode-helicone-session", "opencode-wakatime", "@my-org/custom-plugin"]
}
```

Both regular and scoped npm packages are supported.

Browse available plugins in the ecosystem.

## How plugins are installed

**npm plugins** are installed automatically using Bun at startup. Packages and their dependencies are cached in `~/.cache/opencode/node_modules/`.

**Local plugins** are loaded directly from the plugin directory. To use external packages, you must create a `package.json` within your config directory (see Dependencies), or publish the plugin to npm and add it to your config.

## Load order

Plugins are loaded from all sources and all hooks run in sequence. The load order is:

1. Global config (`~/.config/opencode/opencode.json`)
2. Project config (`opencode.json`)
3. Global plugin directory (`~/.config/opencode/plugins/`)
4. Project plugin directory (`.opencode/plugins/`)

Duplicate npm packages with the same name and version are loaded once. However, a local plugin and an npm plugin with similar names are both loaded separately.

## Create a plugin

A plugin is a JavaScript/TypeScript module that exports one or more plugin functions. Each function receives a context object and returns a hooks object.

### Dependencies

Local plugins and custom tools can use external npm packages. Add a `package.json` to your config directory with the dependencies you need.

`.opencode/package.json`
```json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

OpenCode runs `bun install` at startup to install these. Your plugins and tools can then import them.

`.opencode/plugins/my-plugin.ts`
```typescript
import { escape } from "shescape"

export const MyPlugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        output.args.command = escape(output.args.command)
      }
    },
  }
}
```

### Basic structure

`.opencode/plugins/example.js`
```javascript
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!")

  return {
    // Hook implementations go here
  }
}
```

The plugin function receives:

- `project`: The current project information.
- `directory`: The current working directory.
- `worktree`: The git worktree path.
- `client`: An opencode SDK client for interacting with the AI.
- `$`: Bun’s shell API for executing commands.

### TypeScript support

For TypeScript plugins, you can import types from the plugin package:

`my-plugin.ts`
```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    // Type-safe hook implementations
  }
}
```

## Events

Plugins can subscribe to events as seen below in the Examples section. Here is a list of the different events available.

**Command Events**
- `command.executed`

**File Events**
- `file.edited`
- `file.watcher.updated`

**Installation Events**
- `installation.updated`

**LSP Events**
- `lsp.client.diagnostics`
- `lsp.updated`

**Message Events**
- `message.part.removed`
- `message.part.updated`
- `message.removed`
- `message.updated`

**Permission Events**
- `permission.asked`
- `permission.replied`

**Server Events**
- `server.connected`

**Session Events**
- `session.created`
- `session.compacted`
- `session.deleted`
- `session.diff`
- `session.error`
- `session.idle`
- `session.status`
- `session.updated`

**Todo Events**
- `todo.updated`

**Shell Events**
- `shell.env`

**Tool Events**
- `tool.execute.after`
- `tool.execute.before`

**TUI Events**
- `tui.prompt.append`
- `tui.command.execute`
- `tui.toast.show`

## Examples

Here are some examples of plugins you can use to extend opencode.

### Send notifications

Send notifications when certain events occur:

`.opencode/plugins/notification.js`
```javascript
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      // Send notification on session completion
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`
      }
    },
  }
}
```

We are using `osascript` to run AppleScript on macOS. Here we are using it to send notifications.

> **Note**
> If you’re using the OpenCode desktop app, it can send system notifications automatically when a response is ready or when a session errors.

### .env protection

Prevent opencode from reading `.env` files:

`.opencode/plugins/env-protection.js`
```javascript
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

### Inject environment variables

Inject environment variables into all shell execution (AI tools and user terminals):

`.opencode/plugins/inject-env.js`
```javascript
export const InjectEnvPlugin = async () => {
  return {
    "shell.env": async (input, output) => {
      output.env.MY_API_KEY = "secret"
      output.env.PROJECT_ROOT = input.cwd
    },
  }
}
```

### Custom tools

Plugins can also add custom tools to opencode:

`.opencode/plugins/custom-tools.ts`
```typescript
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "This is a custom tool",
        args: {
          foo: tool.schema.string(),
        },
        async execute(args, context) {
          const { directory, worktree } = context
          return `Hello ${args.foo} from ${directory} (worktree: ${worktree})`
        },
      }),
    },
  }
}
```

The `tool` helper creates a custom tool that opencode can call. It takes a Zod schema function and returns a tool definition with:

- `description`: What the tool does
- `args`: Zod schema for the tool’s arguments
- `execute`: Function that runs when the tool is called

Your custom tools will be available to opencode alongside built-in tools.

> **Note**
> If a plugin tool uses the same name as a built-in tool, the plugin tool takes precedence.

### Logging

Use `client.app.log()` instead of `console.log` for structured logging:

`.opencode/plugins/my-plugin.ts`
```typescript
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "Plugin initialized",
      extra: { foo: "bar" },
    },
  })
}
```

Levels: `debug`, `info`, `warn`, `error`. See SDK documentation for details.

### Compaction hooks

Customize the context included when a session is compacted:

`.opencode/plugins/compaction.ts`
```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const CompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Inject additional context into the compaction prompt
      output.context.push(`
## Custom Context

Include any state that should persist across compaction:
- Current task status
- Important decisions made
- Files being actively worked on
`)
    },
  }
}
```

The `experimental.session.compacting` hook fires before the LLM generates a continuation summary. Use it to inject domain-specific context that the default compaction prompt would miss.

You can also replace the compaction prompt entirely by setting `output.prompt`:

`.opencode/plugins/custom-compaction.ts`
```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const CustomCompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Replace the entire compaction prompt
      output.prompt = `
You are generating a continuation prompt for a multi-agent swarm session.

Summarize:
1. The current task and its status
2. Which files are being modified and by whom
3. Any blockers or dependencies between agents
4. The next steps to complete the work

Format as a structured prompt that a new agent can use to resume work.
`
    },
  }
}
```

When `output.prompt` is set, it completely replaces the default compaction prompt. The `output.context` array is ignored in this case.

# Ecosystem

Projects and integrations built with OpenCode.

A collection of community projects built on OpenCode.

> **Note**
> Want to add your OpenCode related project to this list? Submit a PR.
> You can also check out `awesome-opencode` and `opencode.cafe`, a community that aggregates the ecosystem and community.

## Plugins

| Name | Description |
| :--- | :--- |
| `opencode-daytona` | Automatically run OpenCode sessions in isolated Daytona sandboxes with git sync and live previews |
| `opencode-helicone-session` | Automatically inject Helicone session headers for request grouping |
| `opencode-type-inject` | Auto-inject TypeScript/Svelte types into file reads with lookup tools |
| `opencode-openai-codex-auth` | Use your ChatGPT Plus/Pro subscription instead of API credits |
| `opencode-gemini-auth` | Use your existing Gemini plan instead of API billing |
| `opencode-antigravity-auth` | Use Antigravity’s free models instead of API billing |
| `opencode-devcontainers` | Multi-branch devcontainer isolation with shallow clones and auto-assigned ports |
| `opencode-google-antigravity-auth` | Google Antigravity OAuth Plugin, with support for Google Search, and more robust API handling |
| `opencode-dynamic-context-pruning` | Optimize token usage by pruning obsolete tool outputs |
| `opencode-vibeguard` | Redact secrets/PII into VibeGuard-style placeholders before LLM calls; restore locally |
| `opencode-websearch-cited` | Add native websearch support for supported providers with Google grounded style |
| `opencode-pty` | Enables AI agents to run background processes in a PTY, send interactive input to them. |
| `opencode-shell-strategy` | Instructions for non-interactive shell commands - prevents hangs from TTY-dependent operations |
| `opencode-wakatime` | Track OpenCode usage with Wakatime |
| `opencode-md-table-formatter` | Clean up markdown tables produced by LLMs |
| `opencode-morph-fast-apply` | 10x faster code editing with Morph Fast Apply API and lazy edit markers |
| `opencode-morph-plugin` | Fast Apply editing, WarpGrep codebase search, and context compaction via Morph |
| `oh-my-opencode` | Background agents, pre-built LSP/AST/MCP tools, curated agents, Claude Code compatible |
| `opencode-notificator` | Desktop notifications and sound alerts for OpenCode sessions |
| `opencode-notifier` | Desktop notifications and sound alerts for permission, completion, and error events |
| `opencode-zellij-namer` | AI-powered automatic Zellij session naming based on OpenCode context |
| `opencode-skillful` | Allow OpenCode agents to lazy load prompts on demand with skill discovery and injection |
| `opencode-supermemory` | Persistent memory across sessions using Supermemory |
| `@plannotator/opencode` | Interactive plan review with visual annotation and private/offline sharing |
| `@openspoon/subtask2` | Extend opencode /commands into a powerful orchestration system with granular flow control |
| `opencode-scheduler` | Schedule recurring jobs using launchd (Mac) or systemd (Linux) with cron syntax |
| `opencode-conductor` | Protocol-Driven Workflow: Automation of the Context -> Spec -> Plan -> Implement lifecycle. |
| `micode` | Structured Brainstorm → Plan → Implement workflow with session continuity |
| `octto` | Interactive browser UI for AI brainstorming with multi-question forms |
| `opencode-background-agents` | Claude Code-style background agents with async delegation and context persistence |
| `opencode-notify` | Native OS notifications for OpenCode – know when tasks complete |
| `opencode-workspace` | Bundled multi-agent orchestration harness – 16 components, one install |
| `opencode-worktree` | Zero-friction git worktrees for OpenCode |
| `opencode-sentry-monitor` | Trace and debug your AI agents with Sentry AI Monitoring |
| `opencode-firecrawl` | Web scraping, crawling, and search via the Firecrawl CLI |
| `opencode-jfrog-plugin` | JFrog Plugin for seamless integration of Opencode users to JFrog platform |

## Projects

| Name | Description |
| :--- | :--- |
| `kimaki` | Discord bot to control OpenCode sessions, built on the SDK |
| `opencode.nvim` | Neovim plugin for editor-aware prompts, built on the API |
| `portal` | Mobile-first web UI for OpenCode over Tailscale/VPN |
| `opencode plugin template` | Template for building OpenCode plugins |
| `opencode.nvim` | Neovim frontend for opencode - a terminal-based AI coding agent |
| `ai-sdk-provider-opencode-sdk` | Vercel AI SDK provider for using OpenCode via @opencode-ai/sdk |
| `OpenChamber` | Web / Desktop App and VS Code Extension for OpenCode |
| `OpenCode-Obsidian` | Obsidian plugin that embeds OpenCode in Obsidian’s UI |
| `OpenWork` | An open-source alternative to Claude Cowork, powered by OpenCode |
| `ocx` | OpenCode extension manager with portable, isolated profiles. |
| `CodeNomad` | Desktop, Web, Mobile and Remote Client App for OpenCode |

## Agents

| Name | Description |
| :--- | :--- |
| `Agentic` | Modular AI agents and commands for structured development |
| `opencode-agents` | Configs, prompts, agents, and plugins for enhanced workflows |