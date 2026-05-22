# OpenCode OpenAPI Reference

Generated from local OpenCode `/doc` endpoint.

| Field | Value |
| --- | --- |
| OpenAPI | 3.1.0 |
| Title | opencode |
| Version | 1.0.0 |
| Description | opencode api |
| Generated at | 2026-05-14T17:48:04.144Z |
| Endpoint count | 131 |
| Schema count | 265 |

## Table Of Contents

- [Metadata](#metadata)
- [Tags](#tags)
- [Endpoints](#endpoints)
- [`GET /agent` - List agents](#endpoint-get-agent)
- [`GET /api/model` - List v2 models](#endpoint-get-api-model)
- [`GET /api/provider` - List v2 providers](#endpoint-get-api-provider)
- [`GET /api/provider/{providerID}` - Get v2 provider](#endpoint-get-api-provider-providerid)
- [`GET /api/session` - List v2 sessions](#endpoint-get-api-session)
- [`POST /api/session/{sessionID}/compact` - Compact v2 session](#endpoint-post-api-session-sessionid-compact)
- [`GET /api/session/{sessionID}/context` - Get v2 session context](#endpoint-get-api-session-sessionid-context)
- [`GET /api/session/{sessionID}/message` - Get v2 session messages](#endpoint-get-api-session-sessionid-message)
- [`POST /api/session/{sessionID}/prompt` - Send v2 message](#endpoint-post-api-session-sessionid-prompt)
- [`POST /api/session/{sessionID}/wait` - Wait for v2 session](#endpoint-post-api-session-sessionid-wait)
- [`PUT /auth/{providerID}` - Set auth credentials](#endpoint-put-auth-providerid)
- [`DELETE /auth/{providerID}` - Remove auth credentials](#endpoint-delete-auth-providerid)
- [`GET /command` - List commands](#endpoint-get-command)
- [`GET /config` - Get configuration](#endpoint-get-config)
- [`PATCH /config` - Update configuration](#endpoint-patch-config)
- [`GET /config/providers` - List config providers](#endpoint-get-config-providers)
- [`GET /event` - Subscribe to events](#endpoint-get-event)
- [`GET /experimental/console` - Get active Console provider metadata](#endpoint-get-experimental-console)
- [`GET /experimental/console/orgs` - List switchable Console orgs](#endpoint-get-experimental-console-orgs)
- [`POST /experimental/console/switch` - Switch active Console org](#endpoint-post-experimental-console-switch)
- [`GET /experimental/resource` - Get MCP resources](#endpoint-get-experimental-resource)
- [`GET /experimental/session` - List sessions](#endpoint-get-experimental-session)
- [`GET /experimental/tool` - List tools](#endpoint-get-experimental-tool)
- [`GET /experimental/tool/ids` - List tool IDs](#endpoint-get-experimental-tool-ids)
- [`GET /experimental/workspace` - List workspaces](#endpoint-get-experimental-workspace)
- [`POST /experimental/workspace` - Create workspace](#endpoint-post-experimental-workspace)
- [`DELETE /experimental/workspace/{id}` - Remove workspace](#endpoint-delete-experimental-workspace-id)
- [`GET /experimental/workspace/adapter` - List workspace adapters](#endpoint-get-experimental-workspace-adapter)
- [`GET /experimental/workspace/status` - Workspace status](#endpoint-get-experimental-workspace-status)
- [`POST /experimental/workspace/sync-list` - Sync workspace list](#endpoint-post-experimental-workspace-sync-list)
- [`POST /experimental/workspace/warp` - Warp session into workspace](#endpoint-post-experimental-workspace-warp)
- [`GET /experimental/worktree` - List worktrees](#endpoint-get-experimental-worktree)
- [`POST /experimental/worktree` - Create worktree](#endpoint-post-experimental-worktree)
- [`DELETE /experimental/worktree` - Remove worktree](#endpoint-delete-experimental-worktree)
- [`POST /experimental/worktree/reset` - Reset worktree](#endpoint-post-experimental-worktree-reset)
- [`GET /file` - List files](#endpoint-get-file)
- [`GET /file/content` - Read file](#endpoint-get-file-content)
- [`GET /file/status` - Get file status](#endpoint-get-file-status)
- [`GET /find` - Find text](#endpoint-get-find)
- [`GET /find/file` - Find files](#endpoint-get-find-file)
- [`GET /find/symbol` - Find symbols](#endpoint-get-find-symbol)
- [`GET /formatter` - Get formatter status](#endpoint-get-formatter)
- [`GET /global/config` - Get global configuration](#endpoint-get-global-config)
- [`PATCH /global/config` - Update global configuration](#endpoint-patch-global-config)
- [`POST /global/dispose` - Dispose instance](#endpoint-post-global-dispose)
- [`GET /global/event` - Get global events](#endpoint-get-global-event)
- [`GET /global/health` - Get health](#endpoint-get-global-health)
- [`POST /global/upgrade` - Upgrade opencode](#endpoint-post-global-upgrade)
- [`POST /instance/dispose` - Dispose instance](#endpoint-post-instance-dispose)
- [`POST /log` - Write log](#endpoint-post-log)
- [`GET /lsp` - Get LSP status](#endpoint-get-lsp)
- [`GET /mcp` - Get MCP status](#endpoint-get-mcp)
- [`POST /mcp` - Add MCP server](#endpoint-post-mcp)
- [`POST /mcp/{name}/auth` - Start MCP OAuth](#endpoint-post-mcp-name-auth)
- [`DELETE /mcp/{name}/auth` - Remove MCP OAuth](#endpoint-delete-mcp-name-auth)
- [`POST /mcp/{name}/auth/authenticate` - Authenticate MCP OAuth](#endpoint-post-mcp-name-auth-authenticate)
- [`POST /mcp/{name}/auth/callback` - Complete MCP OAuth](#endpoint-post-mcp-name-auth-callback)
- [`POST /mcp/{name}/connect` - mcp.connect](#endpoint-post-mcp-name-connect)
- [`POST /mcp/{name}/disconnect` - mcp.disconnect](#endpoint-post-mcp-name-disconnect)
- [`GET /path` - Get paths](#endpoint-get-path)
- [`GET /permission` - List pending permissions](#endpoint-get-permission)
- [`POST /permission/{requestID}/reply` - Respond to permission request](#endpoint-post-permission-requestid-reply)
- [`GET /project` - List all projects](#endpoint-get-project)
- [`PATCH /project/{projectID}` - Update project](#endpoint-patch-project-projectid)
- [`GET /project/current` - Get current project](#endpoint-get-project-current)
- [`POST /project/git/init` - Initialize git repository](#endpoint-post-project-git-init)
- [`GET /provider` - List providers](#endpoint-get-provider)
- [`POST /provider/{providerID}/oauth/authorize` - Start OAuth authorization](#endpoint-post-provider-providerid-oauth-authorize)
- [`POST /provider/{providerID}/oauth/callback` - Handle OAuth callback](#endpoint-post-provider-providerid-oauth-callback)
- [`GET /provider/auth` - Get provider auth methods](#endpoint-get-provider-auth)
- [`GET /pty` - List PTY sessions](#endpoint-get-pty)
- [`POST /pty` - Create PTY session](#endpoint-post-pty)
- [`GET /pty/{ptyID}` - Get PTY session](#endpoint-get-pty-ptyid)
- [`PUT /pty/{ptyID}` - Update PTY session](#endpoint-put-pty-ptyid)
- [`DELETE /pty/{ptyID}` - Remove PTY session](#endpoint-delete-pty-ptyid)
- [`GET /pty/{ptyID}/connect` - Connect to PTY session](#endpoint-get-pty-ptyid-connect)
- [`POST /pty/{ptyID}/connect-token` - Create PTY WebSocket token](#endpoint-post-pty-ptyid-connect-token)
- [`GET /pty/shells` - List available shells](#endpoint-get-pty-shells)
- [`GET /question` - List pending questions](#endpoint-get-question)
- [`POST /question/{requestID}/reject` - Reject question request](#endpoint-post-question-requestid-reject)
- [`POST /question/{requestID}/reply` - Reply to question request](#endpoint-post-question-requestid-reply)
- [`GET /session` - List sessions](#endpoint-get-session)
- [`POST /session` - Create session](#endpoint-post-session)
- [`GET /session/{sessionID}` - Get session](#endpoint-get-session-sessionid)
- [`PATCH /session/{sessionID}` - Update session](#endpoint-patch-session-sessionid)
- [`DELETE /session/{sessionID}` - Delete session](#endpoint-delete-session-sessionid)
- [`POST /session/{sessionID}/abort` - Abort session](#endpoint-post-session-sessionid-abort)
- [`GET /session/{sessionID}/children` - Get session children](#endpoint-get-session-sessionid-children)
- [`POST /session/{sessionID}/command` - Send command](#endpoint-post-session-sessionid-command)
- [`GET /session/{sessionID}/diff` - Get message diff](#endpoint-get-session-sessionid-diff)
- [`POST /session/{sessionID}/fork` - Fork session](#endpoint-post-session-sessionid-fork)
- [`POST /session/{sessionID}/init` - Initialize session](#endpoint-post-session-sessionid-init)
- [`GET /session/{sessionID}/message` - Get session messages](#endpoint-get-session-sessionid-message)
- [`POST /session/{sessionID}/message` - Send message](#endpoint-post-session-sessionid-message)
- [`GET /session/{sessionID}/message/{messageID}` - Get message](#endpoint-get-session-sessionid-message-messageid)
- [`DELETE /session/{sessionID}/message/{messageID}` - Delete message](#endpoint-delete-session-sessionid-message-messageid)
- [`PATCH /session/{sessionID}/message/{messageID}/part/{partID}` - part.update](#endpoint-patch-session-sessionid-message-messageid-part-partid)
- [`DELETE /session/{sessionID}/message/{messageID}/part/{partID}` - part.delete](#endpoint-delete-session-sessionid-message-messageid-part-partid)
- [`POST /session/{sessionID}/permissions/{permissionID}` - Respond to permission](#endpoint-post-session-sessionid-permissions-permissionid)
- [`POST /session/{sessionID}/prompt_async` - Send async message](#endpoint-post-session-sessionid-prompt-async)
- [`POST /session/{sessionID}/revert` - Revert message](#endpoint-post-session-sessionid-revert)
- [`POST /session/{sessionID}/share` - Share session](#endpoint-post-session-sessionid-share)
- [`DELETE /session/{sessionID}/share` - Unshare session](#endpoint-delete-session-sessionid-share)
- [`POST /session/{sessionID}/shell` - Run shell command](#endpoint-post-session-sessionid-shell)
- [`POST /session/{sessionID}/summarize` - Summarize session](#endpoint-post-session-sessionid-summarize)
- [`GET /session/{sessionID}/todo` - Get session todos](#endpoint-get-session-sessionid-todo)
- [`POST /session/{sessionID}/unrevert` - Restore reverted messages](#endpoint-post-session-sessionid-unrevert)
- [`GET /session/status` - Get session status](#endpoint-get-session-status)
- [`GET /skill` - List skills](#endpoint-get-skill)
- [`POST /sync/history` - List sync events](#endpoint-post-sync-history)
- [`POST /sync/replay` - Replay sync events](#endpoint-post-sync-replay)
- [`POST /sync/start` - Start workspace sync](#endpoint-post-sync-start)
- [`POST /sync/steal` - Steal session into workspace](#endpoint-post-sync-steal)
- [`POST /tui/append-prompt` - Append TUI prompt](#endpoint-post-tui-append-prompt)
- [`POST /tui/clear-prompt` - Clear TUI prompt](#endpoint-post-tui-clear-prompt)
- [`GET /tui/control/next` - Get next TUI request](#endpoint-get-tui-control-next)
- [`POST /tui/control/response` - Submit TUI response](#endpoint-post-tui-control-response)
- [`POST /tui/execute-command` - Execute TUI command](#endpoint-post-tui-execute-command)
- [`POST /tui/open-help` - Open help dialog](#endpoint-post-tui-open-help)
- [`POST /tui/open-models` - Open models dialog](#endpoint-post-tui-open-models)
- [`POST /tui/open-sessions` - Open sessions dialog](#endpoint-post-tui-open-sessions)
- [`POST /tui/open-themes` - Open themes dialog](#endpoint-post-tui-open-themes)
- [`POST /tui/publish` - Publish TUI event](#endpoint-post-tui-publish)
- [`POST /tui/select-session` - Select session](#endpoint-post-tui-select-session)
- [`POST /tui/show-toast` - Show TUI toast](#endpoint-post-tui-show-toast)
- [`POST /tui/submit-prompt` - Submit TUI prompt](#endpoint-post-tui-submit-prompt)
- [`GET /vcs` - Get VCS info](#endpoint-get-vcs)
- [`POST /vcs/apply` - Apply VCS patch](#endpoint-post-vcs-apply)
- [`GET /vcs/diff` - Get VCS diff](#endpoint-get-vcs-diff)
- [`GET /vcs/diff/raw` - Get raw VCS diff](#endpoint-get-vcs-diff-raw)
- [`GET /vcs/status` - Get VCS status](#endpoint-get-vcs-status)
- [Components](#components)
- [Schemas](#schemas)
- [`Agent`](#schema-agent)
- [`AgentConfig`](#schema-agentconfig)
- [`AgentPart`](#schema-agentpart)
- [`AgentPartInput`](#schema-agentpartinput)
- [`ApiAuth`](#schema-apiauth)
- [`APIError`](#schema-apierror)
- [`AssistantMessage`](#schema-assistantmessage)
- [`AttachmentConfig`](#schema-attachmentconfig)
- [`Auth`](#schema-auth)
- [`BadRequestError`](#schema-badrequesterror)
- [`Command`](#schema-command)
- [`CompactionPart`](#schema-compactionpart)
- [`Config`](#schema-config)
- [`ConsoleState`](#schema-consolestate)
- [`ContextOverflowError`](#schema-contextoverflowerror)
- [`effect_HttpApiError_Forbidden`](#schema-effect-httpapierror-forbidden)
- [`effect_HttpApiError_InternalServerError`](#schema-effect-httpapierror-internalservererror)
- [`Event`](#schema-event)
- [`Event.tui.command.execute`](#schema-event-tui-command-execute)
- [`Event.tui.prompt.append`](#schema-event-tui-prompt-append)
- [`Event.tui.session.select`](#schema-event-tui-session-select)
- [`Event.tui.toast.show`](#schema-event-tui-toast-show)
- [`EventCommandExecuted`](#schema-eventcommandexecuted)
- [`EventFileEdited`](#schema-eventfileedited)
- [`EventFileWatcherUpdated`](#schema-eventfilewatcherupdated)
- [`EventGlobalDisposed`](#schema-eventglobaldisposed)
- [`EventInstallationUpdate-available`](#schema-eventinstallationupdate-available)
- [`EventInstallationUpdated`](#schema-eventinstallationupdated)
- [`EventLspClientDiagnostics`](#schema-eventlspclientdiagnostics)
- [`EventLspUpdated`](#schema-eventlspupdated)
- [`EventMcpBrowserOpenFailed`](#schema-eventmcpbrowseropenfailed)
- [`EventMcpToolsChanged`](#schema-eventmcptoolschanged)
- [`EventMessagePartDelta`](#schema-eventmessagepartdelta)
- [`EventMessagePartRemoved`](#schema-eventmessagepartremoved)
- [`EventMessagePartUpdated`](#schema-eventmessagepartupdated)
- [`EventMessageRemoved`](#schema-eventmessageremoved)
- [`EventMessageUpdated`](#schema-eventmessageupdated)
- [`EventPermissionAsked`](#schema-eventpermissionasked)
- [`EventPermissionReplied`](#schema-eventpermissionreplied)
- [`EventProjectUpdated`](#schema-eventprojectupdated)
- [`EventPtyCreated`](#schema-eventptycreated)
- [`EventPtyDeleted`](#schema-eventptydeleted)
- [`EventPtyExited`](#schema-eventptyexited)
- [`EventPtyUpdated`](#schema-eventptyupdated)
- [`EventQuestionAsked`](#schema-eventquestionasked)
- [`EventQuestionRejected`](#schema-eventquestionrejected)
- [`EventQuestionReplied`](#schema-eventquestionreplied)
- [`EventServerConnected`](#schema-eventserverconnected)
- [`EventServerInstanceDisposed`](#schema-eventserverinstancedisposed)
- [`EventSessionCompacted`](#schema-eventsessioncompacted)
- [`EventSessionCreated`](#schema-eventsessioncreated)
- [`EventSessionDeleted`](#schema-eventsessiondeleted)
- [`EventSessionDiff`](#schema-eventsessiondiff)
- [`EventSessionError`](#schema-eventsessionerror)
- [`EventSessionIdle`](#schema-eventsessionidle)
- [`EventSessionNextAgentSwitched`](#schema-eventsessionnextagentswitched)
- [`EventSessionNextCompactionDelta`](#schema-eventsessionnextcompactiondelta)
- [`EventSessionNextCompactionEnded`](#schema-eventsessionnextcompactionended)
- [`EventSessionNextCompactionStarted`](#schema-eventsessionnextcompactionstarted)
- [`EventSessionNextModelSwitched`](#schema-eventsessionnextmodelswitched)
- [`EventSessionNextPrompted`](#schema-eventsessionnextprompted)
- [`EventSessionNextReasoningDelta`](#schema-eventsessionnextreasoningdelta)
- [`EventSessionNextReasoningEnded`](#schema-eventsessionnextreasoningended)
- [`EventSessionNextReasoningStarted`](#schema-eventsessionnextreasoningstarted)
- [`EventSessionNextRetried`](#schema-eventsessionnextretried)
- [`EventSessionNextShellEnded`](#schema-eventsessionnextshellended)
- [`EventSessionNextShellStarted`](#schema-eventsessionnextshellstarted)
- [`EventSessionNextStepEnded`](#schema-eventsessionnextstepended)
- [`EventSessionNextStepFailed`](#schema-eventsessionnextstepfailed)
- [`EventSessionNextStepStarted`](#schema-eventsessionnextstepstarted)
- [`EventSessionNextSynthetic`](#schema-eventsessionnextsynthetic)
- [`EventSessionNextTextDelta`](#schema-eventsessionnexttextdelta)
- [`EventSessionNextTextEnded`](#schema-eventsessionnexttextended)
- [`EventSessionNextTextStarted`](#schema-eventsessionnexttextstarted)
- [`EventSessionNextToolCalled`](#schema-eventsessionnexttoolcalled)
- [`EventSessionNextToolFailed`](#schema-eventsessionnexttoolfailed)
- [`EventSessionNextToolInputDelta`](#schema-eventsessionnexttoolinputdelta)
- [`EventSessionNextToolInputEnded`](#schema-eventsessionnexttoolinputended)
- [`EventSessionNextToolInputStarted`](#schema-eventsessionnexttoolinputstarted)
- [`EventSessionNextToolProgress`](#schema-eventsessionnexttoolprogress)
- [`EventSessionNextToolSuccess`](#schema-eventsessionnexttoolsuccess)
- [`EventSessionStatus`](#schema-eventsessionstatus)
- [`EventSessionUpdated`](#schema-eventsessionupdated)
- [`EventTodoUpdated`](#schema-eventtodoupdated)
- [`EventTuiCommandExecute`](#schema-eventtuicommandexecute)
- [`EventTuiPromptAppend`](#schema-eventtuipromptappend)
- [`EventTuiSessionSelect`](#schema-eventtuisessionselect)
- [`EventTuiToastShow`](#schema-eventtuitoastshow)
- [`EventTuiToastShow1`](#schema-eventtuitoastshow1)
- [`EventVcsBranchUpdated`](#schema-eventvcsbranchupdated)
- [`EventWorkspaceFailed`](#schema-eventworkspacefailed)
- [`EventWorkspaceReady`](#schema-eventworkspaceready)
- [`EventWorkspaceStatus`](#schema-eventworkspacestatus)
- [`EventWorktreeFailed`](#schema-eventworktreefailed)
- [`EventWorktreeReady`](#schema-eventworktreeready)
- [`File`](#schema-file)
- [`FileContent`](#schema-filecontent)
- [`FileNode`](#schema-filenode)
- [`FilePart`](#schema-filepart)
- [`FilePartInput`](#schema-filepartinput)
- [`FilePartSource`](#schema-filepartsource)
- [`FilePartSourceText`](#schema-filepartsourcetext)
- [`FileSource`](#schema-filesource)
- [`FormatterStatus`](#schema-formatterstatus)
- [`GlobalEvent`](#schema-globalevent)
- [`GlobalSession`](#schema-globalsession)
- [`ImageAttachmentConfig`](#schema-imageattachmentconfig)
- [`JSONSchema`](#schema-jsonschema)
- [`LayoutConfig`](#schema-layoutconfig)
- [`LogLevel`](#schema-loglevel)
- [`LSPStatus`](#schema-lspstatus)
- [`McpLocalConfig`](#schema-mcplocalconfig)
- [`McpOAuthConfig`](#schema-mcpoauthconfig)
- [`McpRemoteConfig`](#schema-mcpremoteconfig)
- [`McpResource`](#schema-mcpresource)
- [`MCPStatus`](#schema-mcpstatus)
- [`MCPStatusConnected`](#schema-mcpstatusconnected)
- [`MCPStatusDisabled`](#schema-mcpstatusdisabled)
- [`MCPStatusFailed`](#schema-mcpstatusfailed)
- [`MCPStatusNeedsAuth`](#schema-mcpstatusneedsauth)
- [`MCPStatusNeedsClientRegistration`](#schema-mcpstatusneedsclientregistration)
- [`McpUnsupportedOAuthError`](#schema-mcpunsupportedoautherror)
- [`Message`](#schema-message)
- [`MessageAbortedError`](#schema-messageabortederror)
- [`MessageOutputLengthError`](#schema-messageoutputlengtherror)
- [`Model`](#schema-model)
- [`ModelV2Info`](#schema-modelv2info)
- [`NotFoundError`](#schema-notfounderror)
- [`OAuth`](#schema-oauth)
- [`OutputFormat`](#schema-outputformat)
- [`OutputFormatJsonSchema`](#schema-outputformatjsonschema)
- [`OutputFormatText`](#schema-outputformattext)
- [`Part`](#schema-part)
- [`PatchPart`](#schema-patchpart)
- [`Path`](#schema-path)
- [`PermissionAction`](#schema-permissionaction)
- [`PermissionActionConfig`](#schema-permissionactionconfig)
- [`PermissionConfig`](#schema-permissionconfig)
- [`PermissionObjectConfig`](#schema-permissionobjectconfig)
- [`PermissionRequest`](#schema-permissionrequest)
- [`PermissionRule`](#schema-permissionrule)
- [`PermissionRuleConfig`](#schema-permissionruleconfig)
- [`PermissionRuleset`](#schema-permissionruleset)
- [`Project`](#schema-project)
- [`ProjectSummary`](#schema-projectsummary)
- [`Prompt`](#schema-prompt)
- [`PromptAgentAttachment`](#schema-promptagentattachment)
- [`PromptFileAttachment`](#schema-promptfileattachment)
- [`PromptReferenceAttachment`](#schema-promptreferenceattachment)
- [`PromptSource`](#schema-promptsource)
- [`Provider`](#schema-provider)
- [`ProviderAuthAuthorization`](#schema-providerauthauthorization)
- [`ProviderAuthError`](#schema-providerautherror)
- [`ProviderAuthError1`](#schema-providerautherror1)
- [`ProviderAuthMethod`](#schema-providerauthmethod)
- [`ProviderConfig`](#schema-providerconfig)
- [`ProviderV2Info`](#schema-providerv2info)
- [`Pty`](#schema-pty)
- [`QuestionAnswer`](#schema-questionanswer)
- [`QuestionInfo`](#schema-questioninfo)
- [`QuestionOption`](#schema-questionoption)
- [`QuestionRejected`](#schema-questionrejected)
- [`QuestionReplied`](#schema-questionreplied)
- [`QuestionRequest`](#schema-questionrequest)
- [`QuestionTool`](#schema-questiontool)
- [`Range`](#schema-range)
- [`ReasoningPart`](#schema-reasoningpart)
- [`ReferenceConfig`](#schema-referenceconfig)
- [`ReferenceConfigEntry`](#schema-referenceconfigentry)
- [`ResourceSource`](#schema-resourcesource)
- [`RetryPart`](#schema-retrypart)
- [`ServerConfig`](#schema-serverconfig)
- [`Session`](#schema-session)
- [`SessionDelivery`](#schema-sessiondelivery)
- [`SessionErrorUnknown`](#schema-sessionerrorunknown)
- [`SessionInfo`](#schema-sessioninfo)
- [`SessionMessage`](#schema-sessionmessage)
- [`SessionMessageAgentSwitched`](#schema-sessionmessageagentswitched)
- [`SessionMessageAssistant`](#schema-sessionmessageassistant)
- [`SessionMessageAssistantReasoning`](#schema-sessionmessageassistantreasoning)
- [`SessionMessageAssistantText`](#schema-sessionmessageassistanttext)
- [`SessionMessageAssistantTool`](#schema-sessionmessageassistanttool)
- [`SessionMessageCompaction`](#schema-sessionmessagecompaction)
- [`SessionMessageModelSwitched`](#schema-sessionmessagemodelswitched)
- [`SessionMessageShell`](#schema-sessionmessageshell)
- [`SessionMessageSynthetic`](#schema-sessionmessagesynthetic)
- [`SessionMessageToolStateCompleted`](#schema-sessionmessagetoolstatecompleted)
- [`SessionMessageToolStateError`](#schema-sessionmessagetoolstateerror)
- [`SessionMessageToolStatePending`](#schema-sessionmessagetoolstatepending)
- [`SessionMessageToolStateRunning`](#schema-sessionmessagetoolstaterunning)
- [`SessionMessageUser`](#schema-sessionmessageuser)
- [`SessionNextRetry_error`](#schema-sessionnextretry-error)
- [`SessionStatus`](#schema-sessionstatus)
- [`SnapshotFileDiff`](#schema-snapshotfilediff)
- [`SnapshotPart`](#schema-snapshotpart)
- [`StepFinishPart`](#schema-stepfinishpart)
- [`StepStartPart`](#schema-stepstartpart)
- [`StructuredOutputError`](#schema-structuredoutputerror)
- [`SubtaskPart`](#schema-subtaskpart)
- [`SubtaskPartInput`](#schema-subtaskpartinput)
- [`Symbol`](#schema-symbol)
- [`SymbolSource`](#schema-symbolsource)
- [`SyncEventMessagePartRemoved`](#schema-synceventmessagepartremoved)
- [`SyncEventMessagePartUpdated`](#schema-synceventmessagepartupdated)
- [`SyncEventMessageRemoved`](#schema-synceventmessageremoved)
- [`SyncEventMessageUpdated`](#schema-synceventmessageupdated)
- [`SyncEventSessionCreated`](#schema-synceventsessioncreated)
- [`SyncEventSessionDeleted`](#schema-synceventsessiondeleted)
- [`SyncEventSessionNextAgentSwitched`](#schema-synceventsessionnextagentswitched)
- [`SyncEventSessionNextCompactionDelta`](#schema-synceventsessionnextcompactiondelta)
- [`SyncEventSessionNextCompactionEnded`](#schema-synceventsessionnextcompactionended)
- [`SyncEventSessionNextCompactionStarted`](#schema-synceventsessionnextcompactionstarted)
- [`SyncEventSessionNextModelSwitched`](#schema-synceventsessionnextmodelswitched)
- [`SyncEventSessionNextPrompted`](#schema-synceventsessionnextprompted)
- [`SyncEventSessionNextReasoningDelta`](#schema-synceventsessionnextreasoningdelta)
- [`SyncEventSessionNextReasoningEnded`](#schema-synceventsessionnextreasoningended)
- [`SyncEventSessionNextReasoningStarted`](#schema-synceventsessionnextreasoningstarted)
- [`SyncEventSessionNextRetried`](#schema-synceventsessionnextretried)
- [`SyncEventSessionNextShellEnded`](#schema-synceventsessionnextshellended)
- [`SyncEventSessionNextShellStarted`](#schema-synceventsessionnextshellstarted)
- [`SyncEventSessionNextStepEnded`](#schema-synceventsessionnextstepended)
- [`SyncEventSessionNextStepFailed`](#schema-synceventsessionnextstepfailed)
- [`SyncEventSessionNextStepStarted`](#schema-synceventsessionnextstepstarted)
- [`SyncEventSessionNextSynthetic`](#schema-synceventsessionnextsynthetic)
- [`SyncEventSessionNextTextDelta`](#schema-synceventsessionnexttextdelta)
- [`SyncEventSessionNextTextEnded`](#schema-synceventsessionnexttextended)
- [`SyncEventSessionNextTextStarted`](#schema-synceventsessionnexttextstarted)
- [`SyncEventSessionNextToolCalled`](#schema-synceventsessionnexttoolcalled)
- [`SyncEventSessionNextToolFailed`](#schema-synceventsessionnexttoolfailed)
- [`SyncEventSessionNextToolInputDelta`](#schema-synceventsessionnexttoolinputdelta)
- [`SyncEventSessionNextToolInputEnded`](#schema-synceventsessionnexttoolinputended)
- [`SyncEventSessionNextToolInputStarted`](#schema-synceventsessionnexttoolinputstarted)
- [`SyncEventSessionNextToolProgress`](#schema-synceventsessionnexttoolprogress)
- [`SyncEventSessionNextToolSuccess`](#schema-synceventsessionnexttoolsuccess)
- [`SyncEventSessionUpdated`](#schema-synceventsessionupdated)
- [`TextPart`](#schema-textpart)
- [`TextPartInput`](#schema-textpartinput)
- [`Todo`](#schema-todo)
- [`ToolFileContent`](#schema-toolfilecontent)
- [`ToolIDs`](#schema-toolids)
- [`ToolList`](#schema-toollist)
- [`ToolListItem`](#schema-toollistitem)
- [`ToolPart`](#schema-toolpart)
- [`ToolState`](#schema-toolstate)
- [`ToolStateCompleted`](#schema-toolstatecompleted)
- [`ToolStateError`](#schema-toolstateerror)
- [`ToolStatePending`](#schema-toolstatepending)
- [`ToolStateRunning`](#schema-toolstaterunning)
- [`ToolTextContent`](#schema-tooltextcontent)
- [`UnknownError`](#schema-unknownerror)
- [`UserMessage`](#schema-usermessage)
- [`V2SessionMessagesResponse`](#schema-v2sessionmessagesresponse)
- [`V2SessionsResponse`](#schema-v2sessionsresponse)
- [`VcsApplyError`](#schema-vcsapplyerror)
- [`VcsFileDiff`](#schema-vcsfilediff)
- [`VcsFileStatus`](#schema-vcsfilestatus)
- [`VcsInfo`](#schema-vcsinfo)
- [`WellKnownAuth`](#schema-wellknownauth)
- [`Workspace`](#schema-workspace)
- [`WorkspaceWarpError`](#schema-workspacewarperror)
- [`Worktree`](#schema-worktree)
- [`WorktreeCreateInput`](#schema-worktreecreateinput)
- [`WorktreeError`](#schema-worktreeerror)
- [`WorktreeRemoveInput`](#schema-worktreeremoveinput)
- [`WorktreeResetInput`](#schema-worktreeresetinput)

## Metadata

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "opencode",
    "version": "1.0.0",
    "description": "opencode api"
  },
  "security": []
}
```

## Tags

| Name | Description |
| --- | --- |
| control | Control plane routes. |
| global | Global server routes. |
| event | Instance event stream route. |
| config | Experimental HttpApi config routes. |
| experimental | Experimental HttpApi read-only routes. |
| file | Experimental HttpApi file routes. |
| instance | Experimental HttpApi instance read routes. |
| mcp | Experimental HttpApi MCP routes. |
| project | Experimental HttpApi project routes. |
| pty | Experimental HttpApi PTY routes. |
| question | Question routes. |
| permission | Experimental HttpApi permission routes. |
| provider | Experimental HttpApi provider routes. |
| session | Experimental HttpApi session routes. |
| sync | Experimental HttpApi sync routes. |
| v2 | Experimental v2 routes. |
| v2 messages | Experimental v2 message routes. |
| v2 models | Experimental v2 model routes. |
| v2 providers | Experimental v2 provider routes. |
| tui | Experimental HttpApi TUI routes. |
| workspace | Experimental HttpApi workspace routes. |
| pty | PTY websocket route. |

## Endpoints

<a id="endpoint-get-agent"></a>
### `GET /agent`

| Field | Value |
| --- | --- |
| Operation ID | app.agents |
| Summary | List agents |
| Description | Get a list of all available AI agents in the OpenCode system. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of agents | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of agents",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Agent"
          },
          "description": "List of agents"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-api-model"></a>
### `GET /api/model`

| Field | Value |
| --- | --- |
| Operation ID | v2.model.list |
| Summary | List v2 models |
| Description | Retrieve available v2 models ordered by release date. |
| Tags | v2 models |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| instance | query | false | - | `object` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "instance",
    "in": "query",
    "schema": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string"
        },
        "workspace": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "required": false,
    "style": "deepObject",
    "explode": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Success | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Success",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ModelV2Info"
          }
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-api-provider"></a>
### `GET /api/provider`

| Field | Value |
| --- | --- |
| Operation ID | v2.provider.list |
| Summary | List v2 providers |
| Description | Retrieve active v2 AI providers so clients can show provider availability and configuration. |
| Tags | v2 providers |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| instance | query | false | - | `object` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "instance",
    "in": "query",
    "schema": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string"
        },
        "workspace": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "required": false,
    "style": "deepObject",
    "explode": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Success | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Success",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/ProviderV2Info"
          }
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-api-provider-providerid"></a>
### `GET /api/provider/{providerID}`

| Field | Value |
| --- | --- |
| Operation ID | v2.provider.get |
| Summary | Get v2 provider |
| Description | Retrieve a single v2 AI provider so clients can inspect its availability and endpoint settings. |
| Tags | v2 providers |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| providerID | path | true | - | `string` |
| instance | query | false | - | `object` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "providerID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "instance",
    "in": "query",
    "schema": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string"
        },
        "workspace": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "required": false,
    "style": "deepObject",
    "explode": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | ProviderV2.Info | application/json | `#/components/schemas/ProviderV2Info` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "ProviderV2.Info",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ProviderV2Info"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-api-session"></a>
### `GET /api/session`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.list |
| Summary | List v2 sessions |
| Description | Retrieve sessions in the requested order. Items keep that order across pages; use cursor.next or cursor.previous to move through the ordered list. |
| Tags | v2 |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| limit | query | false | - | `number` |
| order | query | false | - | `string` |
| path | query | false | - | `string` |
| roots | query | false | - | `anyOf` |
| start | query | false | - | `number` |
| search | query | false | - | `string` |
| cursor | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "order",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "asc",
        "desc"
      ]
    },
    "required": false
  },
  {
    "name": "path",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "roots",
    "in": "query",
    "schema": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "enum": [
            "true",
            "false"
          ]
        }
      ]
    },
    "required": false
  },
  {
    "name": "start",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "search",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "cursor",
    "in": "query",
    "schema": {
      "type": "string",
      "description": "Opaque pagination cursor returned as cursor.previous or cursor.next in the previous response. Do not combine with order or filters."
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | V2SessionsResponse | application/json | `#/components/schemas/V2SessionsResponse` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "V2SessionsResponse",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/V2SessionsResponse"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-api-session-sessionid-compact"></a>
### `POST /api/session/{sessionID}/compact`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.compact |
| Summary | Compact v2 session |
| Description | Compact a v2 session conversation. |
| Tags | v2 |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 204 | <No Content> | - | - |

<details>
<summary>Raw responses</summary>

```json
{
  "204": {
    "description": "<No Content>"
  }
}
```
</details>

<a id="endpoint-get-api-session-sessionid-context"></a>
### `GET /api/session/{sessionID}/context`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.context |
| Summary | Get v2 session context |
| Description | Retrieve the active context messages for a v2 session (all messages after the last compaction). |
| Tags | v2 |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Success | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Success",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SessionMessage"
          }
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-api-session-sessionid-message"></a>
### `GET /api/session/{sessionID}/message`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.messages |
| Summary | Get v2 session messages |
| Description | Retrieve projected v2 messages for a session. Items keep the requested order across pages; use cursor.next or cursor.previous to move through the ordered timeline. |
| Tags | v2 messages |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| limit | query | false | - | `number` |
| order | query | false | - | `string` |
| cursor | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "order",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "asc",
        "desc"
      ]
    },
    "required": false
  },
  {
    "name": "cursor",
    "in": "query",
    "schema": {
      "type": "string",
      "description": "Opaque pagination cursor returned as cursor.previous or cursor.next in the previous response. Do not combine with order."
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | V2SessionMessagesResponse | application/json | `#/components/schemas/V2SessionMessagesResponse` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "V2SessionMessagesResponse",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/V2SessionMessagesResponse"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-api-session-sessionid-prompt"></a>
### `POST /api/session/{sessionID}/prompt`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.prompt |
| Summary | Send v2 message |
| Description | Create a v2 session message and queue it for the agent loop. |
| Tags | v2 |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "prompt": {
            "$ref": "#/components/schemas/Prompt"
          },
          "delivery": {
            "$ref": "#/components/schemas/SessionDelivery"
          }
        },
        "required": [
          "prompt"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session.Message | application/json | `#/components/schemas/SessionMessage` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session.Message",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SessionMessage"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-api-session-sessionid-wait"></a>
### `POST /api/session/{sessionID}/wait`

| Field | Value |
| --- | --- |
| Operation ID | v2.session.wait |
| Summary | Wait for v2 session |
| Description | Wait for a v2 session agent loop to become idle. |
| Tags | v2 |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 204 | <No Content> | - | - |

<details>
<summary>Raw responses</summary>

```json
{
  "204": {
    "description": "<No Content>"
  }
}
```
</details>

<a id="endpoint-put-auth-providerid"></a>
### `PUT /auth/{providerID}`

| Field | Value |
| --- | --- |
| Operation ID | auth.set |
| Summary | Set auth credentials |
| Description | Set authentication credentials |
| Tags | control |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| providerID | path | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "providerID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/Auth"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully set authentication credentials | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully set authentication credentials",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Successfully set authentication credentials"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-auth-providerid"></a>
### `DELETE /auth/{providerID}`

| Field | Value |
| --- | --- |
| Operation ID | auth.remove |
| Summary | Remove auth credentials |
| Description | Remove authentication credentials |
| Tags | control |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| providerID | path | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "providerID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully removed authentication credentials | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully removed authentication credentials",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Successfully removed authentication credentials"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-command"></a>
### `GET /command`

| Field | Value |
| --- | --- |
| Operation ID | command.list |
| Summary | List commands |
| Description | Get a list of all available commands in the OpenCode system. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of commands | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of commands",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Command"
          },
          "description": "List of commands"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-config"></a>
### `GET /config`

| Field | Value |
| --- | --- |
| Operation ID | config.get |
| Summary | Get configuration |
| Description | Retrieve the current OpenCode configuration settings and preferences. |
| Tags | config |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Get config info | application/json | `#/components/schemas/Config` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Get config info",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Config"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-patch-config"></a>
### `PATCH /config`

| Field | Value |
| --- | --- |
| Operation ID | config.update |
| Summary | Update configuration |
| Description | Update OpenCode configuration settings and preferences. |
| Tags | config |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/Config"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully updated config | application/json | `#/components/schemas/Config` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully updated config",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Config"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-config-providers"></a>
### `GET /config/providers`

| Field | Value |
| --- | --- |
| Operation ID | config.providers |
| Summary | List config providers |
| Description | Get a list of all configured AI providers and their default models. |
| Tags | config |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of providers | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of providers",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "providers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Provider"
              }
            },
            "default": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            }
          },
          "required": [
            "providers",
            "default"
          ],
          "additionalProperties": false,
          "description": "List of providers"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-event"></a>
### `GET /event`

| Field | Value |
| --- | --- |
| Operation ID | event.subscribe |
| Summary | Subscribe to events |
| Description | Get events |
| Tags | event |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Event stream | text/event-stream | `#/components/schemas/Event` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Event stream",
    "content": {
      "text/event-stream": {
        "schema": {
          "$ref": "#/components/schemas/Event"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-console"></a>
### `GET /experimental/console`

| Field | Value |
| --- | --- |
| Operation ID | experimental.console.get |
| Summary | Get active Console provider metadata |
| Description | Get the active Console org name and the set of provider IDs managed by that Console org. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Active Console provider metadata | application/json | `#/components/schemas/ConsoleState` |
| 500 | InternalServerError | application/json | `#/components/schemas/effect_HttpApiError_InternalServerError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Active Console provider metadata",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ConsoleState"
        }
      }
    }
  },
  "500": {
    "description": "InternalServerError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_InternalServerError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-console-orgs"></a>
### `GET /experimental/console/orgs`

| Field | Value |
| --- | --- |
| Operation ID | experimental.console.listOrgs |
| Summary | List switchable Console orgs |
| Description | Get the available Console orgs across logged-in accounts, including the current active org. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Switchable Console orgs | application/json | `object` |
| 500 | InternalServerError | application/json | `#/components/schemas/effect_HttpApiError_InternalServerError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Switchable Console orgs",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "orgs": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "accountID": {
                    "type": "string"
                  },
                  "accountEmail": {
                    "type": "string"
                  },
                  "accountUrl": {
                    "type": "string"
                  },
                  "orgID": {
                    "type": "string"
                  },
                  "orgName": {
                    "type": "string"
                  },
                  "active": {
                    "type": "boolean"
                  }
                },
                "required": [
                  "accountID",
                  "accountEmail",
                  "accountUrl",
                  "orgID",
                  "orgName",
                  "active"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "orgs"
          ],
          "additionalProperties": false,
          "description": "Switchable Console orgs"
        }
      }
    }
  },
  "500": {
    "description": "InternalServerError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_InternalServerError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-experimental-console-switch"></a>
### `POST /experimental/console/switch`

| Field | Value |
| --- | --- |
| Operation ID | experimental.console.switchOrg |
| Summary | Switch active Console org |
| Description | Persist a new active Console account/org selection for the current local OpenCode state. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "accountID": {
            "type": "string"
          },
          "orgID": {
            "type": "string"
          }
        },
        "required": [
          "accountID",
          "orgID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Switch success | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Switch success",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Switch success"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-resource"></a>
### `GET /experimental/resource`

| Field | Value |
| --- | --- |
| Operation ID | experimental.resource.list |
| Summary | Get MCP resources |
| Description | Get all available MCP resources from connected servers. Optionally filter by name. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | MCP resources | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "MCP resources",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/components/schemas/McpResource"
          },
          "description": "MCP resources"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-session"></a>
### `GET /experimental/session`

| Field | Value |
| --- | --- |
| Operation ID | experimental.session.list |
| Summary | List sessions |
| Description | Get a list of all OpenCode sessions across projects, sorted by most recently updated. Archived sessions are excluded by default. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| roots | query | false | - | `anyOf` |
| start | query | false | - | `number` |
| cursor | query | false | - | `number` |
| search | query | false | - | `string` |
| limit | query | false | - | `number` |
| archived | query | false | - | `anyOf` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "roots",
    "in": "query",
    "schema": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "enum": [
            "true",
            "false"
          ]
        }
      ]
    },
    "required": false
  },
  {
    "name": "start",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "cursor",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "search",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "archived",
    "in": "query",
    "schema": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "enum": [
            "true",
            "false"
          ]
        }
      ]
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of sessions | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of sessions",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/GlobalSession"
          },
          "description": "List of sessions"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-tool"></a>
### `GET /experimental/tool`

| Field | Value |
| --- | --- |
| Operation ID | tool.list |
| Summary | List tools |
| Description | Get a list of available tools with their JSON schema parameters for a specific provider and model combination. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| provider | query | true | - | `string` |
| model | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "provider",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "model",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Tools | application/json | `#/components/schemas/ToolList` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Tools",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ToolList"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-tool-ids"></a>
### `GET /experimental/tool/ids`

| Field | Value |
| --- | --- |
| Operation ID | tool.ids |
| Summary | List tool IDs |
| Description | Get a list of all available tool IDs, including both built-in tools and dynamically registered tools. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Tool IDs | application/json | `#/components/schemas/ToolIDs` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Tool IDs",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ToolIDs"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-workspace"></a>
### `GET /experimental/workspace`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.list |
| Summary | List workspaces |
| Description | List all workspaces. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspaces | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspaces",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Workspace"
          },
          "description": "Workspaces"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-experimental-workspace"></a>
### `POST /experimental/workspace`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.create |
| Summary | Create workspace |
| Description | Create a workspace for the current project. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^wrk"
          },
          "type": {
            "type": "string"
          },
          "branch": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "extra": {
            "anyOf": [
              {},
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "type"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspace created | application/json | `#/components/schemas/Workspace` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspace created",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Workspace"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-experimental-workspace-id"></a>
### `DELETE /experimental/workspace/{id}`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.remove |
| Summary | Remove workspace |
| Description | Remove an existing workspace. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| id | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "id",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^wrk"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspace removed | application/json | `#/components/schemas/Workspace` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspace removed",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Workspace"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-workspace-adapter"></a>
### `GET /experimental/workspace/adapter`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.adapter.list |
| Summary | List workspace adapters |
| Description | List all available workspace adapters for the current project. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspace adapters | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspace adapters",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "name",
              "description"
            ],
            "additionalProperties": false
          },
          "description": "Workspace adapters"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-workspace-status"></a>
### `GET /experimental/workspace/status`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.status |
| Summary | Workspace status |
| Description | Get connection status for workspaces in the current project. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspace status | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspace status",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "workspaceID": {
                "type": "string",
                "pattern": "^wrk"
              },
              "status": {
                "type": "string",
                "enum": [
                  "connected",
                  "connecting",
                  "disconnected",
                  "error"
                ]
              }
            },
            "required": [
              "workspaceID",
              "status"
            ],
            "additionalProperties": false
          },
          "description": "Workspace status"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-experimental-workspace-sync-list"></a>
### `POST /experimental/workspace/sync-list`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.syncList |
| Summary | Sync workspace list |
| Description | Register missing workspaces returned by workspace adapters. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 204 | Workspace list synced | - | - |

<details>
<summary>Raw responses</summary>

```json
{
  "204": {
    "description": "Workspace list synced"
  }
}
```
</details>

<a id="endpoint-post-experimental-workspace-warp"></a>
### `POST /experimental/workspace/warp`

| Field | Value |
| --- | --- |
| Operation ID | experimental.workspace.warp |
| Summary | Warp session into workspace |
| Description | Move a session's sync history into the target workspace, or detach it to the local project. |
| Tags | workspace |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "id": {
            "anyOf": [
              {
                "type": "string",
                "pattern": "^wrk"
              },
              {
                "type": "null"
              }
            ]
          },
          "sessionID": {
            "type": "string",
            "pattern": "^ses"
          },
          "copyChanges": {
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "sessionID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 204 | Session warped | - | - |
| 400 | WorkspaceWarpError \| VcsApplyError | application/json | `anyOf` |

<details>
<summary>Raw responses</summary>

```json
{
  "204": {
    "description": "Session warped"
  },
  "400": {
    "description": "WorkspaceWarpError | VcsApplyError",
    "content": {
      "application/json": {
        "schema": {
          "anyOf": [
            {
              "$ref": "#/components/schemas/WorkspaceWarpError"
            },
            {
              "$ref": "#/components/schemas/VcsApplyError"
            }
          ]
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-experimental-worktree"></a>
### `GET /experimental/worktree`

| Field | Value |
| --- | --- |
| Operation ID | worktree.list |
| Summary | List worktrees |
| Description | List all sandbox worktrees for the current project. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of worktree directories | application/json | `array` |
| 400 | WorktreeError | application/json | `#/components/schemas/WorktreeError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of worktree directories",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of worktree directories"
        }
      }
    }
  },
  "400": {
    "description": "WorktreeError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/WorktreeError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-experimental-worktree"></a>
### `POST /experimental/worktree`

| Field | Value |
| --- | --- |
| Operation ID | worktree.create |
| Summary | Create worktree |
| Description | Create a new git worktree for the current project and run any configured startup scripts. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/WorktreeCreateInput"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Worktree created | application/json | `#/components/schemas/Worktree` |
| 400 | WorktreeError | application/json | `#/components/schemas/WorktreeError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Worktree created",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Worktree"
        }
      }
    }
  },
  "400": {
    "description": "WorktreeError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/WorktreeError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-experimental-worktree"></a>
### `DELETE /experimental/worktree`

| Field | Value |
| --- | --- |
| Operation ID | worktree.remove |
| Summary | Remove worktree |
| Description | Remove a git worktree and delete its branch. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/WorktreeRemoveInput"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Worktree removed | application/json | `boolean` |
| 400 | WorktreeError | application/json | `#/components/schemas/WorktreeError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Worktree removed",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Worktree removed"
        }
      }
    }
  },
  "400": {
    "description": "WorktreeError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/WorktreeError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-experimental-worktree-reset"></a>
### `POST /experimental/worktree/reset`

| Field | Value |
| --- | --- |
| Operation ID | worktree.reset |
| Summary | Reset worktree |
| Description | Reset a worktree branch to the primary default branch. |
| Tags | experimental |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/WorktreeResetInput"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Worktree reset | application/json | `boolean` |
| 400 | WorktreeError | application/json | `#/components/schemas/WorktreeError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Worktree reset",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Worktree reset"
        }
      }
    }
  },
  "400": {
    "description": "WorktreeError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/WorktreeError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-file"></a>
### `GET /file`

| Field | Value |
| --- | --- |
| Operation ID | file.list |
| Summary | List files |
| Description | List files and directories in a specified path. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| path | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "path",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Files and directories | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Files and directories",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/FileNode"
          },
          "description": "Files and directories"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-file-content"></a>
### `GET /file/content`

| Field | Value |
| --- | --- |
| Operation ID | file.read |
| Summary | Read file |
| Description | Read the content of a specified file. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| path | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "path",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | File content | application/json | `#/components/schemas/FileContent` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "File content",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/FileContent"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-file-status"></a>
### `GET /file/status`

| Field | Value |
| --- | --- |
| Operation ID | file.status |
| Summary | Get file status |
| Description | Get the git status of all files in the project. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | File status | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "File status",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/File"
          },
          "description": "File status"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-find"></a>
### `GET /find`

| Field | Value |
| --- | --- |
| Operation ID | find.text |
| Summary | Find text |
| Description | Search for text patterns across files in the project using ripgrep. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| pattern | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "pattern",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Matches | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Matches",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "path": {
                "type": "object",
                "properties": {
                  "text": {
                    "type": "string"
                  }
                },
                "required": [
                  "text"
                ],
                "additionalProperties": false
              },
              "lines": {
                "type": "object",
                "properties": {
                  "text": {
                    "type": "string"
                  }
                },
                "required": [
                  "text"
                ],
                "additionalProperties": false
              },
              "line_number": {
                "type": "integer",
                "minimum": 0
              },
              "absolute_offset": {
                "type": "integer",
                "minimum": 0
              },
              "submatches": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "match": {
                      "type": "object",
                      "properties": {
                        "text": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "text"
                      ],
                      "additionalProperties": false
                    },
                    "start": {
                      "type": "integer",
                      "minimum": 0
                    },
                    "end": {
                      "type": "integer",
                      "minimum": 0
                    }
                  },
                  "required": [
                    "match",
                    "start",
                    "end"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "path",
              "lines",
              "line_number",
              "absolute_offset",
              "submatches"
            ],
            "additionalProperties": false
          },
          "description": "Matches"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-find-file"></a>
### `GET /find/file`

| Field | Value |
| --- | --- |
| Operation ID | find.files |
| Summary | Find files |
| Description | Search for files or directories by name or pattern in the project directory. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| query | query | true | - | `string` |
| dirs | query | false | - | `string` |
| type | query | false | - | `string` |
| limit | query | false | - | `integer` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "query",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "dirs",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "true",
        "false"
      ]
    },
    "required": false
  },
  {
    "name": "type",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "file",
        "directory"
      ]
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "integer",
      "minimum": 1,
      "maximum": 200
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | File paths | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "File paths",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "File paths"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-find-symbol"></a>
### `GET /find/symbol`

| Field | Value |
| --- | --- |
| Operation ID | find.symbols |
| Summary | Find symbols |
| Description | Search for workspace symbols like functions, classes, and variables using LSP. |
| Tags | file |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| query | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "query",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Symbols | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Symbols",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Symbol"
          },
          "description": "Symbols"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-formatter"></a>
### `GET /formatter`

| Field | Value |
| --- | --- |
| Operation ID | formatter.status |
| Summary | Get formatter status |
| Description | Get formatter status |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Formatter status | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Formatter status",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/FormatterStatus"
          },
          "description": "Formatter status"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-global-config"></a>
### `GET /global/config`

| Field | Value |
| --- | --- |
| Operation ID | global.config.get |
| Summary | Get global configuration |
| Description | Retrieve the current global OpenCode configuration settings and preferences. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Get global config info | application/json | `#/components/schemas/Config` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Get global config info",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Config"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-patch-global-config"></a>
### `PATCH /global/config`

| Field | Value |
| --- | --- |
| Operation ID | global.config.update |
| Summary | Update global configuration |
| Description | Update global OpenCode configuration settings and preferences. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/Config"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully updated global config | application/json | `#/components/schemas/Config` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully updated global config",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Config"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-global-dispose"></a>
### `POST /global/dispose`

| Field | Value |
| --- | --- |
| Operation ID | global.dispose |
| Summary | Dispose instance |
| Description | Clean up and dispose all OpenCode instances, releasing all resources. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Global disposed | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Global disposed",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Global disposed"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-global-event"></a>
### `GET /global/event`

| Field | Value |
| --- | --- |
| Operation ID | global.event |
| Summary | Get global events |
| Description | Subscribe to global events from the OpenCode system using server-sent events. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Event stream | text/event-stream | `#/components/schemas/GlobalEvent` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Event stream",
    "content": {
      "text/event-stream": {
        "schema": {
          "$ref": "#/components/schemas/GlobalEvent"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-global-health"></a>
### `GET /global/health`

| Field | Value |
| --- | --- |
| Operation ID | global.health |
| Summary | Get health |
| Description | Get health information about the OpenCode server. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Health information | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Health information",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "healthy": {
              "type": "boolean",
              "enum": [
                true
              ]
            },
            "version": {
              "type": "string"
            }
          },
          "required": [
            "healthy",
            "version"
          ],
          "additionalProperties": false,
          "description": "Health information"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-global-upgrade"></a>
### `POST /global/upgrade`

| Field | Value |
| --- | --- |
| Operation ID | global.upgrade |
| Summary | Upgrade opencode |
| Description | Upgrade opencode to the specified version or latest if not specified. |
| Tags | global |
| Deprecated | false |

#### Parameters

_No parameters._

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "target": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Upgrade result | application/json | `anyOf` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Upgrade result",
    "content": {
      "application/json": {
        "schema": {
          "anyOf": [
            {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean",
                  "enum": [
                    true
                  ]
                },
                "version": {
                  "type": "string"
                }
              },
              "required": [
                "success",
                "version"
              ],
              "additionalProperties": false
            },
            {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean",
                  "enum": [
                    false
                  ]
                },
                "error": {
                  "type": "string"
                }
              },
              "required": [
                "success",
                "error"
              ],
              "additionalProperties": false
            }
          ],
          "description": "Upgrade result"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-instance-dispose"></a>
### `POST /instance/dispose`

| Field | Value |
| --- | --- |
| Operation ID | instance.dispose |
| Summary | Dispose instance |
| Description | Clean up and dispose the current OpenCode instance, releasing all resources. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Instance disposed | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Instance disposed",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Instance disposed"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-log"></a>
### `POST /log`

| Field | Value |
| --- | --- |
| Operation ID | app.log |
| Summary | Write log |
| Description | Write a log entry to the server logs with specified level and metadata. |
| Tags | control |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "service": {
            "type": "string",
            "description": "Service name for the log entry"
          },
          "level": {
            "type": "string",
            "enum": [
              "debug",
              "info",
              "error",
              "warn"
            ],
            "description": "Log level"
          },
          "message": {
            "type": "string",
            "description": "Log message"
          },
          "extra": {
            "type": "object"
          }
        },
        "required": [
          "service",
          "level",
          "message"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Log entry written successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Log entry written successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Log entry written successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-lsp"></a>
### `GET /lsp`

| Field | Value |
| --- | --- |
| Operation ID | lsp.status |
| Summary | Get LSP status |
| Description | Get LSP server status |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | LSP server status | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "LSP server status",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/LSPStatus"
          },
          "description": "LSP server status"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-mcp"></a>
### `GET /mcp`

| Field | Value |
| --- | --- |
| Operation ID | mcp.status |
| Summary | Get MCP status |
| Description | Get the status of all Model Context Protocol (MCP) servers. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | MCP server status | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "MCP server status",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/components/schemas/MCPStatus"
          },
          "description": "MCP server status"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp"></a>
### `POST /mcp`

| Field | Value |
| --- | --- |
| Operation ID | mcp.add |
| Summary | Add MCP server |
| Description | Dynamically add a new Model Context Protocol (MCP) server to the system. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "config": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/McpLocalConfig"
              },
              {
                "$ref": "#/components/schemas/McpRemoteConfig"
              }
            ]
          }
        },
        "required": [
          "name",
          "config"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | MCP server added successfully | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "MCP server added successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/components/schemas/MCPStatus"
          },
          "description": "MCP server added successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp-name-auth"></a>
### `POST /mcp/{name}/auth`

| Field | Value |
| --- | --- |
| Operation ID | mcp.auth.start |
| Summary | Start MCP OAuth |
| Description | Start OAuth authentication flow for a Model Context Protocol (MCP) server. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | OAuth flow started | application/json | `object` |
| 400 | McpUnsupportedOAuthError | application/json | `#/components/schemas/McpUnsupportedOAuthError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "OAuth flow started",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "authorizationUrl": {
              "type": "string"
            },
            "oauthState": {
              "type": "string"
            }
          },
          "required": [
            "authorizationUrl",
            "oauthState"
          ],
          "additionalProperties": false,
          "description": "OAuth flow started"
        }
      }
    }
  },
  "400": {
    "description": "McpUnsupportedOAuthError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/McpUnsupportedOAuthError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-mcp-name-auth"></a>
### `DELETE /mcp/{name}/auth`

| Field | Value |
| --- | --- |
| Operation ID | mcp.auth.remove |
| Summary | Remove MCP OAuth |
| Description | Remove OAuth credentials for an MCP server. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | OAuth credentials removed | application/json | `object` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "OAuth credentials removed",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "enum": [
                true
              ]
            }
          },
          "required": [
            "success"
          ],
          "additionalProperties": false,
          "description": "OAuth credentials removed"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp-name-auth-authenticate"></a>
### `POST /mcp/{name}/auth/authenticate`

| Field | Value |
| --- | --- |
| Operation ID | mcp.auth.authenticate |
| Summary | Authenticate MCP OAuth |
| Description | Start OAuth flow and wait for callback (opens browser). |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | OAuth authentication completed | application/json | `#/components/schemas/MCPStatus` |
| 400 | McpUnsupportedOAuthError | application/json | `#/components/schemas/McpUnsupportedOAuthError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "OAuth authentication completed",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/MCPStatus"
        }
      }
    }
  },
  "400": {
    "description": "McpUnsupportedOAuthError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/McpUnsupportedOAuthError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp-name-auth-callback"></a>
### `POST /mcp/{name}/auth/callback`

| Field | Value |
| --- | --- |
| Operation ID | mcp.auth.callback |
| Summary | Complete MCP OAuth |
| Description | Complete OAuth authentication for a Model Context Protocol (MCP) server using the authorization code. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string"
          }
        },
        "required": [
          "code"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | OAuth authentication completed | application/json | `#/components/schemas/MCPStatus` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "OAuth authentication completed",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/MCPStatus"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp-name-connect"></a>
### `POST /mcp/{name}/connect`

| Field | Value |
| --- | --- |
| Operation ID | mcp.connect |
| Summary | - |
| Description | Connect an MCP server. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | MCP server connected successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "MCP server connected successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "MCP server connected successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-mcp-name-disconnect"></a>
### `POST /mcp/{name}/disconnect`

| Field | Value |
| --- | --- |
| Operation ID | mcp.disconnect |
| Summary | - |
| Description | Disconnect an MCP server. |
| Tags | mcp |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| name | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "name",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | MCP server disconnected successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "MCP server disconnected successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "MCP server disconnected successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-path"></a>
### `GET /path`

| Field | Value |
| --- | --- |
| Operation ID | path.get |
| Summary | Get paths |
| Description | Retrieve the current working directory and related path information for the OpenCode instance. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Path | application/json | `#/components/schemas/Path` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Path",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Path"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-permission"></a>
### `GET /permission`

| Field | Value |
| --- | --- |
| Operation ID | permission.list |
| Summary | List pending permissions |
| Description | Get all pending permission requests across all sessions. |
| Tags | permission |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of pending permissions | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of pending permissions",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/PermissionRequest"
          },
          "description": "List of pending permissions"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-permission-requestid-reply"></a>
### `POST /permission/{requestID}/reply`

| Field | Value |
| --- | --- |
| Operation ID | permission.reply |
| Summary | Respond to permission request |
| Description | Approve or deny a permission request from the AI assistant. |
| Tags | permission |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| requestID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "requestID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^per"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "reply": {
            "type": "string",
            "enum": [
              "once",
              "always",
              "reject"
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "required": [
          "reply"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Permission processed successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Permission processed successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Permission processed successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-project"></a>
### `GET /project`

| Field | Value |
| --- | --- |
| Operation ID | project.list |
| Summary | List all projects |
| Description | Get a list of projects that have been opened with OpenCode. |
| Tags | project |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of projects | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of projects",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Project"
          },
          "description": "List of projects"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-patch-project-projectid"></a>
### `PATCH /project/{projectID}`

| Field | Value |
| --- | --- |
| Operation ID | project.update |
| Summary | Update project |
| Description | Update project properties such as name, icon, and commands. |
| Tags | project |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| projectID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "projectID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "icon": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string"
              },
              "override": {
                "type": "string"
              },
              "color": {
                "type": "string"
              }
            },
            "additionalProperties": false
          },
          "commands": {
            "type": "object",
            "properties": {
              "start": {
                "type": "string",
                "description": "Startup script to run when creating a new workspace (worktree)"
              }
            },
            "additionalProperties": false
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Updated project information | application/json | `#/components/schemas/Project` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Updated project information",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Project"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-project-current"></a>
### `GET /project/current`

| Field | Value |
| --- | --- |
| Operation ID | project.current |
| Summary | Get current project |
| Description | Retrieve the currently active project that OpenCode is working with. |
| Tags | project |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Current project information | application/json | `#/components/schemas/Project` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Current project information",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Project"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-project-git-init"></a>
### `POST /project/git/init`

| Field | Value |
| --- | --- |
| Operation ID | project.initGit |
| Summary | Initialize git repository |
| Description | Create a git repository for the current project and return the refreshed project info. |
| Tags | project |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Project information after git initialization | application/json | `#/components/schemas/Project` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Project information after git initialization",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Project"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-provider"></a>
### `GET /provider`

| Field | Value |
| --- | --- |
| Operation ID | provider.list |
| Summary | List providers |
| Description | Get a list of all available AI providers, including both available and connected ones. |
| Tags | provider |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of providers | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of providers",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "all": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Provider"
              }
            },
            "default": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            },
            "connected": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "all",
            "default",
            "connected"
          ],
          "additionalProperties": false,
          "description": "List of providers"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-provider-providerid-oauth-authorize"></a>
### `POST /provider/{providerID}/oauth/authorize`

| Field | Value |
| --- | --- |
| Operation ID | provider.oauth.authorize |
| Summary | Start OAuth authorization |
| Description | Start the OAuth authorization flow for a provider. |
| Tags | provider |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| providerID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "providerID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "method": {
            "type": "number",
            "description": "Auth method index"
          },
          "inputs": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        },
        "required": [
          "method"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Authorization URL and method | application/json | `#/components/schemas/ProviderAuthAuthorization` |
| 400 | ProviderAuthError | application/json | `#/components/schemas/ProviderAuthError1` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Authorization URL and method",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ProviderAuthAuthorization"
        }
      }
    }
  },
  "400": {
    "description": "ProviderAuthError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ProviderAuthError1"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-provider-providerid-oauth-callback"></a>
### `POST /provider/{providerID}/oauth/callback`

| Field | Value |
| --- | --- |
| Operation ID | provider.oauth.callback |
| Summary | Handle OAuth callback |
| Description | Handle the OAuth callback from a provider after user authorization. |
| Tags | provider |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| providerID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "providerID",
    "in": "path",
    "schema": {
      "type": "string"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "method": {
            "type": "number",
            "description": "Auth method index"
          },
          "code": {
            "type": "string"
          }
        },
        "required": [
          "method"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | OAuth callback processed successfully | application/json | `boolean` |
| 400 | ProviderAuthError | application/json | `#/components/schemas/ProviderAuthError1` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "OAuth callback processed successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "OAuth callback processed successfully"
        }
      }
    }
  },
  "400": {
    "description": "ProviderAuthError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ProviderAuthError1"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-provider-auth"></a>
### `GET /provider/auth`

| Field | Value |
| --- | --- |
| Operation ID | provider.auth |
| Summary | Get provider auth methods |
| Description | Retrieve available authentication methods for all AI providers. |
| Tags | provider |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Provider auth methods | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Provider auth methods",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProviderAuthMethod"
            }
          },
          "description": "Provider auth methods"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-pty"></a>
### `GET /pty`

| Field | Value |
| --- | --- |
| Operation ID | pty.list |
| Summary | List PTY sessions |
| Description | Get a list of all active pseudo-terminal (PTY) sessions managed by OpenCode. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of sessions | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of sessions",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Pty"
          },
          "description": "List of sessions"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-pty"></a>
### `POST /pty`

| Field | Value |
| --- | --- |
| Operation ID | pty.create |
| Summary | Create PTY session |
| Description | Create a new pseudo-terminal (PTY) session for running shell commands and processes. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "command": {
            "type": "string"
          },
          "args": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "cwd": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "env": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Created session | application/json | `#/components/schemas/Pty` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Created session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Pty"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-pty-ptyid"></a>
### `GET /pty/{ptyID}`

| Field | Value |
| --- | --- |
| Operation ID | pty.get |
| Summary | Get PTY session |
| Description | Retrieve detailed information about a specific pseudo-terminal (PTY) session. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| ptyID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "ptyID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^pty"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session info | application/json | `#/components/schemas/Pty` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session info",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Pty"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-put-pty-ptyid"></a>
### `PUT /pty/{ptyID}`

| Field | Value |
| --- | --- |
| Operation ID | pty.update |
| Summary | Update PTY session |
| Description | Update properties of an existing pseudo-terminal (PTY) session. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| ptyID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "ptyID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^pty"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "size": {
            "type": "object",
            "properties": {
              "rows": {
                "type": "integer",
                "exclusiveMinimum": 0
              },
              "cols": {
                "type": "integer",
                "exclusiveMinimum": 0
              }
            },
            "required": [
              "rows",
              "cols"
            ],
            "additionalProperties": false
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Updated session | application/json | `#/components/schemas/Pty` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Updated session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Pty"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-pty-ptyid"></a>
### `DELETE /pty/{ptyID}`

| Field | Value |
| --- | --- |
| Operation ID | pty.remove |
| Summary | Remove PTY session |
| Description | Remove and terminate a specific pseudo-terminal (PTY) session. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| ptyID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "ptyID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^pty"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session removed | application/json | `boolean` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session removed",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Session removed"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-pty-ptyid-connect"></a>
### `GET /pty/{ptyID}/connect`

| Field | Value |
| --- | --- |
| Operation ID | pty.connect |
| Summary | Connect to PTY session |
| Description | Establish a WebSocket connection to interact with a pseudo-terminal (PTY) session in real-time. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| ptyID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "ptyID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^pty"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Connected session | application/json | `boolean` |
| 403 | Forbidden | application/json | `#/components/schemas/effect_HttpApiError_Forbidden` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Connected session",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Connected session"
        }
      }
    }
  },
  "403": {
    "description": "Forbidden",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_Forbidden"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-pty-ptyid-connect-token"></a>
### `POST /pty/{ptyID}/connect-token`

| Field | Value |
| --- | --- |
| Operation ID | pty.connectToken |
| Summary | Create PTY WebSocket token |
| Description | Create a short-lived ticket for opening a PTY WebSocket connection. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| ptyID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "ptyID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^pty"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | WebSocket connect token | application/json | `object` |
| 403 | Forbidden | application/json | `#/components/schemas/effect_HttpApiError_Forbidden` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "WebSocket connect token",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "ticket": {
              "type": "string"
            },
            "expires_in": {
              "type": "integer",
              "exclusiveMinimum": 0
            }
          },
          "required": [
            "ticket",
            "expires_in"
          ],
          "additionalProperties": false,
          "description": "WebSocket connect token"
        }
      }
    }
  },
  "403": {
    "description": "Forbidden",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_Forbidden"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-pty-shells"></a>
### `GET /pty/shells`

| Field | Value |
| --- | --- |
| Operation ID | pty.shells |
| Summary | List available shells |
| Description | Get a list of available shells on the system. |
| Tags | pty |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of shells | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of shells",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "path": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "acceptable": {
                "type": "boolean"
              }
            },
            "required": [
              "path",
              "name",
              "acceptable"
            ],
            "additionalProperties": false
          },
          "description": "List of shells"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-question"></a>
### `GET /question`

| Field | Value |
| --- | --- |
| Operation ID | question.list |
| Summary | List pending questions |
| Description | Get all pending question requests across all sessions. |
| Tags | question |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of pending questions | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of pending questions",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/QuestionRequest"
          },
          "description": "List of pending questions"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-question-requestid-reject"></a>
### `POST /question/{requestID}/reject`

| Field | Value |
| --- | --- |
| Operation ID | question.reject |
| Summary | Reject question request |
| Description | Reject a question request from the AI assistant. |
| Tags | question |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| requestID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "requestID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^que"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Question rejected successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Question rejected successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Question rejected successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-question-requestid-reply"></a>
### `POST /question/{requestID}/reply`

| Field | Value |
| --- | --- |
| Operation ID | question.reply |
| Summary | Reply to question request |
| Description | Provide answers to a question request from the AI assistant. |
| Tags | question |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| requestID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "requestID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^que"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "answers": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/QuestionAnswer"
            },
            "description": "User answers in order of questions (each answer is an array of selected labels)"
          }
        },
        "required": [
          "answers"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Question answered successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | Not found | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Question answered successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Question answered successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "Not found",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session"></a>
### `GET /session`

| Field | Value |
| --- | --- |
| Operation ID | session.list |
| Summary | List sessions |
| Description | Get a list of all OpenCode sessions, sorted by most recently updated. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| scope | query | false | - | `string` |
| path | query | false | - | `string` |
| roots | query | false | - | `anyOf` |
| start | query | false | - | `number` |
| search | query | false | - | `string` |
| limit | query | false | - | `number` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "scope",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "project"
      ]
    },
    "required": false
  },
  {
    "name": "path",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "roots",
    "in": "query",
    "schema": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "enum": [
            "true",
            "false"
          ]
        }
      ]
    },
    "required": false
  },
  {
    "name": "start",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  },
  {
    "name": "search",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "number"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of sessions | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of sessions",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Session"
          },
          "description": "List of sessions"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session"></a>
### `POST /session`

| Field | Value |
| --- | --- |
| Operation ID | session.create |
| Summary | Create session |
| Description | Create a new OpenCode session for interacting with AI assistants and managing conversations. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "parentID": {
            "type": "string",
            "pattern": "^ses"
          },
          "title": {
            "type": "string"
          },
          "agent": {
            "type": "string"
          },
          "model": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "providerID": {
                "type": "string"
              },
              "variant": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "providerID"
            ],
            "additionalProperties": false
          },
          "permission": {
            "$ref": "#/components/schemas/PermissionRuleset"
          },
          "workspaceID": {
            "type": "string",
            "pattern": "^wrk"
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully created session | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully created session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid"></a>
### `GET /session/{sessionID}`

| Field | Value |
| --- | --- |
| Operation ID | session.get |
| Summary | Get session |
| Description | Retrieve detailed information about a specific OpenCode session. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Get session | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Get session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-patch-session-sessionid"></a>
### `PATCH /session/{sessionID}`

| Field | Value |
| --- | --- |
| Operation ID | session.update |
| Summary | Update session |
| Description | Update properties of an existing session, such as title or other metadata. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "permission": {
            "$ref": "#/components/schemas/PermissionRuleset"
          },
          "time": {
            "type": "object",
            "properties": {
              "archived": {
                "type": "number"
              }
            },
            "additionalProperties": false
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully updated session | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully updated session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-session-sessionid"></a>
### `DELETE /session/{sessionID}`

| Field | Value |
| --- | --- |
| Operation ID | session.delete |
| Summary | Delete session |
| Description | Delete a session and permanently remove all associated data, including messages and history. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully deleted session | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully deleted session",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Successfully deleted session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-abort"></a>
### `POST /session/{sessionID}/abort`

| Field | Value |
| --- | --- |
| Operation ID | session.abort |
| Summary | Abort session |
| Description | Abort an active session and stop any ongoing AI processing or command execution. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Aborted session | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Aborted session",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Aborted session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid-children"></a>
### `GET /session/{sessionID}/children`

| Field | Value |
| --- | --- |
| Operation ID | session.children |
| Summary | Get session children |
| Description | Retrieve all child sessions that were forked from the specified parent session. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of children | application/json | `array` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of children",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Session"
          },
          "description": "List of children"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-command"></a>
### `POST /session/{sessionID}/command`

| Field | Value |
| --- | --- |
| Operation ID | session.command |
| Summary | Send command |
| Description | Send a new command to a session for execution by the AI assistant. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          },
          "agent": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "arguments": {
            "type": "string"
          },
          "command": {
            "type": "string"
          },
          "variant": {
            "type": "string"
          },
          "parts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "pattern": "^prt"
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "file"
                  ]
                },
                "mime": {
                  "type": "string"
                },
                "filename": {
                  "type": "string"
                },
                "url": {
                  "type": "string"
                },
                "source": {
                  "$ref": "#/components/schemas/FilePartSource"
                }
              },
              "required": [
                "type",
                "mime",
                "url"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "arguments",
          "command"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Created message | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Created message",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": [
            "info",
            "parts"
          ],
          "properties": {
            "info": {
              "$ref": "#/components/schemas/AssistantMessage"
            },
            "parts": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Part"
              }
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid-diff"></a>
### `GET /session/{sessionID}/diff`

| Field | Value |
| --- | --- |
| Operation ID | session.diff |
| Summary | Get message diff |
| Description | Get the file changes (diff) that resulted from a specific user message in the session. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| messageID | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "messageID",
    "in": "query",
    "schema": {
      "type": "string",
      "pattern": "^msg"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully retrieved diff | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully retrieved diff",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SnapshotFileDiff"
          },
          "description": "Successfully retrieved diff"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-fork"></a>
### `POST /session/{sessionID}/fork`

| Field | Value |
| --- | --- |
| Operation ID | session.fork |
| Summary | Fork session |
| Description | Create a new session by forking an existing session at a specific message point. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | 200 | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "200",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-init"></a>
### `POST /session/{sessionID}/init`

| Field | Value |
| --- | --- |
| Operation ID | session.init |
| Summary | Initialize session |
| Description | Analyze the current application and create an AGENTS.md file with project-specific agent configurations. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "modelID": {
            "type": "string"
          },
          "providerID": {
            "type": "string"
          },
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          }
        },
        "required": [
          "modelID",
          "providerID",
          "messageID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | 200 | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "200",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "200"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid-message"></a>
### `GET /session/{sessionID}/message`

| Field | Value |
| --- | --- |
| Operation ID | session.messages |
| Summary | Get session messages |
| Description | Retrieve all messages in a session, including user prompts and AI responses. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| limit | query | false | - | `integer` |
| before | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "limit",
    "in": "query",
    "schema": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991
    },
    "required": false
  },
  {
    "name": "before",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of messages | application/json | `array` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of messages",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "info": {
                "$ref": "#/components/schemas/Message"
              },
              "parts": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/Part"
                }
              }
            },
            "required": [
              "info",
              "parts"
            ],
            "additionalProperties": false
          },
          "description": "List of messages"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-message"></a>
### `POST /session/{sessionID}/message`

| Field | Value |
| --- | --- |
| Operation ID | session.prompt |
| Summary | Send message |
| Description | Create and send a new message to a session, streaming the AI response. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          },
          "model": {
            "type": "object",
            "properties": {
              "providerID": {
                "type": "string"
              },
              "modelID": {
                "type": "string"
              }
            },
            "required": [
              "providerID",
              "modelID"
            ],
            "additionalProperties": false
          },
          "agent": {
            "type": "string"
          },
          "noReply": {
            "type": "boolean"
          },
          "tools": {
            "type": "object",
            "additionalProperties": {
              "type": "boolean"
            }
          },
          "format": {
            "$ref": "#/components/schemas/OutputFormat"
          },
          "system": {
            "type": "string"
          },
          "variant": {
            "type": "string"
          },
          "parts": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/TextPartInput"
                },
                {
                  "$ref": "#/components/schemas/FilePartInput"
                },
                {
                  "$ref": "#/components/schemas/AgentPartInput"
                },
                {
                  "$ref": "#/components/schemas/SubtaskPartInput"
                }
              ]
            }
          }
        },
        "required": [
          "parts"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Created message | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Created message",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": [
            "info",
            "parts"
          ],
          "properties": {
            "info": {
              "$ref": "#/components/schemas/AssistantMessage"
            },
            "parts": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Part"
              }
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid-message-messageid"></a>
### `GET /session/{sessionID}/message/{messageID}`

| Field | Value |
| --- | --- |
| Operation ID | session.message |
| Summary | Get message |
| Description | Retrieve a specific message from a session by its message ID. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| messageID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "messageID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^msg"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Message | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Message",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "info": {
              "$ref": "#/components/schemas/Message"
            },
            "parts": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Part"
              }
            }
          },
          "required": [
            "info",
            "parts"
          ],
          "additionalProperties": false,
          "description": "Message"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-session-sessionid-message-messageid"></a>
### `DELETE /session/{sessionID}/message/{messageID}`

| Field | Value |
| --- | --- |
| Operation ID | session.deleteMessage |
| Summary | Delete message |
| Description | Permanently delete a specific message and all of its parts from a session without reverting file changes. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| messageID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "messageID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^msg"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully deleted message | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully deleted message",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Successfully deleted message"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-patch-session-sessionid-message-messageid-part-partid"></a>
### `PATCH /session/{sessionID}/message/{messageID}/part/{partID}`

| Field | Value |
| --- | --- |
| Operation ID | part.update |
| Summary | - |
| Description | Update a part in a message. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| messageID | path | true | - | `string` |
| partID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "messageID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^msg"
    },
    "required": true
  },
  {
    "name": "partID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^prt"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/Part"
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully updated part | application/json | `#/components/schemas/Part` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully updated part",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Part"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-session-sessionid-message-messageid-part-partid"></a>
### `DELETE /session/{sessionID}/message/{messageID}/part/{partID}`

| Field | Value |
| --- | --- |
| Operation ID | part.delete |
| Summary | - |
| Description | Delete a part from a message. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| messageID | path | true | - | `string` |
| partID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "messageID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^msg"
    },
    "required": true
  },
  {
    "name": "partID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^prt"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully deleted part | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully deleted part",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Successfully deleted part"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-permissions-permissionid"></a>
### `POST /session/{sessionID}/permissions/{permissionID}`

| Field | Value |
| --- | --- |
| Operation ID | permission.respond |
| Summary | Respond to permission |
| Description | Approve or deny a permission request from the AI assistant. |
| Tags | session |
| Deprecated | true |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| permissionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "permissionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^per"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "response": {
            "type": "string",
            "enum": [
              "once",
              "always",
              "reject"
            ]
          }
        },
        "required": [
          "response"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Permission processed successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Permission processed successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Permission processed successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-prompt-async"></a>
### `POST /session/{sessionID}/prompt_async`

| Field | Value |
| --- | --- |
| Operation ID | session.prompt_async |
| Summary | Send async message |
| Description | Create and send a new message to a session asynchronously, starting the session if needed and returning immediately. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          },
          "model": {
            "type": "object",
            "properties": {
              "providerID": {
                "type": "string"
              },
              "modelID": {
                "type": "string"
              }
            },
            "required": [
              "providerID",
              "modelID"
            ],
            "additionalProperties": false
          },
          "agent": {
            "type": "string"
          },
          "noReply": {
            "type": "boolean"
          },
          "tools": {
            "type": "object",
            "additionalProperties": {
              "type": "boolean"
            }
          },
          "format": {
            "$ref": "#/components/schemas/OutputFormat"
          },
          "system": {
            "type": "string"
          },
          "variant": {
            "type": "string"
          },
          "parts": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/TextPartInput"
                },
                {
                  "$ref": "#/components/schemas/FilePartInput"
                },
                {
                  "$ref": "#/components/schemas/AgentPartInput"
                },
                {
                  "$ref": "#/components/schemas/SubtaskPartInput"
                }
              ]
            }
          }
        },
        "required": [
          "parts"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 204 | Prompt accepted | - | - |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "204": {
    "description": "Prompt accepted"
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-revert"></a>
### `POST /session/{sessionID}/revert`

| Field | Value |
| --- | --- |
| Operation ID | session.revert |
| Summary | Revert message |
| Description | Revert a specific message in a session, undoing its effects and restoring the previous state. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          },
          "partID": {
            "type": "string",
            "pattern": "^prt"
          }
        },
        "required": [
          "messageID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Updated session | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Updated session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-share"></a>
### `POST /session/{sessionID}/share`

| Field | Value |
| --- | --- |
| Operation ID | session.share |
| Summary | Share session |
| Description | Create a shareable link for a session, allowing others to view the conversation. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully shared session | application/json | `#/components/schemas/Session` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |
| 500 | InternalServerError | application/json | `#/components/schemas/effect_HttpApiError_InternalServerError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully shared session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  },
  "500": {
    "description": "InternalServerError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_InternalServerError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-delete-session-sessionid-share"></a>
### `DELETE /session/{sessionID}/share`

| Field | Value |
| --- | --- |
| Operation ID | session.unshare |
| Summary | Unshare session |
| Description | Remove the shareable link for a session, making it private again. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Successfully unshared session | application/json | `#/components/schemas/Session` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |
| 500 | InternalServerError | application/json | `#/components/schemas/effect_HttpApiError_InternalServerError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Successfully unshared session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  },
  "500": {
    "description": "InternalServerError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/effect_HttpApiError_InternalServerError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-shell"></a>
### `POST /session/{sessionID}/shell`

| Field | Value |
| --- | --- |
| Operation ID | session.shell |
| Summary | Run shell command |
| Description | Execute a shell command within the session context and return the AI's response. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "messageID": {
            "type": "string",
            "pattern": "^msg"
          },
          "agent": {
            "type": "string"
          },
          "model": {
            "type": "object",
            "properties": {
              "providerID": {
                "type": "string"
              },
              "modelID": {
                "type": "string"
              }
            },
            "required": [
              "providerID",
              "modelID"
            ],
            "additionalProperties": false
          },
          "command": {
            "type": "string"
          }
        },
        "required": [
          "agent",
          "command"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Created message | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Created message",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "info": {
              "$ref": "#/components/schemas/Message"
            },
            "parts": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Part"
              }
            }
          },
          "required": [
            "info",
            "parts"
          ],
          "additionalProperties": false,
          "description": "Created message"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-summarize"></a>
### `POST /session/{sessionID}/summarize`

| Field | Value |
| --- | --- |
| Operation ID | session.summarize |
| Summary | Summarize session |
| Description | Generate a concise summary of the session using AI compaction to preserve key information. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "providerID": {
            "type": "string"
          },
          "modelID": {
            "type": "string"
          },
          "auto": {
            "type": "boolean"
          }
        },
        "required": [
          "providerID",
          "modelID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Summarized session | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Summarized session",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Summarized session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-sessionid-todo"></a>
### `GET /session/{sessionID}/todo`

| Field | Value |
| --- | --- |
| Operation ID | session.todo |
| Summary | Get session todos |
| Description | Retrieve the todo list associated with a specific session, showing tasks and action items. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Todo list | application/json | `array` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Todo list",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Todo"
          },
          "description": "Todo list"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-session-sessionid-unrevert"></a>
### `POST /session/{sessionID}/unrevert`

| Field | Value |
| --- | --- |
| Operation ID | session.unrevert |
| Summary | Restore reverted messages |
| Description | Restore all previously reverted messages in a session. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| sessionID | path | true | - | `string` |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "sessionID",
    "in": "path",
    "schema": {
      "type": "string",
      "pattern": "^ses"
    },
    "required": true
  },
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Updated session | application/json | `#/components/schemas/Session` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Updated session",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Session"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-session-status"></a>
### `GET /session/status`

| Field | Value |
| --- | --- |
| Operation ID | session.status |
| Summary | Get session status |
| Description | Retrieve the current status of all sessions, including active, idle, and completed states. |
| Tags | session |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Get session status | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Get session status",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "additionalProperties": {
            "$ref": "#/components/schemas/SessionStatus"
          },
          "description": "Get session status"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-skill"></a>
### `GET /skill`

| Field | Value |
| --- | --- |
| Operation ID | app.skills |
| Summary | List skills |
| Description | Get a list of all available skills in the OpenCode system. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | List of skills | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "List of skills",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "location": {
                "type": "string"
              },
              "content": {
                "type": "string"
              }
            },
            "required": [
              "name",
              "location",
              "content"
            ],
            "additionalProperties": false
          },
          "description": "List of skills"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-sync-history"></a>
### `POST /sync/history`

| Field | Value |
| --- | --- |
| Operation ID | sync.history.list |
| Summary | List sync events |
| Description | List sync events for all aggregates. Keys are aggregate IDs the client already knows about, values are the last known sequence ID. Events with seq > value are returned for those aggregates. Aggregates not listed in the input get their full history. |
| Tags | sync |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "additionalProperties": {
          "type": "integer",
          "minimum": 0
        }
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Sync events | application/json | `array` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Sync events",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "aggregate_id": {
                "type": "string"
              },
              "seq": {
                "type": "integer",
                "minimum": 0
              },
              "type": {
                "type": "string"
              },
              "data": {
                "type": "object"
              }
            },
            "required": [
              "id",
              "aggregate_id",
              "seq",
              "type",
              "data"
            ],
            "additionalProperties": false
          },
          "description": "Sync events"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-sync-replay"></a>
### `POST /sync/replay`

| Field | Value |
| --- | --- |
| Operation ID | sync.replay |
| Summary | Replay sync events |
| Description | Validate and replay a complete sync event history. |
| Tags | sync |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "directory": {
            "type": "string"
          },
          "events": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "aggregateID": {
                  "type": "string"
                },
                "seq": {
                  "type": "integer",
                  "minimum": 0
                },
                "type": {
                  "type": "string"
                },
                "data": {
                  "type": "object"
                }
              },
              "required": [
                "id",
                "aggregateID",
                "seq",
                "type",
                "data"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "directory",
          "events"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Replayed sync events | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Replayed sync events",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "sessionID": {
              "type": "string"
            }
          },
          "required": [
            "sessionID"
          ],
          "additionalProperties": false,
          "description": "Replayed sync events"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-sync-start"></a>
### `POST /sync/start`

| Field | Value |
| --- | --- |
| Operation ID | sync.start |
| Summary | Start workspace sync |
| Description | Start sync loops for workspaces in the current project that have active sessions. |
| Tags | sync |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Workspace sync started | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Workspace sync started",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Workspace sync started"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-sync-steal"></a>
### `POST /sync/steal`

| Field | Value |
| --- | --- |
| Operation ID | sync.steal |
| Summary | Steal session into workspace |
| Description | Update a session to belong to the current workspace through the sync event system. |
| Tags | sync |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "sessionID": {
            "type": "string",
            "pattern": "^ses"
          }
        },
        "required": [
          "sessionID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session stolen into workspace | application/json | `object` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session stolen into workspace",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "sessionID": {
              "type": "string",
              "pattern": "^ses"
            }
          },
          "required": [
            "sessionID"
          ],
          "additionalProperties": false,
          "description": "Session stolen into workspace"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-append-prompt"></a>
### `POST /tui/append-prompt`

| Field | Value |
| --- | --- |
| Operation ID | tui.appendPrompt |
| Summary | Append TUI prompt |
| Description | Append prompt to the TUI. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string"
          }
        },
        "required": [
          "text"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Prompt processed successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Prompt processed successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Prompt processed successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-clear-prompt"></a>
### `POST /tui/clear-prompt`

| Field | Value |
| --- | --- |
| Operation ID | tui.clearPrompt |
| Summary | Clear TUI prompt |
| Description | Clear the prompt. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Prompt cleared successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Prompt cleared successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Prompt cleared successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-tui-control-next"></a>
### `GET /tui/control/next`

| Field | Value |
| --- | --- |
| Operation ID | tui.control.next |
| Summary | Get next TUI request |
| Description | Retrieve the next TUI request from the queue for processing. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Next TUI request | application/json | `object` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Next TUI request",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
            },
            "body": {}
          },
          "required": [
            "path",
            "body"
          ],
          "additionalProperties": false,
          "description": "Next TUI request"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-control-response"></a>
### `POST /tui/control/response`

| Field | Value |
| --- | --- |
| Operation ID | tui.control.response |
| Summary | Submit TUI response |
| Description | Submit a response to the TUI request queue to complete a pending request. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {}
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Response submitted successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Response submitted successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Response submitted successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-execute-command"></a>
### `POST /tui/execute-command`

| Field | Value |
| --- | --- |
| Operation ID | tui.executeCommand |
| Summary | Execute TUI command |
| Description | Execute a TUI command. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "command": {
            "type": "string"
          }
        },
        "required": [
          "command"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Command executed successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Command executed successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Command executed successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-open-help"></a>
### `POST /tui/open-help`

| Field | Value |
| --- | --- |
| Operation ID | tui.openHelp |
| Summary | Open help dialog |
| Description | Open the help dialog in the TUI to display user assistance information. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Help dialog opened successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Help dialog opened successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Help dialog opened successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-open-models"></a>
### `POST /tui/open-models`

| Field | Value |
| --- | --- |
| Operation ID | tui.openModels |
| Summary | Open models dialog |
| Description | Open the model dialog. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Model dialog opened successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Model dialog opened successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Model dialog opened successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-open-sessions"></a>
### `POST /tui/open-sessions`

| Field | Value |
| --- | --- |
| Operation ID | tui.openSessions |
| Summary | Open sessions dialog |
| Description | Open the session dialog. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session dialog opened successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session dialog opened successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Session dialog opened successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-open-themes"></a>
### `POST /tui/open-themes`

| Field | Value |
| --- | --- |
| Operation ID | tui.openThemes |
| Summary | Open themes dialog |
| Description | Open the theme dialog. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Theme dialog opened successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Theme dialog opened successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Theme dialog opened successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-publish"></a>
### `POST /tui/publish`

| Field | Value |
| --- | --- |
| Operation ID | tui.publish |
| Summary | Publish TUI event |
| Description | Publish a TUI event. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/EventTuiPromptAppend"
          },
          {
            "$ref": "#/components/schemas/EventTuiCommandExecute"
          },
          {
            "$ref": "#/components/schemas/EventTuiToastShow"
          },
          {
            "$ref": "#/components/schemas/EventTuiSessionSelect"
          }
        ]
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Event published successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Event published successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Event published successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-select-session"></a>
### `POST /tui/select-session`

| Field | Value |
| --- | --- |
| Operation ID | tui.selectSession |
| Summary | Select session |
| Description | Navigate the TUI to display the specified session. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "sessionID": {
            "type": "string",
            "pattern": "^ses",
            "description": "Session ID to navigate to"
          }
        },
        "required": [
          "sessionID"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Session selected successfully | application/json | `boolean` |
| 400 | Bad request | application/json | `#/components/schemas/BadRequestError` |
| 404 | NotFoundError | application/json | `#/components/schemas/NotFoundError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Session selected successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Session selected successfully"
        }
      }
    }
  },
  "400": {
    "description": "Bad request",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/BadRequestError"
        }
      }
    }
  },
  "404": {
    "description": "NotFoundError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/NotFoundError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-show-toast"></a>
### `POST /tui/show-toast`

| Field | Value |
| --- | --- |
| Operation ID | tui.showToast |
| Summary | Show TUI toast |
| Description | Show a toast notification in the TUI. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "variant": {
            "type": "string",
            "enum": [
              "info",
              "success",
              "warning",
              "error"
            ]
          },
          "duration": {
            "type": "integer",
            "exclusiveMinimum": 0
          }
        },
        "required": [
          "message",
          "variant"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Toast notification shown successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Toast notification shown successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Toast notification shown successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-tui-submit-prompt"></a>
### `POST /tui/submit-prompt`

| Field | Value |
| --- | --- |
| Operation ID | tui.submitPrompt |
| Summary | Submit TUI prompt |
| Description | Submit the prompt. |
| Tags | tui |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Prompt submitted successfully | application/json | `boolean` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Prompt submitted successfully",
    "content": {
      "application/json": {
        "schema": {
          "type": "boolean",
          "description": "Prompt submitted successfully"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-vcs"></a>
### `GET /vcs`

| Field | Value |
| --- | --- |
| Operation ID | vcs.get |
| Summary | Get VCS info |
| Description | Retrieve version control system (VCS) information for the current project, such as git branch. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | VCS info | application/json | `#/components/schemas/VcsInfo` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "VCS info",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/VcsInfo"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-post-vcs-apply"></a>
### `POST /vcs/apply`

| Field | Value |
| --- | --- |
| Operation ID | vcs.apply |
| Summary | Apply VCS patch |
| Description | Apply a raw patch to the current working tree. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

```json
{
  "content": {
    "application/json": {
      "schema": {
        "type": "object",
        "properties": {
          "patch": {
            "type": "string"
          }
        },
        "required": [
          "patch"
        ],
        "additionalProperties": false
      }
    }
  }
}
```

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | VCS patch applied | application/json | `object` |
| 400 | VcsApplyError | application/json | `#/components/schemas/VcsApplyError` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "VCS patch applied",
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "properties": {
            "applied": {
              "type": "boolean"
            }
          },
          "required": [
            "applied"
          ],
          "additionalProperties": false,
          "description": "VCS patch applied"
        }
      }
    }
  },
  "400": {
    "description": "VcsApplyError",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/VcsApplyError"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-vcs-diff"></a>
### `GET /vcs/diff`

| Field | Value |
| --- | --- |
| Operation ID | vcs.diff |
| Summary | Get VCS diff |
| Description | Retrieve the current git diff for the working tree or against the default branch. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |
| mode | query | true | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "mode",
    "in": "query",
    "schema": {
      "type": "string",
      "enum": [
        "git",
        "branch"
      ]
    },
    "required": true
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | VCS diff | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "VCS diff",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/VcsFileDiff"
          },
          "description": "VCS diff"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-vcs-diff-raw"></a>
### `GET /vcs/diff/raw`

| Field | Value |
| --- | --- |
| Operation ID | vcs.diff.raw |
| Summary | Get raw VCS diff |
| Description | Retrieve a raw patch for current uncommitted changes. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | Raw VCS diff | text/x-diff; charset=utf-8 | `string` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "Raw VCS diff",
    "content": {
      "text/x-diff; charset=utf-8": {
        "schema": {
          "type": "string"
        }
      }
    }
  }
}
```
</details>

<a id="endpoint-get-vcs-status"></a>
### `GET /vcs/status`

| Field | Value |
| --- | --- |
| Operation ID | vcs.status |
| Summary | Get VCS status |
| Description | Retrieve changed files in the current working tree without patches. |
| Tags | instance |
| Deprecated | false |

#### Parameters

| Name | In | Required | Description | Schema |
| --- | --- | --- | --- | --- |
| directory | query | false | - | `string` |
| workspace | query | false | - | `string` |

<details>
<summary>Raw parameters</summary>

```json
[
  {
    "name": "directory",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  },
  {
    "name": "workspace",
    "in": "query",
    "schema": {
      "type": "string"
    },
    "required": false
  }
]
```
</details>

#### Request Body

_No request body._

#### Responses

| Status | Description | Content Types | Schema |
| --- | --- | --- | --- |
| 200 | VCS status | application/json | `array` |

<details>
<summary>Raw responses</summary>

```json
{
  "200": {
    "description": "VCS status",
    "content": {
      "application/json": {
        "schema": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/VcsFileStatus"
          },
          "description": "VCS status"
        }
      }
    }
  }
}
```
</details>

## Components

_No non-schema components._

## Schemas

<a id="schema-agent"></a>
### `Agent`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "mode": {
      "type": "string",
      "enum": [
        "subagent",
        "primary",
        "all"
      ]
    },
    "native": {
      "type": "boolean"
    },
    "hidden": {
      "type": "boolean"
    },
    "topP": {
      "type": "number"
    },
    "temperature": {
      "type": "number"
    },
    "color": {
      "type": "string"
    },
    "permission": {
      "$ref": "#/components/schemas/PermissionRuleset"
    },
    "model": {
      "type": "object",
      "properties": {
        "modelID": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        }
      },
      "required": [
        "modelID",
        "providerID"
      ],
      "additionalProperties": false
    },
    "variant": {
      "type": "string"
    },
    "prompt": {
      "type": "string"
    },
    "options": {
      "type": "object"
    },
    "steps": {
      "type": "number"
    }
  },
  "required": [
    "name",
    "mode",
    "permission",
    "options"
  ],
  "additionalProperties": false
}
```

<a id="schema-agentconfig"></a>
### `AgentConfig`

```json
{
  "type": "object",
  "properties": {
    "model": {
      "type": "string"
    },
    "variant": {
      "type": "string"
    },
    "temperature": {
      "type": "number"
    },
    "top_p": {
      "type": "number"
    },
    "prompt": {
      "type": "string"
    },
    "tools": {
      "type": "object",
      "additionalProperties": {
        "type": "boolean"
      }
    },
    "disable": {
      "type": "boolean"
    },
    "description": {
      "type": "string"
    },
    "mode": {
      "type": "string",
      "enum": [
        "subagent",
        "primary",
        "all"
      ]
    },
    "hidden": {
      "type": "boolean"
    },
    "options": {
      "type": "object"
    },
    "color": {
      "anyOf": [
        {
          "type": "string",
          "pattern": "^#[0-9a-fA-F]{6}$"
        },
        {
          "type": "string",
          "enum": [
            "primary",
            "secondary",
            "accent",
            "success",
            "warning",
            "error",
            "info"
          ]
        }
      ],
      "description": "Hex color code (e.g., #FF5733) or theme color (e.g., primary)"
    },
    "steps": {
      "type": "integer",
      "exclusiveMinimum": 0
    },
    "maxSteps": {
      "type": "integer",
      "exclusiveMinimum": 0
    },
    "permission": {
      "$ref": "#/components/schemas/PermissionConfig"
    }
  },
  "additionalProperties": {}
}
```

<a id="schema-agentpart"></a>
### `AgentPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "agent"
      ]
    },
    "name": {
      "type": "string"
    },
    "source": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "value",
        "start",
        "end"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "name"
  ],
  "additionalProperties": false
}
```

<a id="schema-agentpartinput"></a>
### `AgentPartInput`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "type": {
      "type": "string",
      "enum": [
        "agent"
      ]
    },
    "name": {
      "type": "string"
    },
    "source": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "value",
        "start",
        "end"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name"
  ],
  "additionalProperties": false
}
```

<a id="schema-apiauth"></a>
### `ApiAuth`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "api"
      ]
    },
    "key": {
      "type": "string"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  },
  "required": [
    "type",
    "key"
  ],
  "additionalProperties": false
}
```

<a id="schema-apierror"></a>
### `APIError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "APIError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "statusCode": {
          "type": "integer",
          "minimum": 0
        },
        "isRetryable": {
          "type": "boolean"
        },
        "responseHeaders": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "responseBody": {
          "type": "string"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      },
      "required": [
        "message",
        "isRetryable"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-assistantmessage"></a>
### `AssistantMessage`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^msg"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "role": {
      "type": "string",
      "enum": [
        "assistant"
      ]
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        },
        "completed": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "error": {
      "anyOf": [
        {
          "$ref": "#/components/schemas/ProviderAuthError"
        },
        {
          "$ref": "#/components/schemas/UnknownError"
        },
        {
          "$ref": "#/components/schemas/MessageOutputLengthError"
        },
        {
          "$ref": "#/components/schemas/MessageAbortedError"
        },
        {
          "$ref": "#/components/schemas/StructuredOutputError"
        },
        {
          "$ref": "#/components/schemas/ContextOverflowError"
        },
        {
          "$ref": "#/components/schemas/APIError"
        }
      ]
    },
    "parentID": {
      "type": "string",
      "pattern": "^msg"
    },
    "modelID": {
      "type": "string"
    },
    "providerID": {
      "type": "string"
    },
    "mode": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "path": {
      "type": "object",
      "properties": {
        "cwd": {
          "type": "string"
        },
        "root": {
          "type": "string"
        }
      },
      "required": [
        "cwd",
        "root"
      ],
      "additionalProperties": false
    },
    "summary": {
      "type": "boolean"
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "total": {
          "type": "number"
        },
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    },
    "structured": {},
    "variant": {
      "type": "string"
    },
    "finish": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "sessionID",
    "role",
    "time",
    "parentID",
    "modelID",
    "providerID",
    "mode",
    "agent",
    "path",
    "cost",
    "tokens"
  ],
  "additionalProperties": false
}
```

<a id="schema-attachmentconfig"></a>
### `AttachmentConfig`

```json
{
  "type": "object",
  "properties": {
    "image": {
      "$ref": "#/components/schemas/ImageAttachmentConfig"
    }
  },
  "additionalProperties": false
}
```

<a id="schema-auth"></a>
### `Auth`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/OAuth"
    },
    {
      "$ref": "#/components/schemas/ApiAuth"
    },
    {
      "$ref": "#/components/schemas/WellKnownAuth"
    }
  ]
}
```

<a id="schema-badrequesterror"></a>
### `BadRequestError`

```json
{
  "type": "object",
  "required": [
    "name",
    "data"
  ],
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "BadRequest"
      ]
    },
    "data": {
      "type": "object",
      "required": [
        "message"
      ],
      "properties": {
        "message": {
          "type": "string"
        },
        "kind": {
          "type": "string",
          "enum": [
            "Params",
            "Headers",
            "Query",
            "Body",
            "Payload"
          ]
        }
      }
    }
  }
}
```

<a id="schema-command"></a>
### `Command`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "string"
    },
    "source": {
      "type": "string",
      "enum": [
        "command",
        "mcp",
        "skill"
      ]
    },
    "template": {
      "type": "string"
    },
    "subtask": {
      "type": "boolean"
    },
    "hints": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "name",
    "template",
    "hints"
  ],
  "additionalProperties": false
}
```

<a id="schema-compactionpart"></a>
### `CompactionPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "compaction"
      ]
    },
    "auto": {
      "type": "boolean"
    },
    "overflow": {
      "type": "boolean"
    },
    "tail_start_id": {
      "type": "string",
      "pattern": "^msg"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "auto"
  ],
  "additionalProperties": false
}
```

<a id="schema-config"></a>
### `Config`

```json
{
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "shell": {
      "type": "string"
    },
    "logLevel": {
      "$ref": "#/components/schemas/LogLevel"
    },
    "server": {
      "$ref": "#/components/schemas/ServerConfig"
    },
    "command": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "template": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "agent": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "subtask": {
            "type": "boolean"
          }
        },
        "required": [
          "template"
        ],
        "additionalProperties": false
      }
    },
    "skills": {
      "type": "object",
      "properties": {
        "paths": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "urls": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "reference": {
      "$ref": "#/components/schemas/ReferenceConfig"
    },
    "watcher": {
      "type": "object",
      "properties": {
        "ignore": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "snapshot": {
      "type": "boolean"
    },
    "plugin": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "array",
            "prefixItems": [
              {
                "type": "string"
              },
              {
                "type": "object"
              }
            ],
            "maxItems": 2,
            "minItems": 2
          }
        ]
      }
    },
    "share": {
      "type": "string",
      "enum": [
        "manual",
        "auto",
        "disabled"
      ]
    },
    "autoshare": {
      "type": "boolean"
    },
    "autoupdate": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "string",
          "enum": [
            "notify"
          ]
        }
      ],
      "description": "Automatically update to the latest version. Set to true to auto-update, false to disable, or 'notify' to show update notifications"
    },
    "disabled_providers": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "enabled_providers": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "model": {
      "type": "string"
    },
    "small_model": {
      "type": "string"
    },
    "default_agent": {
      "type": "string"
    },
    "username": {
      "type": "string"
    },
    "mode": {
      "type": "object",
      "properties": {
        "build": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "plan": {
          "$ref": "#/components/schemas/AgentConfig"
        }
      },
      "additionalProperties": {
        "$ref": "#/components/schemas/AgentConfig"
      }
    },
    "agent": {
      "type": "object",
      "properties": {
        "plan": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "build": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "general": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "explore": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "scout": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "title": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "summary": {
          "$ref": "#/components/schemas/AgentConfig"
        },
        "compaction": {
          "$ref": "#/components/schemas/AgentConfig"
        }
      },
      "additionalProperties": {
        "$ref": "#/components/schemas/AgentConfig"
      }
    },
    "provider": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/components/schemas/ProviderConfig"
      }
    },
    "mcp": {
      "type": "object",
      "additionalProperties": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/McpLocalConfig"
          },
          {
            "$ref": "#/components/schemas/McpRemoteConfig"
          },
          {
            "type": "object",
            "properties": {
              "enabled": {
                "type": "boolean"
              }
            },
            "required": [
              "enabled"
            ],
            "additionalProperties": false
          }
        ]
      }
    },
    "formatter": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "disabled": {
                "type": "boolean"
              },
              "command": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "environment": {
                "type": "object",
                "additionalProperties": {
                  "type": "string"
                }
              },
              "extensions": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "additionalProperties": false
          }
        }
      ],
      "description": "Enable or configure formatters. Omit or set to false to disable, true to enable built-ins, or an object to enable built-ins with overrides."
    },
    "lsp": {
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "object",
          "additionalProperties": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "disabled": {
                    "type": "boolean",
                    "enum": [
                      true
                    ]
                  }
                },
                "required": [
                  "disabled"
                ],
                "additionalProperties": false
              },
              {
                "type": "object",
                "properties": {
                  "command": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "extensions": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "disabled": {
                    "type": "boolean"
                  },
                  "env": {
                    "type": "object",
                    "additionalProperties": {
                      "type": "string"
                    }
                  },
                  "initialization": {
                    "type": "object"
                  }
                },
                "required": [
                  "command"
                ],
                "additionalProperties": false
              }
            ]
          }
        }
      ],
      "description": "Enable or configure LSP servers. Omit or set to false to disable, true to enable built-ins, or an object to enable built-ins with overrides."
    },
    "instructions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "layout": {
      "$ref": "#/components/schemas/LayoutConfig"
    },
    "permission": {
      "$ref": "#/components/schemas/PermissionConfig"
    },
    "tools": {
      "type": "object",
      "additionalProperties": {
        "type": "boolean"
      }
    },
    "attachment": {
      "$ref": "#/components/schemas/AttachmentConfig"
    },
    "enterprise": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "tool_output": {
      "type": "object",
      "properties": {
        "max_lines": {
          "type": "integer",
          "exclusiveMinimum": 0
        },
        "max_bytes": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "additionalProperties": false
    },
    "compaction": {
      "type": "object",
      "properties": {
        "auto": {
          "type": "boolean"
        },
        "prune": {
          "type": "boolean"
        },
        "tail_turns": {
          "type": "integer",
          "minimum": 0
        },
        "preserve_recent_tokens": {
          "type": "integer",
          "minimum": 0
        },
        "reserved": {
          "type": "integer",
          "minimum": 0
        }
      },
      "additionalProperties": false
    },
    "experimental": {
      "type": "object",
      "properties": {
        "disable_paste_summary": {
          "type": "boolean"
        },
        "batch_tool": {
          "type": "boolean"
        },
        "openTelemetry": {
          "type": "boolean"
        },
        "primary_tools": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "continue_loop_on_deny": {
          "type": "boolean"
        },
        "mcp_timeout": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

<a id="schema-consolestate"></a>
### `ConsoleState`

```json
{
  "type": "object",
  "properties": {
    "consoleManagedProviders": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "activeOrgName": {
      "type": "string"
    },
    "switchableOrgCount": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "consoleManagedProviders",
    "switchableOrgCount"
  ],
  "additionalProperties": false
}
```

<a id="schema-contextoverflowerror"></a>
### `ContextOverflowError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "ContextOverflowError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "responseBody": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-effect-httpapierror-forbidden"></a>
### `effect_HttpApiError_Forbidden`

```json
{
  "type": "object",
  "properties": {
    "_tag": {
      "type": "string",
      "enum": [
        "Forbidden"
      ]
    }
  },
  "required": [
    "_tag"
  ],
  "additionalProperties": false
}
```

<a id="schema-effect-httpapierror-internalservererror"></a>
### `effect_HttpApiError_InternalServerError`

```json
{
  "type": "object",
  "properties": {
    "_tag": {
      "type": "string",
      "enum": [
        "InternalServerError"
      ]
    }
  },
  "required": [
    "_tag"
  ],
  "additionalProperties": false
}
```

<a id="schema-event"></a>
### `Event`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/EventServerInstanceDisposed"
    },
    {
      "$ref": "#/components/schemas/EventPermissionAsked"
    },
    {
      "$ref": "#/components/schemas/EventPermissionReplied"
    },
    {
      "$ref": "#/components/schemas/EventLspClientDiagnostics"
    },
    {
      "$ref": "#/components/schemas/EventLspUpdated"
    },
    {
      "$ref": "#/components/schemas/EventMessagePartDelta"
    },
    {
      "$ref": "#/components/schemas/EventSessionDiff"
    },
    {
      "$ref": "#/components/schemas/EventSessionError"
    },
    {
      "$ref": "#/components/schemas/Event.tui.prompt.append"
    },
    {
      "$ref": "#/components/schemas/Event.tui.command.execute"
    },
    {
      "$ref": "#/components/schemas/EventTuiToastShow1"
    },
    {
      "$ref": "#/components/schemas/Event.tui.session.select"
    },
    {
      "$ref": "#/components/schemas/EventInstallationUpdated"
    },
    {
      "$ref": "#/components/schemas/EventInstallationUpdate-available"
    },
    {
      "$ref": "#/components/schemas/EventMcpToolsChanged"
    },
    {
      "$ref": "#/components/schemas/EventMcpBrowserOpenFailed"
    },
    {
      "$ref": "#/components/schemas/EventCommandExecuted"
    },
    {
      "$ref": "#/components/schemas/EventProjectUpdated"
    },
    {
      "$ref": "#/components/schemas/EventFileEdited"
    },
    {
      "$ref": "#/components/schemas/EventFileWatcherUpdated"
    },
    {
      "$ref": "#/components/schemas/EventVcsBranchUpdated"
    },
    {
      "$ref": "#/components/schemas/EventWorktreeReady"
    },
    {
      "$ref": "#/components/schemas/EventWorktreeFailed"
    },
    {
      "$ref": "#/components/schemas/EventQuestionAsked"
    },
    {
      "$ref": "#/components/schemas/EventQuestionReplied"
    },
    {
      "$ref": "#/components/schemas/EventQuestionRejected"
    },
    {
      "$ref": "#/components/schemas/EventTodoUpdated"
    },
    {
      "$ref": "#/components/schemas/EventSessionStatus"
    },
    {
      "$ref": "#/components/schemas/EventSessionIdle"
    },
    {
      "$ref": "#/components/schemas/EventSessionCompacted"
    },
    {
      "$ref": "#/components/schemas/EventWorkspaceReady"
    },
    {
      "$ref": "#/components/schemas/EventWorkspaceFailed"
    },
    {
      "$ref": "#/components/schemas/EventWorkspaceStatus"
    },
    {
      "$ref": "#/components/schemas/EventPtyCreated"
    },
    {
      "$ref": "#/components/schemas/EventPtyUpdated"
    },
    {
      "$ref": "#/components/schemas/EventPtyExited"
    },
    {
      "$ref": "#/components/schemas/EventPtyDeleted"
    },
    {
      "$ref": "#/components/schemas/EventMessageUpdated"
    },
    {
      "$ref": "#/components/schemas/EventMessageRemoved"
    },
    {
      "$ref": "#/components/schemas/EventMessagePartUpdated"
    },
    {
      "$ref": "#/components/schemas/EventMessagePartRemoved"
    },
    {
      "$ref": "#/components/schemas/EventSessionCreated"
    },
    {
      "$ref": "#/components/schemas/EventSessionUpdated"
    },
    {
      "$ref": "#/components/schemas/EventSessionDeleted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextAgentSwitched"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextModelSwitched"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextPrompted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextSynthetic"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextShellStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextShellEnded"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextStepStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextStepEnded"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextStepFailed"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextTextStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextTextDelta"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextTextEnded"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextReasoningStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextReasoningDelta"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextReasoningEnded"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolInputStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolInputDelta"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolInputEnded"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolCalled"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolProgress"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolSuccess"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextToolFailed"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextRetried"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextCompactionStarted"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextCompactionDelta"
    },
    {
      "$ref": "#/components/schemas/EventSessionNextCompactionEnded"
    },
    {
      "$ref": "#/components/schemas/EventServerConnected"
    },
    {
      "$ref": "#/components/schemas/EventGlobalDisposed"
    }
  ]
}
```

<a id="schema-event-tui-command-execute"></a>
### `Event.tui.command.execute`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "tui.command.execute"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "command": {
          "anyOf": [
            {
              "type": "string",
              "enum": [
                "session.list",
                "session.new",
                "session.share",
                "session.interrupt",
                "session.compact",
                "session.page.up",
                "session.page.down",
                "session.line.up",
                "session.line.down",
                "session.half.page.up",
                "session.half.page.down",
                "session.first",
                "session.last",
                "prompt.clear",
                "prompt.submit",
                "agent.cycle"
              ]
            },
            {
              "type": "string"
            }
          ]
        }
      },
      "required": [
        "command"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-event-tui-prompt-append"></a>
### `Event.tui.prompt.append`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "tui.prompt.append"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-event-tui-session-select"></a>
### `Event.tui.session.select`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "tui.session.select"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses",
          "description": "Session ID to navigate to"
        }
      },
      "required": [
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-event-tui-toast-show"></a>
### `Event.tui.toast.show`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "tui.toast.show"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "variant": {
          "type": "string",
          "enum": [
            "info",
            "success",
            "warning",
            "error"
          ]
        },
        "duration": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "required": [
        "message",
        "variant"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventcommandexecuted"></a>
### `EventCommandExecuted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "command.executed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "arguments": {
          "type": "string"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        }
      },
      "required": [
        "name",
        "sessionID",
        "arguments",
        "messageID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventfileedited"></a>
### `EventFileEdited`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "file.edited"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "file": {
          "type": "string"
        }
      },
      "required": [
        "file"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventfilewatcherupdated"></a>
### `EventFileWatcherUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "file.watcher.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "file": {
          "type": "string"
        },
        "event": {
          "type": "string",
          "enum": [
            "add",
            "change",
            "unlink"
          ]
        }
      },
      "required": [
        "file",
        "event"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventglobaldisposed"></a>
### `EventGlobalDisposed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "global.disposed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {}
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventinstallationupdate-available"></a>
### `EventInstallationUpdate-available`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "installation.update-available"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "version": {
          "type": "string"
        }
      },
      "required": [
        "version"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventinstallationupdated"></a>
### `EventInstallationUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "installation.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "version": {
          "type": "string"
        }
      },
      "required": [
        "version"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventlspclientdiagnostics"></a>
### `EventLspClientDiagnostics`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "lsp.client.diagnostics"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "serverID": {
          "type": "string"
        },
        "path": {
          "type": "string"
        }
      },
      "required": [
        "serverID",
        "path"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventlspupdated"></a>
### `EventLspUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "lsp.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {}
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmcpbrowseropenfailed"></a>
### `EventMcpBrowserOpenFailed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "mcp.browser.open.failed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "mcpName": {
          "type": "string"
        },
        "url": {
          "type": "string"
        }
      },
      "required": [
        "mcpName",
        "url"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmcptoolschanged"></a>
### `EventMcpToolsChanged`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "mcp.tools.changed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "server": {
          "type": "string"
        }
      },
      "required": [
        "server"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmessagepartdelta"></a>
### `EventMessagePartDelta`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "message.part.delta"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "partID": {
          "type": "string",
          "pattern": "^prt"
        },
        "field": {
          "type": "string"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "sessionID",
        "messageID",
        "partID",
        "field",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmessagepartremoved"></a>
### `EventMessagePartRemoved`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "message.part.removed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "partID": {
          "type": "string",
          "pattern": "^prt"
        }
      },
      "required": [
        "sessionID",
        "messageID",
        "partID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmessagepartupdated"></a>
### `EventMessagePartUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "message.part.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "part": {
          "$ref": "#/components/schemas/Part"
        },
        "time": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "sessionID",
        "part",
        "time"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmessageremoved"></a>
### `EventMessageRemoved`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "message.removed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        }
      },
      "required": [
        "sessionID",
        "messageID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventmessageupdated"></a>
### `EventMessageUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "message.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Message"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventpermissionasked"></a>
### `EventPermissionAsked`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "permission.asked"
      ]
    },
    "properties": {
      "$ref": "#/components/schemas/PermissionRequest"
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventpermissionreplied"></a>
### `EventPermissionReplied`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "permission.replied"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "requestID": {
          "type": "string",
          "pattern": "^per"
        },
        "reply": {
          "type": "string",
          "enum": [
            "once",
            "always",
            "reject"
          ]
        }
      },
      "required": [
        "sessionID",
        "requestID",
        "reply"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventprojectupdated"></a>
### `EventProjectUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "project.updated"
      ]
    },
    "properties": {
      "$ref": "#/components/schemas/Project"
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventptycreated"></a>
### `EventPtyCreated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "pty.created"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "info": {
          "$ref": "#/components/schemas/Pty"
        }
      },
      "required": [
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventptydeleted"></a>
### `EventPtyDeleted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "pty.deleted"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pty"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventptyexited"></a>
### `EventPtyExited`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "pty.exited"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^pty"
        },
        "exitCode": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "id",
        "exitCode"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventptyupdated"></a>
### `EventPtyUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "pty.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "info": {
          "$ref": "#/components/schemas/Pty"
        }
      },
      "required": [
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventquestionasked"></a>
### `EventQuestionAsked`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "question.asked"
      ]
    },
    "properties": {
      "$ref": "#/components/schemas/QuestionRequest"
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventquestionrejected"></a>
### `EventQuestionRejected`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "question.rejected"
      ]
    },
    "properties": {
      "$ref": "#/components/schemas/QuestionRejected"
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventquestionreplied"></a>
### `EventQuestionReplied`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "question.replied"
      ]
    },
    "properties": {
      "$ref": "#/components/schemas/QuestionReplied"
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventserverconnected"></a>
### `EventServerConnected`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "server.connected"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {}
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventserverinstancedisposed"></a>
### `EventServerInstanceDisposed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "server.instance.disposed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "directory": {
          "type": "string"
        }
      },
      "required": [
        "directory"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessioncompacted"></a>
### `EventSessionCompacted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.compacted"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        }
      },
      "required": [
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessioncreated"></a>
### `EventSessionCreated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.created"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Session"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessiondeleted"></a>
### `EventSessionDeleted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.deleted"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Session"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessiondiff"></a>
### `EventSessionDiff`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.diff"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "diff": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SnapshotFileDiff"
          }
        }
      },
      "required": [
        "sessionID",
        "diff"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionerror"></a>
### `EventSessionError`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.error"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "error": {
          "anyOf": [
            {
              "$ref": "#/components/schemas/ProviderAuthError"
            },
            {
              "$ref": "#/components/schemas/UnknownError"
            },
            {
              "$ref": "#/components/schemas/MessageOutputLengthError"
            },
            {
              "$ref": "#/components/schemas/MessageAbortedError"
            },
            {
              "$ref": "#/components/schemas/StructuredOutputError"
            },
            {
              "$ref": "#/components/schemas/ContextOverflowError"
            },
            {
              "$ref": "#/components/schemas/APIError"
            }
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionidle"></a>
### `EventSessionIdle`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.idle"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        }
      },
      "required": [
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextagentswitched"></a>
### `EventSessionNextAgentSwitched`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.agent.switched"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "agent": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "agent"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextcompactiondelta"></a>
### `EventSessionNextCompactionDelta`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.compaction.delta"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextcompactionended"></a>
### `EventSessionNextCompactionEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.compaction.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        },
        "include": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextcompactionstarted"></a>
### `EventSessionNextCompactionStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.compaction.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reason": {
          "type": "string",
          "enum": [
            "auto",
            "manual"
          ]
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reason"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextmodelswitched"></a>
### `EventSessionNextModelSwitched`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.model.switched"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "model": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "providerID": {
              "type": "string"
            },
            "variant": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "providerID",
            "variant"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "model"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextprompted"></a>
### `EventSessionNextPrompted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.prompted"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "prompt": {
          "$ref": "#/components/schemas/Prompt"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "prompt"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextreasoningdelta"></a>
### `EventSessionNextReasoningDelta`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.reasoning.delta"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextreasoningended"></a>
### `EventSessionNextReasoningEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.reasoning.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextreasoningstarted"></a>
### `EventSessionNextReasoningStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.reasoning.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextretried"></a>
### `EventSessionNextRetried`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.retried"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "attempt": {
          "type": "number"
        },
        "error": {
          "$ref": "#/components/schemas/SessionNextRetry_error"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "attempt",
        "error"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextshellended"></a>
### `EventSessionNextShellEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.shell.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "output": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "output"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextshellstarted"></a>
### `EventSessionNextShellStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.shell.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "command": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "command"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextstepended"></a>
### `EventSessionNextStepEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.step.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "finish": {
          "type": "string"
        },
        "cost": {
          "type": "number"
        },
        "tokens": {
          "type": "object",
          "properties": {
            "input": {
              "type": "number"
            },
            "output": {
              "type": "number"
            },
            "reasoning": {
              "type": "number"
            },
            "cache": {
              "type": "object",
              "properties": {
                "read": {
                  "type": "number"
                },
                "write": {
                  "type": "number"
                }
              },
              "required": [
                "read",
                "write"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "input",
            "output",
            "reasoning",
            "cache"
          ],
          "additionalProperties": false
        },
        "snapshot": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "finish",
        "cost",
        "tokens"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextstepfailed"></a>
### `EventSessionNextStepFailed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.step.failed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "error": {
          "$ref": "#/components/schemas/SessionErrorUnknown"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "error"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextstepstarted"></a>
### `EventSessionNextStepStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.step.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "agent": {
          "type": "string"
        },
        "model": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "providerID": {
              "type": "string"
            },
            "variant": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "providerID",
            "variant"
          ],
          "additionalProperties": false
        },
        "snapshot": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "agent",
        "model"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnextsynthetic"></a>
### `EventSessionNextSynthetic`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.synthetic"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttextdelta"></a>
### `EventSessionNextTextDelta`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.text.delta"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttextended"></a>
### `EventSessionNextTextEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.text.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttextstarted"></a>
### `EventSessionNextTextStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.text.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        }
      },
      "required": [
        "timestamp",
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolcalled"></a>
### `EventSessionNextToolCalled`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.called"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "tool": {
          "type": "string"
        },
        "input": {
          "type": "object"
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "tool",
        "input",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolfailed"></a>
### `EventSessionNextToolFailed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.failed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "error": {
          "$ref": "#/components/schemas/SessionErrorUnknown"
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "error",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolinputdelta"></a>
### `EventSessionNextToolInputDelta`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.input.delta"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolinputended"></a>
### `EventSessionNextToolInputEnded`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.input.ended"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolinputstarted"></a>
### `EventSessionNextToolInputStarted`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.input.started"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "name"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolprogress"></a>
### `EventSessionNextToolProgress`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.progress"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "structured": {
          "type": "object"
        },
        "content": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ToolTextContent"
              },
              {
                "$ref": "#/components/schemas/ToolFileContent"
              }
            ]
          }
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "structured",
        "content"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionnexttoolsuccess"></a>
### `EventSessionNextToolSuccess`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.next.tool.success"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "structured": {
          "type": "object"
        },
        "content": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ToolTextContent"
              },
              {
                "$ref": "#/components/schemas/ToolFileContent"
              }
            ]
          }
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "structured",
        "content",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionstatus"></a>
### `EventSessionStatus`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.status"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "status": {
          "$ref": "#/components/schemas/SessionStatus"
        }
      },
      "required": [
        "sessionID",
        "status"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventsessionupdated"></a>
### `EventSessionUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "session.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Session"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtodoupdated"></a>
### `EventTodoUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "todo.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "todos": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/Todo"
          }
        }
      },
      "required": [
        "sessionID",
        "todos"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtuicommandexecute"></a>
### `EventTuiCommandExecute`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "tui.command.execute"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "command": {
          "anyOf": [
            {
              "type": "string",
              "enum": [
                "session.list",
                "session.new",
                "session.share",
                "session.interrupt",
                "session.compact",
                "session.page.up",
                "session.page.down",
                "session.line.up",
                "session.line.down",
                "session.half.page.up",
                "session.half.page.down",
                "session.first",
                "session.last",
                "prompt.clear",
                "prompt.submit",
                "agent.cycle"
              ]
            },
            {
              "type": "string"
            }
          ]
        }
      },
      "required": [
        "command"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtuipromptappend"></a>
### `EventTuiPromptAppend`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "tui.prompt.append"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string"
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtuisessionselect"></a>
### `EventTuiSessionSelect`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "tui.session.select"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses",
          "description": "Session ID to navigate to"
        }
      },
      "required": [
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtuitoastshow"></a>
### `EventTuiToastShow`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "tui.toast.show"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "variant": {
          "type": "string",
          "enum": [
            "info",
            "success",
            "warning",
            "error"
          ]
        },
        "duration": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "required": [
        "message",
        "variant"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventtuitoastshow1"></a>
### `EventTuiToastShow1`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "tui.toast.show"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "variant": {
          "type": "string",
          "enum": [
            "info",
            "success",
            "warning",
            "error"
          ]
        },
        "duration": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "required": [
        "message",
        "variant"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventvcsbranchupdated"></a>
### `EventVcsBranchUpdated`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "vcs.branch.updated"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "branch": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventworkspacefailed"></a>
### `EventWorkspaceFailed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "workspace.failed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventworkspaceready"></a>
### `EventWorkspaceReady`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "workspace.ready"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventworkspacestatus"></a>
### `EventWorkspaceStatus`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "workspace.status"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "workspaceID": {
          "type": "string",
          "pattern": "^wrk"
        },
        "status": {
          "type": "string",
          "enum": [
            "connected",
            "connecting",
            "disconnected",
            "error"
          ]
        }
      },
      "required": [
        "workspaceID",
        "status"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventworktreefailed"></a>
### `EventWorktreeFailed`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "worktree.failed"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-eventworktreeready"></a>
### `EventWorktreeReady`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "worktree.ready"
      ]
    },
    "properties": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "branch": {
          "type": "string"
        }
      },
      "required": [
        "name"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "type",
    "properties"
  ],
  "additionalProperties": false
}
```

<a id="schema-file"></a>
### `File`

```json
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string"
    },
    "added": {
      "type": "integer",
      "minimum": 0
    },
    "removed": {
      "type": "integer",
      "minimum": 0
    },
    "status": {
      "type": "string",
      "enum": [
        "added",
        "deleted",
        "modified"
      ]
    }
  },
  "required": [
    "path",
    "added",
    "removed",
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-filecontent"></a>
### `FileContent`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "text",
        "binary"
      ]
    },
    "content": {
      "type": "string"
    },
    "diff": {
      "type": "string"
    },
    "patch": {
      "type": "object",
      "properties": {
        "oldFileName": {
          "type": "string"
        },
        "newFileName": {
          "type": "string"
        },
        "oldHeader": {
          "type": "string"
        },
        "newHeader": {
          "type": "string"
        },
        "hunks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "oldStart": {
                "type": "integer",
                "minimum": 0
              },
              "oldLines": {
                "type": "integer",
                "minimum": 0
              },
              "newStart": {
                "type": "integer",
                "minimum": 0
              },
              "newLines": {
                "type": "integer",
                "minimum": 0
              },
              "lines": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "required": [
              "oldStart",
              "oldLines",
              "newStart",
              "newLines",
              "lines"
            ],
            "additionalProperties": false
          }
        },
        "index": {
          "type": "string"
        }
      },
      "required": [
        "oldFileName",
        "newFileName",
        "hunks"
      ],
      "additionalProperties": false
    },
    "encoding": {
      "type": "string",
      "enum": [
        "base64"
      ]
    },
    "mimeType": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "content"
  ],
  "additionalProperties": false
}
```

<a id="schema-filenode"></a>
### `FileNode`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "path": {
      "type": "string"
    },
    "absolute": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "file",
        "directory"
      ]
    },
    "ignored": {
      "type": "boolean"
    }
  },
  "required": [
    "name",
    "path",
    "absolute",
    "type",
    "ignored"
  ],
  "additionalProperties": false
}
```

<a id="schema-filepart"></a>
### `FilePart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "file"
      ]
    },
    "mime": {
      "type": "string"
    },
    "filename": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "source": {
      "$ref": "#/components/schemas/FilePartSource"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "mime",
    "url"
  ],
  "additionalProperties": false
}
```

<a id="schema-filepartinput"></a>
### `FilePartInput`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "type": {
      "type": "string",
      "enum": [
        "file"
      ]
    },
    "mime": {
      "type": "string"
    },
    "filename": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "source": {
      "$ref": "#/components/schemas/FilePartSource"
    }
  },
  "required": [
    "type",
    "mime",
    "url"
  ],
  "additionalProperties": false
}
```

<a id="schema-filepartsource"></a>
### `FilePartSource`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/FileSource"
    },
    {
      "$ref": "#/components/schemas/SymbolSource"
    },
    {
      "$ref": "#/components/schemas/ResourceSource"
    }
  ]
}
```

<a id="schema-filepartsourcetext"></a>
### `FilePartSourceText`

```json
{
  "type": "object",
  "properties": {
    "value": {
      "type": "string"
    },
    "start": {
      "type": "number"
    },
    "end": {
      "type": "number"
    }
  },
  "required": [
    "value",
    "start",
    "end"
  ],
  "additionalProperties": false
}
```

<a id="schema-filesource"></a>
### `FileSource`

```json
{
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/components/schemas/FilePartSourceText"
    },
    "type": {
      "type": "string",
      "enum": [
        "file"
      ]
    },
    "path": {
      "type": "string"
    }
  },
  "required": [
    "text",
    "type",
    "path"
  ],
  "additionalProperties": false
}
```

<a id="schema-formatterstatus"></a>
### `FormatterStatus`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "extensions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "enabled": {
      "type": "boolean"
    }
  },
  "required": [
    "name",
    "extensions",
    "enabled"
  ],
  "additionalProperties": false
}
```

<a id="schema-globalevent"></a>
### `GlobalEvent`

```json
{
  "type": "object",
  "properties": {
    "directory": {
      "type": "string"
    },
    "project": {
      "type": "string"
    },
    "workspace": {
      "type": "string"
    },
    "payload": {
      "anyOf": [
        {
          "$ref": "#/components/schemas/EventServerInstanceDisposed"
        },
        {
          "$ref": "#/components/schemas/EventPermissionAsked"
        },
        {
          "$ref": "#/components/schemas/EventPermissionReplied"
        },
        {
          "$ref": "#/components/schemas/EventLspClientDiagnostics"
        },
        {
          "$ref": "#/components/schemas/EventLspUpdated"
        },
        {
          "$ref": "#/components/schemas/EventMessagePartDelta"
        },
        {
          "$ref": "#/components/schemas/EventSessionDiff"
        },
        {
          "$ref": "#/components/schemas/EventSessionError"
        },
        {
          "$ref": "#/components/schemas/Event.tui.prompt.append"
        },
        {
          "$ref": "#/components/schemas/Event.tui.command.execute"
        },
        {
          "$ref": "#/components/schemas/Event.tui.toast.show"
        },
        {
          "$ref": "#/components/schemas/Event.tui.session.select"
        },
        {
          "$ref": "#/components/schemas/EventInstallationUpdated"
        },
        {
          "$ref": "#/components/schemas/EventInstallationUpdate-available"
        },
        {
          "$ref": "#/components/schemas/EventMcpToolsChanged"
        },
        {
          "$ref": "#/components/schemas/EventMcpBrowserOpenFailed"
        },
        {
          "$ref": "#/components/schemas/EventCommandExecuted"
        },
        {
          "$ref": "#/components/schemas/EventProjectUpdated"
        },
        {
          "$ref": "#/components/schemas/EventFileEdited"
        },
        {
          "$ref": "#/components/schemas/EventFileWatcherUpdated"
        },
        {
          "$ref": "#/components/schemas/EventVcsBranchUpdated"
        },
        {
          "$ref": "#/components/schemas/EventWorktreeReady"
        },
        {
          "$ref": "#/components/schemas/EventWorktreeFailed"
        },
        {
          "$ref": "#/components/schemas/EventQuestionAsked"
        },
        {
          "$ref": "#/components/schemas/EventQuestionReplied"
        },
        {
          "$ref": "#/components/schemas/EventQuestionRejected"
        },
        {
          "$ref": "#/components/schemas/EventTodoUpdated"
        },
        {
          "$ref": "#/components/schemas/EventSessionStatus"
        },
        {
          "$ref": "#/components/schemas/EventSessionIdle"
        },
        {
          "$ref": "#/components/schemas/EventSessionCompacted"
        },
        {
          "$ref": "#/components/schemas/EventWorkspaceReady"
        },
        {
          "$ref": "#/components/schemas/EventWorkspaceFailed"
        },
        {
          "$ref": "#/components/schemas/EventWorkspaceStatus"
        },
        {
          "$ref": "#/components/schemas/EventPtyCreated"
        },
        {
          "$ref": "#/components/schemas/EventPtyUpdated"
        },
        {
          "$ref": "#/components/schemas/EventPtyExited"
        },
        {
          "$ref": "#/components/schemas/EventPtyDeleted"
        },
        {
          "$ref": "#/components/schemas/EventMessageUpdated"
        },
        {
          "$ref": "#/components/schemas/EventMessageRemoved"
        },
        {
          "$ref": "#/components/schemas/EventMessagePartUpdated"
        },
        {
          "$ref": "#/components/schemas/EventMessagePartRemoved"
        },
        {
          "$ref": "#/components/schemas/EventSessionCreated"
        },
        {
          "$ref": "#/components/schemas/EventSessionUpdated"
        },
        {
          "$ref": "#/components/schemas/EventSessionDeleted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextAgentSwitched"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextModelSwitched"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextPrompted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextSynthetic"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextShellStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextShellEnded"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextStepStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextStepEnded"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextStepFailed"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextTextStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextTextDelta"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextTextEnded"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextReasoningStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextReasoningDelta"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextReasoningEnded"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolInputStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolInputDelta"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolInputEnded"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolCalled"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolProgress"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolSuccess"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextToolFailed"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextRetried"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextCompactionStarted"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextCompactionDelta"
        },
        {
          "$ref": "#/components/schemas/EventSessionNextCompactionEnded"
        },
        {
          "$ref": "#/components/schemas/EventServerConnected"
        },
        {
          "$ref": "#/components/schemas/EventGlobalDisposed"
        },
        {
          "$ref": "#/components/schemas/SyncEventMessageUpdated"
        },
        {
          "$ref": "#/components/schemas/SyncEventMessageRemoved"
        },
        {
          "$ref": "#/components/schemas/SyncEventMessagePartUpdated"
        },
        {
          "$ref": "#/components/schemas/SyncEventMessagePartRemoved"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionCreated"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionUpdated"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionDeleted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextAgentSwitched"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextModelSwitched"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextPrompted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextSynthetic"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextShellStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextShellEnded"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextStepStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextStepEnded"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextStepFailed"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextTextStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextTextDelta"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextTextEnded"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextReasoningStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextReasoningDelta"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextReasoningEnded"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolInputStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolInputDelta"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolInputEnded"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolCalled"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolProgress"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolSuccess"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextToolFailed"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextRetried"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextCompactionStarted"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextCompactionDelta"
        },
        {
          "$ref": "#/components/schemas/SyncEventSessionNextCompactionEnded"
        }
      ]
    }
  },
  "required": [
    "directory",
    "payload"
  ],
  "additionalProperties": false
}
```

<a id="schema-globalsession"></a>
### `GlobalSession`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^ses"
    },
    "slug": {
      "type": "string"
    },
    "projectID": {
      "type": "string"
    },
    "workspaceID": {
      "type": "string",
      "pattern": "^wrk"
    },
    "directory": {
      "type": "string"
    },
    "path": {
      "type": "string"
    },
    "parentID": {
      "type": "string",
      "pattern": "^ses"
    },
    "summary": {
      "type": "object",
      "properties": {
        "additions": {
          "type": "number"
        },
        "deletions": {
          "type": "number"
        },
        "files": {
          "type": "number"
        },
        "diffs": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SnapshotFileDiff"
          }
        }
      },
      "required": [
        "additions",
        "deletions",
        "files"
      ],
      "additionalProperties": false
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    },
    "share": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        }
      },
      "required": [
        "url"
      ],
      "additionalProperties": false
    },
    "title": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "providerID"
      ],
      "additionalProperties": false
    },
    "version": {
      "type": "string"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        },
        "updated": {
          "type": "integer",
          "minimum": 0
        },
        "compacting": {
          "type": "integer",
          "minimum": 0
        },
        "archived": {
          "type": "number"
        }
      },
      "required": [
        "created",
        "updated"
      ],
      "additionalProperties": false
    },
    "permission": {
      "$ref": "#/components/schemas/PermissionRuleset"
    },
    "revert": {
      "type": "object",
      "properties": {
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "partID": {
          "type": "string",
          "pattern": "^prt"
        },
        "snapshot": {
          "type": "string"
        },
        "diff": {
          "type": "string"
        }
      },
      "required": [
        "messageID"
      ],
      "additionalProperties": false
    },
    "project": {
      "anyOf": [
        {
          "$ref": "#/components/schemas/ProjectSummary"
        },
        {
          "type": "null"
        }
      ]
    }
  },
  "required": [
    "id",
    "slug",
    "projectID",
    "directory",
    "title",
    "version",
    "time",
    "project"
  ],
  "additionalProperties": false
}
```

<a id="schema-imageattachmentconfig"></a>
### `ImageAttachmentConfig`

```json
{
  "type": "object",
  "properties": {
    "auto_resize": {
      "type": "boolean"
    },
    "max_width": {
      "type": "integer",
      "exclusiveMinimum": 0
    },
    "max_height": {
      "type": "integer",
      "exclusiveMinimum": 0
    },
    "max_base64_bytes": {
      "type": "integer",
      "exclusiveMinimum": 0
    }
  },
  "additionalProperties": false
}
```

<a id="schema-jsonschema"></a>
### `JSONSchema`

```json
{
  "type": "object"
}
```

<a id="schema-layoutconfig"></a>
### `LayoutConfig`

```json
{
  "type": "string",
  "enum": [
    "auto",
    "stretch"
  ],
  "description": "@deprecated Always uses stretch layout."
}
```

<a id="schema-loglevel"></a>
### `LogLevel`

```json
{
  "type": "string",
  "enum": [
    "DEBUG",
    "INFO",
    "WARN",
    "ERROR"
  ],
  "description": "Log level"
}
```

<a id="schema-lspstatus"></a>
### `LSPStatus`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "root": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "connected",
        "error"
      ]
    }
  },
  "required": [
    "id",
    "name",
    "root",
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcplocalconfig"></a>
### `McpLocalConfig`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "local"
      ],
      "description": "Type of MCP server connection"
    },
    "command": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Command and arguments to run the MCP server"
    },
    "environment": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "enabled": {
      "type": "boolean"
    },
    "timeout": {
      "type": "integer",
      "exclusiveMinimum": 0
    }
  },
  "required": [
    "type",
    "command"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpoauthconfig"></a>
### `McpOAuthConfig`

```json
{
  "type": "object",
  "properties": {
    "clientId": {
      "type": "string"
    },
    "clientSecret": {
      "type": "string"
    },
    "scope": {
      "type": "string"
    },
    "redirectUri": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

<a id="schema-mcpremoteconfig"></a>
### `McpRemoteConfig`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "remote"
      ],
      "description": "Type of MCP server connection"
    },
    "url": {
      "type": "string",
      "description": "URL of the remote MCP server"
    },
    "enabled": {
      "type": "boolean"
    },
    "headers": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "oauth": {
      "anyOf": [
        {
          "$ref": "#/components/schemas/McpOAuthConfig"
        },
        {
          "type": "boolean",
          "enum": [
            false
          ]
        }
      ],
      "description": "OAuth authentication configuration for the MCP server. Set to false to disable OAuth auto-detection."
    },
    "timeout": {
      "type": "integer",
      "exclusiveMinimum": 0
    }
  },
  "required": [
    "type",
    "url"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpresource"></a>
### `McpResource`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "uri": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "mimeType": {
      "type": "string"
    },
    "client": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "uri",
    "client"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpstatus"></a>
### `MCPStatus`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/MCPStatusConnected"
    },
    {
      "$ref": "#/components/schemas/MCPStatusDisabled"
    },
    {
      "$ref": "#/components/schemas/MCPStatusFailed"
    },
    {
      "$ref": "#/components/schemas/MCPStatusNeedsAuth"
    },
    {
      "$ref": "#/components/schemas/MCPStatusNeedsClientRegistration"
    }
  ]
}
```

<a id="schema-mcpstatusconnected"></a>
### `MCPStatusConnected`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "connected"
      ]
    }
  },
  "required": [
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpstatusdisabled"></a>
### `MCPStatusDisabled`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "disabled"
      ]
    }
  },
  "required": [
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpstatusfailed"></a>
### `MCPStatusFailed`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "failed"
      ]
    },
    "error": {
      "type": "string"
    }
  },
  "required": [
    "status",
    "error"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpstatusneedsauth"></a>
### `MCPStatusNeedsAuth`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "needs_auth"
      ]
    }
  },
  "required": [
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpstatusneedsclientregistration"></a>
### `MCPStatusNeedsClientRegistration`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "needs_client_registration"
      ]
    },
    "error": {
      "type": "string"
    }
  },
  "required": [
    "status",
    "error"
  ],
  "additionalProperties": false
}
```

<a id="schema-mcpunsupportedoautherror"></a>
### `McpUnsupportedOAuthError`

```json
{
  "type": "object",
  "properties": {
    "error": {
      "type": "string"
    }
  },
  "required": [
    "error"
  ],
  "additionalProperties": false
}
```

<a id="schema-message"></a>
### `Message`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/UserMessage"
    },
    {
      "$ref": "#/components/schemas/AssistantMessage"
    }
  ]
}
```

<a id="schema-messageabortederror"></a>
### `MessageAbortedError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "MessageAbortedError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-messageoutputlengtherror"></a>
### `MessageOutputLengthError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "MessageOutputLengthError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {}
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-model"></a>
### `Model`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "providerID": {
      "type": "string"
    },
    "api": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "npm": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "url",
        "npm"
      ],
      "additionalProperties": false
    },
    "name": {
      "type": "string"
    },
    "family": {
      "type": "string"
    },
    "capabilities": {
      "type": "object",
      "properties": {
        "temperature": {
          "type": "boolean"
        },
        "reasoning": {
          "type": "boolean"
        },
        "attachment": {
          "type": "boolean"
        },
        "toolcall": {
          "type": "boolean"
        },
        "input": {
          "type": "object",
          "properties": {
            "text": {
              "type": "boolean"
            },
            "audio": {
              "type": "boolean"
            },
            "image": {
              "type": "boolean"
            },
            "video": {
              "type": "boolean"
            },
            "pdf": {
              "type": "boolean"
            }
          },
          "required": [
            "text",
            "audio",
            "image",
            "video",
            "pdf"
          ],
          "additionalProperties": false
        },
        "output": {
          "type": "object",
          "properties": {
            "text": {
              "type": "boolean"
            },
            "audio": {
              "type": "boolean"
            },
            "image": {
              "type": "boolean"
            },
            "video": {
              "type": "boolean"
            },
            "pdf": {
              "type": "boolean"
            }
          },
          "required": [
            "text",
            "audio",
            "image",
            "video",
            "pdf"
          ],
          "additionalProperties": false
        },
        "interleaved": {
          "anyOf": [
            {
              "type": "boolean"
            },
            {
              "type": "object",
              "properties": {
                "field": {
                  "type": "string",
                  "enum": [
                    "reasoning_content",
                    "reasoning_details"
                  ]
                }
              },
              "required": [
                "field"
              ],
              "additionalProperties": false
            }
          ]
        }
      },
      "required": [
        "temperature",
        "reasoning",
        "attachment",
        "toolcall",
        "input",
        "output",
        "interleaved"
      ],
      "additionalProperties": false
    },
    "cost": {
      "type": "object",
      "properties": {
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        },
        "tiers": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "input": {
                "type": "number"
              },
              "output": {
                "type": "number"
              },
              "cache": {
                "type": "object",
                "properties": {
                  "read": {
                    "type": "number"
                  },
                  "write": {
                    "type": "number"
                  }
                },
                "required": [
                  "read",
                  "write"
                ],
                "additionalProperties": false
              },
              "tier": {
                "type": "object",
                "properties": {
                  "type": {
                    "type": "string",
                    "enum": [
                      "context"
                    ]
                  },
                  "size": {
                    "type": "number"
                  }
                },
                "required": [
                  "type",
                  "size"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "input",
              "output",
              "cache",
              "tier"
            ],
            "additionalProperties": false
          }
        },
        "experimentalOver200K": {
          "type": "object",
          "properties": {
            "input": {
              "type": "number"
            },
            "output": {
              "type": "number"
            },
            "cache": {
              "type": "object",
              "properties": {
                "read": {
                  "type": "number"
                },
                "write": {
                  "type": "number"
                }
              },
              "required": [
                "read",
                "write"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "input",
            "output",
            "cache"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "cache"
      ],
      "additionalProperties": false
    },
    "limit": {
      "type": "object",
      "properties": {
        "context": {
          "type": "number"
        },
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        }
      },
      "required": [
        "context",
        "output"
      ],
      "additionalProperties": false
    },
    "status": {
      "type": "string",
      "enum": [
        "alpha",
        "beta",
        "deprecated",
        "active"
      ]
    },
    "options": {
      "type": "object"
    },
    "headers": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "release_date": {
      "type": "string"
    },
    "variants": {
      "type": "object",
      "additionalProperties": {
        "type": "object"
      }
    }
  },
  "required": [
    "id",
    "providerID",
    "api",
    "name",
    "capabilities",
    "cost",
    "limit",
    "status",
    "options",
    "headers",
    "release_date"
  ],
  "additionalProperties": false
}
```

<a id="schema-modelv2info"></a>
### `ModelV2Info`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "apiID": {
      "type": "string"
    },
    "providerID": {
      "type": "string"
    },
    "family": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "endpoint": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "unknown"
              ]
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "openai/responses"
              ]
            },
            "url": {
              "type": "string"
            },
            "websocket": {
              "type": "boolean"
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "openai/completions"
              ]
            },
            "url": {
              "type": "string"
            },
            "reasoning": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "reasoning_content"
                      ]
                    }
                  },
                  "required": [
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "reasoning_details"
                      ]
                    }
                  },
                  "required": [
                    "type"
                  ],
                  "additionalProperties": false
                }
              ]
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "anthropic/messages"
              ]
            },
            "url": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "aisdk"
              ]
            },
            "package": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "package"
          ],
          "additionalProperties": false
        }
      ]
    },
    "capabilities": {
      "type": "object",
      "properties": {
        "tools": {
          "type": "boolean"
        },
        "input": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "output": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "tools",
        "input",
        "output"
      ],
      "additionalProperties": false
    },
    "options": {
      "type": "object",
      "properties": {
        "headers": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "body": {
          "type": "object"
        },
        "aisdk": {
          "type": "object",
          "properties": {
            "provider": {
              "type": "object"
            },
            "request": {
              "type": "object"
            }
          },
          "required": [
            "provider",
            "request"
          ],
          "additionalProperties": false
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "headers",
        "body",
        "aisdk"
      ],
      "additionalProperties": false
    },
    "variants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "headers": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          },
          "body": {
            "type": "object"
          },
          "aisdk": {
            "type": "object",
            "properties": {
              "provider": {
                "type": "object"
              },
              "request": {
                "type": "object"
              }
            },
            "required": [
              "provider",
              "request"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "id",
          "headers",
          "body",
          "aisdk"
        ],
        "additionalProperties": false
      }
    },
    "time": {
      "type": "object",
      "properties": {
        "released": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "string",
              "enum": [
                "NaN"
              ]
            },
            {
              "type": "string",
              "enum": [
                "Infinity"
              ]
            },
            {
              "type": "string",
              "enum": [
                "-Infinity"
              ]
            },
            {
              "type": "string",
              "enum": [
                "Infinity",
                "-Infinity",
                "NaN"
              ]
            }
          ]
        }
      },
      "required": [
        "released"
      ],
      "additionalProperties": false
    },
    "cost": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tier": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "context"
                ]
              },
              "size": {
                "type": "integer"
              }
            },
            "required": [
              "type",
              "size"
            ],
            "additionalProperties": false
          },
          "input": {
            "type": "number"
          },
          "output": {
            "type": "number"
          },
          "cache": {
            "type": "object",
            "properties": {
              "read": {
                "type": "number"
              },
              "write": {
                "type": "number"
              }
            },
            "required": [
              "read",
              "write"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "input",
          "output",
          "cache"
        ],
        "additionalProperties": false
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "alpha",
        "beta",
        "deprecated",
        "active"
      ]
    },
    "enabled": {
      "type": "boolean"
    },
    "limit": {
      "type": "object",
      "properties": {
        "context": {
          "type": "integer"
        },
        "input": {
          "type": "integer"
        },
        "output": {
          "type": "integer"
        }
      },
      "required": [
        "context",
        "output"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "apiID",
    "providerID",
    "name",
    "endpoint",
    "capabilities",
    "options",
    "variants",
    "time",
    "cost",
    "status",
    "enabled",
    "limit"
  ],
  "additionalProperties": false
}
```

<a id="schema-notfounderror"></a>
### `NotFoundError`

```json
{
  "type": "object",
  "required": [
    "name",
    "data"
  ],
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "NotFoundError"
      ]
    },
    "data": {
      "type": "object",
      "required": [
        "message"
      ],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}
```

<a id="schema-oauth"></a>
### `OAuth`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "oauth"
      ]
    },
    "refresh": {
      "type": "string"
    },
    "access": {
      "type": "string"
    },
    "expires": {
      "type": "integer",
      "minimum": 0
    },
    "accountId": {
      "type": "string"
    },
    "enterpriseUrl": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "refresh",
    "access",
    "expires"
  ],
  "additionalProperties": false
}
```

<a id="schema-outputformat"></a>
### `OutputFormat`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/OutputFormatText"
    },
    {
      "$ref": "#/components/schemas/OutputFormatJsonSchema"
    }
  ]
}
```

<a id="schema-outputformatjsonschema"></a>
### `OutputFormatJsonSchema`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "json_schema"
      ]
    },
    "schema": {
      "$ref": "#/components/schemas/JSONSchema"
    },
    "retryCount": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "type",
    "schema"
  ],
  "additionalProperties": false
}
```

<a id="schema-outputformattext"></a>
### `OutputFormatText`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "text"
      ]
    }
  },
  "required": [
    "type"
  ],
  "additionalProperties": false
}
```

<a id="schema-part"></a>
### `Part`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/TextPart"
    },
    {
      "$ref": "#/components/schemas/SubtaskPart"
    },
    {
      "$ref": "#/components/schemas/ReasoningPart"
    },
    {
      "$ref": "#/components/schemas/FilePart"
    },
    {
      "$ref": "#/components/schemas/ToolPart"
    },
    {
      "$ref": "#/components/schemas/StepStartPart"
    },
    {
      "$ref": "#/components/schemas/StepFinishPart"
    },
    {
      "$ref": "#/components/schemas/SnapshotPart"
    },
    {
      "$ref": "#/components/schemas/PatchPart"
    },
    {
      "$ref": "#/components/schemas/AgentPart"
    },
    {
      "$ref": "#/components/schemas/RetryPart"
    },
    {
      "$ref": "#/components/schemas/CompactionPart"
    }
  ]
}
```

<a id="schema-patchpart"></a>
### `PatchPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "patch"
      ]
    },
    "hash": {
      "type": "string"
    },
    "files": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "hash",
    "files"
  ],
  "additionalProperties": false
}
```

<a id="schema-path"></a>
### `Path`

```json
{
  "type": "object",
  "properties": {
    "home": {
      "type": "string"
    },
    "state": {
      "type": "string"
    },
    "config": {
      "type": "string"
    },
    "worktree": {
      "type": "string"
    },
    "directory": {
      "type": "string"
    }
  },
  "required": [
    "home",
    "state",
    "config",
    "worktree",
    "directory"
  ],
  "additionalProperties": false
}
```

<a id="schema-permissionaction"></a>
### `PermissionAction`

```json
{
  "type": "string",
  "enum": [
    "allow",
    "deny",
    "ask"
  ]
}
```

<a id="schema-permissionactionconfig"></a>
### `PermissionActionConfig`

```json
{
  "type": "string",
  "enum": [
    "ask",
    "allow",
    "deny"
  ]
}
```

<a id="schema-permissionconfig"></a>
### `PermissionConfig`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/PermissionActionConfig"
    },
    {
      "type": "object",
      "properties": {
        "read": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "edit": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "glob": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "grep": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "list": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "bash": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "task": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "external_directory": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "todowrite": {
          "$ref": "#/components/schemas/PermissionActionConfig"
        },
        "question": {
          "$ref": "#/components/schemas/PermissionActionConfig"
        },
        "webfetch": {
          "$ref": "#/components/schemas/PermissionActionConfig"
        },
        "websearch": {
          "$ref": "#/components/schemas/PermissionActionConfig"
        },
        "repo_clone": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "repo_overview": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "lsp": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        },
        "doom_loop": {
          "$ref": "#/components/schemas/PermissionActionConfig"
        },
        "skill": {
          "$ref": "#/components/schemas/PermissionRuleConfig"
        }
      },
      "additionalProperties": {
        "$ref": "#/components/schemas/PermissionRuleConfig"
      }
    }
  ]
}
```

<a id="schema-permissionobjectconfig"></a>
### `PermissionObjectConfig`

```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/components/schemas/PermissionActionConfig"
  }
}
```

<a id="schema-permissionrequest"></a>
### `PermissionRequest`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^per"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "permission": {
      "type": "string"
    },
    "patterns": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "metadata": {
      "type": "object"
    },
    "always": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "tool": {
      "type": "object",
      "properties": {
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "callID": {
          "type": "string"
        }
      },
      "required": [
        "messageID",
        "callID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "sessionID",
    "permission",
    "patterns",
    "metadata",
    "always"
  ],
  "additionalProperties": false
}
```

<a id="schema-permissionrule"></a>
### `PermissionRule`

```json
{
  "type": "object",
  "properties": {
    "permission": {
      "type": "string"
    },
    "pattern": {
      "type": "string"
    },
    "action": {
      "$ref": "#/components/schemas/PermissionAction"
    }
  },
  "required": [
    "permission",
    "pattern",
    "action"
  ],
  "additionalProperties": false
}
```

<a id="schema-permissionruleconfig"></a>
### `PermissionRuleConfig`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/PermissionActionConfig"
    },
    {
      "$ref": "#/components/schemas/PermissionObjectConfig"
    }
  ]
}
```

<a id="schema-permissionruleset"></a>
### `PermissionRuleset`

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/PermissionRule"
  }
}
```

<a id="schema-project"></a>
### `Project`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "worktree": {
      "type": "string"
    },
    "vcs": {
      "type": "string",
      "enum": [
        "git"
      ]
    },
    "name": {
      "type": "string"
    },
    "icon": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        },
        "override": {
          "type": "string"
        },
        "color": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "commands": {
      "type": "object",
      "properties": {
        "start": {
          "type": "string",
          "description": "Startup script to run when creating a new workspace (worktree)"
        }
      },
      "additionalProperties": false
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        },
        "updated": {
          "type": "integer",
          "minimum": 0
        },
        "initialized": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "created",
        "updated"
      ],
      "additionalProperties": false
    },
    "sandboxes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "id",
    "worktree",
    "time",
    "sandboxes"
  ],
  "additionalProperties": false
}
```

<a id="schema-projectsummary"></a>
### `ProjectSummary`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "worktree": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "worktree"
  ],
  "additionalProperties": false
}
```

<a id="schema-prompt"></a>
### `Prompt`

```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string"
    },
    "files": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptFileAttachment"
      }
    },
    "agents": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptAgentAttachment"
      }
    },
    "references": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptReferenceAttachment"
      }
    }
  },
  "required": [
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-promptagentattachment"></a>
### `PromptAgentAttachment`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "source": {
      "$ref": "#/components/schemas/PromptSource"
    }
  },
  "required": [
    "name"
  ],
  "additionalProperties": false
}
```

<a id="schema-promptfileattachment"></a>
### `PromptFileAttachment`

```json
{
  "type": "object",
  "properties": {
    "uri": {
      "type": "string"
    },
    "mime": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "source": {
      "$ref": "#/components/schemas/PromptSource"
    }
  },
  "required": [
    "uri",
    "mime"
  ],
  "additionalProperties": false
}
```

<a id="schema-promptreferenceattachment"></a>
### `PromptReferenceAttachment`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "kind": {
      "type": "string",
      "enum": [
        "local",
        "git",
        "invalid"
      ]
    },
    "uri": {
      "type": "string"
    },
    "repository": {
      "type": "string"
    },
    "branch": {
      "type": "string"
    },
    "target": {
      "type": "string"
    },
    "targetUri": {
      "type": "string"
    },
    "problem": {
      "type": "string"
    },
    "source": {
      "$ref": "#/components/schemas/PromptSource"
    }
  },
  "required": [
    "name",
    "kind"
  ],
  "additionalProperties": false
}
```

<a id="schema-promptsource"></a>
### `PromptSource`

```json
{
  "type": "object",
  "properties": {
    "start": {
      "type": "number"
    },
    "end": {
      "type": "number"
    },
    "text": {
      "type": "string"
    }
  },
  "required": [
    "start",
    "end",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-provider"></a>
### `Provider`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "source": {
      "type": "string",
      "enum": [
        "env",
        "config",
        "custom",
        "api"
      ]
    },
    "env": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "key": {
      "type": "string"
    },
    "options": {
      "type": "object"
    },
    "models": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/components/schemas/Model"
      }
    }
  },
  "required": [
    "id",
    "name",
    "source",
    "env",
    "options",
    "models"
  ],
  "additionalProperties": false
}
```

<a id="schema-providerauthauthorization"></a>
### `ProviderAuthAuthorization`

```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string"
    },
    "method": {
      "type": "string",
      "enum": [
        "auto",
        "code"
      ]
    },
    "instructions": {
      "type": "string"
    }
  },
  "required": [
    "url",
    "method",
    "instructions"
  ],
  "additionalProperties": false
}
```

<a id="schema-providerautherror"></a>
### `ProviderAuthError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "ProviderAuthError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "providerID": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      },
      "required": [
        "providerID",
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-providerautherror1"></a>
### `ProviderAuthError1`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "BadRequest",
        "ProviderAuthOauthMissing",
        "ProviderAuthOauthCodeMissing",
        "ProviderAuthOauthCallbackFailed",
        "ProviderAuthValidationFailed"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "providerID": {
          "type": "string"
        },
        "field": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "kind": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-providerauthmethod"></a>
### `ProviderAuthMethod`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "oauth",
        "api"
      ]
    },
    "label": {
      "type": "string"
    },
    "prompts": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "text"
                ]
              },
              "key": {
                "type": "string"
              },
              "message": {
                "type": "string"
              },
              "placeholder": {
                "type": "string"
              },
              "when": {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string"
                  },
                  "op": {
                    "type": "string",
                    "enum": [
                      "eq",
                      "neq"
                    ]
                  },
                  "value": {
                    "type": "string"
                  }
                },
                "required": [
                  "key",
                  "op",
                  "value"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "type",
              "key",
              "message"
            ],
            "additionalProperties": false
          },
          {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": [
                  "select"
                ]
              },
              "key": {
                "type": "string"
              },
              "message": {
                "type": "string"
              },
              "options": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "label": {
                      "type": "string"
                    },
                    "value": {
                      "type": "string"
                    },
                    "hint": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "label",
                    "value"
                  ],
                  "additionalProperties": false
                }
              },
              "when": {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "string"
                  },
                  "op": {
                    "type": "string",
                    "enum": [
                      "eq",
                      "neq"
                    ]
                  },
                  "value": {
                    "type": "string"
                  }
                },
                "required": [
                  "key",
                  "op",
                  "value"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "type",
              "key",
              "message",
              "options"
            ],
            "additionalProperties": false
          }
        ]
      }
    }
  },
  "required": [
    "type",
    "label"
  ],
  "additionalProperties": false
}
```

<a id="schema-providerconfig"></a>
### `ProviderConfig`

```json
{
  "type": "object",
  "properties": {
    "api": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "env": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "id": {
      "type": "string"
    },
    "npm": {
      "type": "string"
    },
    "whitelist": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "blacklist": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "options": {
      "type": "object",
      "properties": {
        "apiKey": {
          "type": "string"
        },
        "baseURL": {
          "type": "string"
        },
        "enterpriseUrl": {
          "type": "string"
        },
        "setCacheKey": {
          "type": "boolean"
        },
        "timeout": {
          "anyOf": [
            {
              "type": "integer",
              "exclusiveMinimum": 0
            },
            {
              "type": "boolean",
              "enum": [
                false
              ]
            }
          ],
          "description": "Timeout in milliseconds for requests to this provider. Default is 300000 (5 minutes). Set to false to disable timeout."
        },
        "chunkTimeout": {
          "type": "integer",
          "exclusiveMinimum": 0
        }
      },
      "additionalProperties": {}
    },
    "models": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "family": {
            "type": "string"
          },
          "release_date": {
            "type": "string"
          },
          "attachment": {
            "type": "boolean"
          },
          "reasoning": {
            "type": "boolean"
          },
          "temperature": {
            "type": "boolean"
          },
          "tool_call": {
            "type": "boolean"
          },
          "interleaved": {
            "anyOf": [
              {
                "type": "boolean",
                "enum": [
                  true
                ]
              },
              {
                "type": "object",
                "properties": {
                  "field": {
                    "type": "string",
                    "enum": [
                      "reasoning_content",
                      "reasoning_details"
                    ]
                  }
                },
                "required": [
                  "field"
                ],
                "additionalProperties": false
              }
            ]
          },
          "cost": {
            "type": "object",
            "properties": {
              "input": {
                "type": "number"
              },
              "output": {
                "type": "number"
              },
              "cache_read": {
                "type": "number"
              },
              "cache_write": {
                "type": "number"
              },
              "context_over_200k": {
                "type": "object",
                "properties": {
                  "input": {
                    "type": "number"
                  },
                  "output": {
                    "type": "number"
                  },
                  "cache_read": {
                    "type": "number"
                  },
                  "cache_write": {
                    "type": "number"
                  }
                },
                "required": [
                  "input",
                  "output"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "input",
              "output"
            ],
            "additionalProperties": false
          },
          "limit": {
            "type": "object",
            "properties": {
              "context": {
                "type": "number"
              },
              "input": {
                "type": "number"
              },
              "output": {
                "type": "number"
              }
            },
            "required": [
              "context",
              "output"
            ],
            "additionalProperties": false
          },
          "modalities": {
            "type": "object",
            "properties": {
              "input": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": [
                    "text",
                    "audio",
                    "image",
                    "video",
                    "pdf"
                  ]
                }
              },
              "output": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": [
                    "text",
                    "audio",
                    "image",
                    "video",
                    "pdf"
                  ]
                }
              }
            },
            "required": [
              "input",
              "output"
            ],
            "additionalProperties": false
          },
          "experimental": {
            "type": "boolean"
          },
          "status": {
            "type": "string",
            "enum": [
              "alpha",
              "beta",
              "deprecated",
              "active"
            ]
          },
          "provider": {
            "type": "object",
            "properties": {
              "npm": {
                "type": "string"
              },
              "api": {
                "type": "string"
              }
            },
            "additionalProperties": false
          },
          "options": {
            "type": "object"
          },
          "headers": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          },
          "variants": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "properties": {
                "disabled": {
                  "type": "boolean"
                }
              },
              "additionalProperties": {}
            },
            "description": "Variant-specific configuration"
          }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}
```

<a id="schema-providerv2info"></a>
### `ProviderV2Info`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "enabled": {
      "anyOf": [
        {
          "type": "boolean",
          "enum": [
            false
          ]
        },
        {
          "type": "object",
          "properties": {
            "via": {
              "type": "string",
              "enum": [
                "env"
              ]
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "via",
            "name"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "via": {
              "type": "string",
              "enum": [
                "auth"
              ]
            },
            "service": {
              "type": "string"
            }
          },
          "required": [
            "via",
            "service"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "via": {
              "type": "string",
              "enum": [
                "custom"
              ]
            },
            "data": {
              "type": "object"
            }
          },
          "required": [
            "via",
            "data"
          ],
          "additionalProperties": false
        }
      ]
    },
    "env": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "endpoint": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "unknown"
              ]
            }
          },
          "required": [
            "type"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "openai/responses"
              ]
            },
            "url": {
              "type": "string"
            },
            "websocket": {
              "type": "boolean"
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "openai/completions"
              ]
            },
            "url": {
              "type": "string"
            },
            "reasoning": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "reasoning_content"
                      ]
                    }
                  },
                  "required": [
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "reasoning_details"
                      ]
                    }
                  },
                  "required": [
                    "type"
                  ],
                  "additionalProperties": false
                }
              ]
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "anthropic/messages"
              ]
            },
            "url": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "url"
          ],
          "additionalProperties": false
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "aisdk"
              ]
            },
            "package": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "required": [
            "type",
            "package"
          ],
          "additionalProperties": false
        }
      ]
    },
    "options": {
      "type": "object",
      "properties": {
        "headers": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "body": {
          "type": "object"
        },
        "aisdk": {
          "type": "object",
          "properties": {
            "provider": {
              "type": "object"
            },
            "request": {
              "type": "object"
            }
          },
          "required": [
            "provider",
            "request"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "headers",
        "body",
        "aisdk"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "name",
    "enabled",
    "env",
    "endpoint",
    "options"
  ],
  "additionalProperties": false
}
```

<a id="schema-pty"></a>
### `Pty`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^pty"
    },
    "title": {
      "type": "string"
    },
    "command": {
      "type": "string"
    },
    "args": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cwd": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "running",
        "exited"
      ]
    },
    "pid": {
      "type": "integer",
      "exclusiveMinimum": 0
    }
  },
  "required": [
    "id",
    "title",
    "command",
    "args",
    "cwd",
    "status",
    "pid"
  ],
  "additionalProperties": false
}
```

<a id="schema-questionanswer"></a>
### `QuestionAnswer`

```json
{
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

<a id="schema-questioninfo"></a>
### `QuestionInfo`

```json
{
  "type": "object",
  "properties": {
    "question": {
      "type": "string",
      "description": "Complete question"
    },
    "header": {
      "type": "string",
      "description": "Very short label (max 30 chars)"
    },
    "options": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/QuestionOption"
      },
      "description": "Available choices"
    },
    "multiple": {
      "type": "boolean"
    },
    "custom": {
      "type": "boolean"
    }
  },
  "required": [
    "question",
    "header",
    "options"
  ],
  "additionalProperties": false
}
```

<a id="schema-questionoption"></a>
### `QuestionOption`

```json
{
  "type": "object",
  "properties": {
    "label": {
      "type": "string",
      "description": "Display text (1-5 words, concise)"
    },
    "description": {
      "type": "string",
      "description": "Explanation of choice"
    }
  },
  "required": [
    "label",
    "description"
  ],
  "additionalProperties": false
}
```

<a id="schema-questionrejected"></a>
### `QuestionRejected`

```json
{
  "type": "object",
  "properties": {
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "requestID": {
      "type": "string",
      "pattern": "^que"
    }
  },
  "required": [
    "sessionID",
    "requestID"
  ],
  "additionalProperties": false
}
```

<a id="schema-questionreplied"></a>
### `QuestionReplied`

```json
{
  "type": "object",
  "properties": {
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "requestID": {
      "type": "string",
      "pattern": "^que"
    },
    "answers": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/QuestionAnswer"
      }
    }
  },
  "required": [
    "sessionID",
    "requestID",
    "answers"
  ],
  "additionalProperties": false
}
```

<a id="schema-questionrequest"></a>
### `QuestionRequest`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^que"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "questions": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/QuestionInfo"
      },
      "description": "Questions to ask"
    },
    "tool": {
      "$ref": "#/components/schemas/QuestionTool"
    }
  },
  "required": [
    "id",
    "sessionID",
    "questions"
  ],
  "additionalProperties": false
}
```

<a id="schema-questiontool"></a>
### `QuestionTool`

```json
{
  "type": "object",
  "properties": {
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "callID": {
      "type": "string"
    }
  },
  "required": [
    "messageID",
    "callID"
  ],
  "additionalProperties": false
}
```

<a id="schema-range"></a>
### `Range`

```json
{
  "type": "object",
  "properties": {
    "start": {
      "type": "object",
      "properties": {
        "line": {
          "type": "integer",
          "minimum": 0
        },
        "character": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "line",
        "character"
      ],
      "additionalProperties": false
    },
    "end": {
      "type": "object",
      "properties": {
        "line": {
          "type": "integer",
          "minimum": 0
        },
        "character": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "line",
        "character"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "start",
    "end"
  ],
  "additionalProperties": false
}
```

<a id="schema-reasoningpart"></a>
### `ReasoningPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "reasoning"
      ]
    },
    "text": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "text",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-referenceconfig"></a>
### `ReferenceConfig`

```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/components/schemas/ReferenceConfigEntry"
  }
}
```

<a id="schema-referenceconfigentry"></a>
### `ReferenceConfigEntry`

```json
{
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "properties": {
        "repository": {
          "type": "string",
          "description": "Git repository URL, host/path reference, or GitHub owner/repo shorthand"
        },
        "branch": {
          "type": "string"
        }
      },
      "required": [
        "repository"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "path": {
          "type": "string",
          "description": "Absolute path, ~/ path, or workspace-relative path to a local reference directory"
        }
      },
      "required": [
        "path"
      ],
      "additionalProperties": false
    }
  ]
}
```

<a id="schema-resourcesource"></a>
### `ResourceSource`

```json
{
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/components/schemas/FilePartSourceText"
    },
    "type": {
      "type": "string",
      "enum": [
        "resource"
      ]
    },
    "clientName": {
      "type": "string"
    },
    "uri": {
      "type": "string"
    }
  },
  "required": [
    "text",
    "type",
    "clientName",
    "uri"
  ],
  "additionalProperties": false
}
```

<a id="schema-retrypart"></a>
### `RetryPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "retry"
      ]
    },
    "attempt": {
      "type": "integer",
      "minimum": 0
    },
    "error": {
      "$ref": "#/components/schemas/APIError"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "attempt",
    "error",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-serverconfig"></a>
### `ServerConfig`

```json
{
  "type": "object",
  "properties": {
    "port": {
      "type": "integer",
      "exclusiveMinimum": 0
    },
    "hostname": {
      "type": "string"
    },
    "mdns": {
      "type": "boolean"
    },
    "mdnsDomain": {
      "type": "string"
    },
    "cors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "description": "Server configuration for opencode serve and web commands"
}
```

<a id="schema-session"></a>
### `Session`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^ses"
    },
    "slug": {
      "type": "string"
    },
    "projectID": {
      "type": "string"
    },
    "workspaceID": {
      "type": "string",
      "pattern": "^wrk"
    },
    "directory": {
      "type": "string"
    },
    "path": {
      "type": "string"
    },
    "parentID": {
      "type": "string",
      "pattern": "^ses"
    },
    "summary": {
      "type": "object",
      "properties": {
        "additions": {
          "type": "number"
        },
        "deletions": {
          "type": "number"
        },
        "files": {
          "type": "number"
        },
        "diffs": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SnapshotFileDiff"
          }
        }
      },
      "required": [
        "additions",
        "deletions",
        "files"
      ],
      "additionalProperties": false
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    },
    "share": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        }
      },
      "required": [
        "url"
      ],
      "additionalProperties": false
    },
    "title": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "providerID"
      ],
      "additionalProperties": false
    },
    "version": {
      "type": "string"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        },
        "updated": {
          "type": "integer",
          "minimum": 0
        },
        "compacting": {
          "type": "integer",
          "minimum": 0
        },
        "archived": {
          "type": "number"
        }
      },
      "required": [
        "created",
        "updated"
      ],
      "additionalProperties": false
    },
    "permission": {
      "$ref": "#/components/schemas/PermissionRuleset"
    },
    "revert": {
      "type": "object",
      "properties": {
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "partID": {
          "type": "string",
          "pattern": "^prt"
        },
        "snapshot": {
          "type": "string"
        },
        "diff": {
          "type": "string"
        }
      },
      "required": [
        "messageID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "slug",
    "projectID",
    "directory",
    "title",
    "version",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessiondelivery"></a>
### `SessionDelivery`

```json
{
  "type": "string",
  "enum": [
    "immediate",
    "deferred"
  ]
}
```

<a id="schema-sessionerrorunknown"></a>
### `SessionErrorUnknown`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "unknown"
      ]
    },
    "message": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "message"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessioninfo"></a>
### `SessionInfo`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^ses"
    },
    "parentID": {
      "type": "string",
      "pattern": "^ses"
    },
    "projectID": {
      "type": "string"
    },
    "workspaceID": {
      "type": "string",
      "pattern": "^wrk"
    },
    "path": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "providerID",
        "variant"
      ],
      "additionalProperties": false
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        },
        "updated": {
          "type": "number"
        },
        "archived": {
          "type": "number"
        }
      },
      "required": [
        "created",
        "updated"
      ],
      "additionalProperties": false
    },
    "title": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "projectID",
    "cost",
    "tokens",
    "time",
    "title"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessage"></a>
### `SessionMessage`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/SessionMessageAgentSwitched"
    },
    {
      "$ref": "#/components/schemas/SessionMessageModelSwitched"
    },
    {
      "$ref": "#/components/schemas/SessionMessageUser"
    },
    {
      "$ref": "#/components/schemas/SessionMessageSynthetic"
    },
    {
      "$ref": "#/components/schemas/SessionMessageShell"
    },
    {
      "$ref": "#/components/schemas/SessionMessageAssistant"
    },
    {
      "$ref": "#/components/schemas/SessionMessageCompaction"
    }
  ]
}
```

<a id="schema-sessionmessageagentswitched"></a>
### `SessionMessageAgentSwitched`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "type": {
      "type": "string",
      "enum": [
        "agent-switched"
      ]
    },
    "agent": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "time",
    "type",
    "agent"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageassistant"></a>
### `SessionMessageAssistant`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        },
        "completed": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "type": {
      "type": "string",
      "enum": [
        "assistant"
      ]
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "providerID",
        "variant"
      ],
      "additionalProperties": false
    },
    "content": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/SessionMessageAssistantText"
          },
          {
            "$ref": "#/components/schemas/SessionMessageAssistantReasoning"
          },
          {
            "$ref": "#/components/schemas/SessionMessageAssistantTool"
          }
        ]
      }
    },
    "snapshot": {
      "type": "object",
      "properties": {
        "start": {
          "type": "string"
        },
        "end": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "finish": {
      "type": "string"
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    },
    "error": {
      "$ref": "#/components/schemas/SessionErrorUnknown"
    }
  },
  "required": [
    "id",
    "time",
    "type",
    "agent",
    "model",
    "content"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageassistantreasoning"></a>
### `SessionMessageAssistantReasoning`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "reasoning"
      ]
    },
    "id": {
      "type": "string"
    },
    "text": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "id",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageassistanttext"></a>
### `SessionMessageAssistantText`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "text"
      ]
    },
    "text": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageassistanttool"></a>
### `SessionMessageAssistantTool`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "tool"
      ]
    },
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "provider": {
      "type": "object",
      "properties": {
        "executed": {
          "type": "boolean"
        },
        "metadata": {
          "type": "object"
        }
      },
      "required": [
        "executed"
      ],
      "additionalProperties": false
    },
    "state": {
      "anyOf": [
        {
          "$ref": "#/components/schemas/SessionMessageToolStatePending"
        },
        {
          "$ref": "#/components/schemas/SessionMessageToolStateRunning"
        },
        {
          "$ref": "#/components/schemas/SessionMessageToolStateCompleted"
        },
        {
          "$ref": "#/components/schemas/SessionMessageToolStateError"
        }
      ]
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        },
        "ran": {
          "type": "number"
        },
        "completed": {
          "type": "number"
        },
        "pruned": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "id",
    "name",
    "state",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagecompaction"></a>
### `SessionMessageCompaction`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "compaction"
      ]
    },
    "reason": {
      "type": "string",
      "enum": [
        "auto",
        "manual"
      ]
    },
    "summary": {
      "type": "string"
    },
    "include": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "reason",
    "summary",
    "id",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagemodelswitched"></a>
### `SessionMessageModelSwitched`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "type": {
      "type": "string",
      "enum": [
        "model-switched"
      ]
    },
    "model": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "providerID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "providerID",
        "variant"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "time",
    "type",
    "model"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageshell"></a>
### `SessionMessageShell`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        },
        "completed": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "type": {
      "type": "string",
      "enum": [
        "shell"
      ]
    },
    "callID": {
      "type": "string"
    },
    "command": {
      "type": "string"
    },
    "output": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "time",
    "type",
    "callID",
    "command",
    "output"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagesynthetic"></a>
### `SessionMessageSynthetic`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "text": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "synthetic"
      ]
    }
  },
  "required": [
    "id",
    "time",
    "sessionID",
    "text",
    "type"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagetoolstatecompleted"></a>
### `SessionMessageToolStateCompleted`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "completed"
      ]
    },
    "input": {
      "type": "object"
    },
    "attachments": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptFileAttachment"
      }
    },
    "content": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/ToolTextContent"
          },
          {
            "$ref": "#/components/schemas/ToolFileContent"
          }
        ]
      }
    },
    "structured": {
      "type": "object"
    }
  },
  "required": [
    "status",
    "input",
    "content",
    "structured"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagetoolstateerror"></a>
### `SessionMessageToolStateError`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "error"
      ]
    },
    "input": {
      "type": "object"
    },
    "content": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/ToolTextContent"
          },
          {
            "$ref": "#/components/schemas/ToolFileContent"
          }
        ]
      }
    },
    "structured": {
      "type": "object"
    },
    "error": {
      "$ref": "#/components/schemas/SessionErrorUnknown"
    }
  },
  "required": [
    "status",
    "input",
    "content",
    "structured",
    "error"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagetoolstatepending"></a>
### `SessionMessageToolStatePending`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "pending"
      ]
    },
    "input": {
      "type": "string"
    }
  },
  "required": [
    "status",
    "input"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessagetoolstaterunning"></a>
### `SessionMessageToolStateRunning`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "running"
      ]
    },
    "input": {
      "type": "object"
    },
    "structured": {
      "type": "object"
    },
    "content": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/components/schemas/ToolTextContent"
          },
          {
            "$ref": "#/components/schemas/ToolFileContent"
          }
        ]
      }
    }
  },
  "required": [
    "status",
    "input",
    "structured",
    "content"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionmessageuser"></a>
### `SessionMessageUser`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "text": {
      "type": "string"
    },
    "files": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptFileAttachment"
      }
    },
    "agents": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptAgentAttachment"
      }
    },
    "references": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/PromptReferenceAttachment"
      }
    },
    "type": {
      "type": "string",
      "enum": [
        "user"
      ]
    }
  },
  "required": [
    "id",
    "time",
    "text",
    "type"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionnextretry-error"></a>
### `SessionNextRetry_error`

```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string"
    },
    "statusCode": {
      "type": "number"
    },
    "isRetryable": {
      "type": "boolean"
    },
    "responseHeaders": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    },
    "responseBody": {
      "type": "string"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      }
    }
  },
  "required": [
    "message",
    "isRetryable"
  ],
  "additionalProperties": false
}
```

<a id="schema-sessionstatus"></a>
### `SessionStatus`

```json
{
  "anyOf": [
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "idle"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "retry"
          ]
        },
        "attempt": {
          "type": "integer",
          "minimum": 0
        },
        "message": {
          "type": "string"
        },
        "action": {
          "type": "object",
          "properties": {
            "reason": {
              "type": "string"
            },
            "provider": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "message": {
              "type": "string"
            },
            "label": {
              "type": "string"
            },
            "link": {
              "type": "string"
            }
          },
          "required": [
            "reason",
            "provider",
            "title",
            "message",
            "label"
          ],
          "additionalProperties": false
        },
        "next": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "type",
        "attempt",
        "message",
        "next"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "busy"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": false
    }
  ]
}
```

<a id="schema-snapshotfilediff"></a>
### `SnapshotFileDiff`

```json
{
  "type": "object",
  "properties": {
    "file": {
      "type": "string"
    },
    "patch": {
      "type": "string"
    },
    "additions": {
      "type": "number"
    },
    "deletions": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "added",
        "deleted",
        "modified"
      ]
    }
  },
  "required": [
    "additions",
    "deletions"
  ],
  "additionalProperties": false
}
```

<a id="schema-snapshotpart"></a>
### `SnapshotPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "snapshot"
      ]
    },
    "snapshot": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "snapshot"
  ],
  "additionalProperties": false
}
```

<a id="schema-stepfinishpart"></a>
### `StepFinishPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "step-finish"
      ]
    },
    "reason": {
      "type": "string"
    },
    "snapshot": {
      "type": "string"
    },
    "cost": {
      "type": "number"
    },
    "tokens": {
      "type": "object",
      "properties": {
        "total": {
          "type": "number"
        },
        "input": {
          "type": "number"
        },
        "output": {
          "type": "number"
        },
        "reasoning": {
          "type": "number"
        },
        "cache": {
          "type": "object",
          "properties": {
            "read": {
              "type": "number"
            },
            "write": {
              "type": "number"
            }
          },
          "required": [
            "read",
            "write"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "input",
        "output",
        "reasoning",
        "cache"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "reason",
    "cost",
    "tokens"
  ],
  "additionalProperties": false
}
```

<a id="schema-stepstartpart"></a>
### `StepStartPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "step-start"
      ]
    },
    "snapshot": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type"
  ],
  "additionalProperties": false
}
```

<a id="schema-structuredoutputerror"></a>
### `StructuredOutputError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "StructuredOutputError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "retries": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "message",
        "retries"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-subtaskpart"></a>
### `SubtaskPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "subtask"
      ]
    },
    "prompt": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "providerID": {
          "type": "string"
        },
        "modelID": {
          "type": "string"
        }
      },
      "required": [
        "providerID",
        "modelID"
      ],
      "additionalProperties": false
    },
    "command": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "prompt",
    "description",
    "agent"
  ],
  "additionalProperties": false
}
```

<a id="schema-subtaskpartinput"></a>
### `SubtaskPartInput`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "type": {
      "type": "string",
      "enum": [
        "subtask"
      ]
    },
    "prompt": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "providerID": {
          "type": "string"
        },
        "modelID": {
          "type": "string"
        }
      },
      "required": [
        "providerID",
        "modelID"
      ],
      "additionalProperties": false
    },
    "command": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "prompt",
    "description",
    "agent"
  ],
  "additionalProperties": false
}
```

<a id="schema-symbol"></a>
### `Symbol`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "kind": {
      "type": "integer",
      "minimum": 0
    },
    "location": {
      "type": "object",
      "properties": {
        "uri": {
          "type": "string"
        },
        "range": {
          "$ref": "#/components/schemas/Range"
        }
      },
      "required": [
        "uri",
        "range"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "kind",
    "location"
  ],
  "additionalProperties": false
}
```

<a id="schema-symbolsource"></a>
### `SymbolSource`

```json
{
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/components/schemas/FilePartSourceText"
    },
    "type": {
      "type": "string",
      "enum": [
        "symbol"
      ]
    },
    "path": {
      "type": "string"
    },
    "range": {
      "$ref": "#/components/schemas/Range"
    },
    "name": {
      "type": "string"
    },
    "kind": {
      "type": "integer",
      "minimum": 0
    }
  },
  "required": [
    "text",
    "type",
    "path",
    "range",
    "name",
    "kind"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventmessagepartremoved"></a>
### `SyncEventMessagePartRemoved`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "message.part.removed.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        },
        "partID": {
          "type": "string",
          "pattern": "^prt"
        }
      },
      "required": [
        "sessionID",
        "messageID",
        "partID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventmessagepartupdated"></a>
### `SyncEventMessagePartUpdated`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "message.part.updated.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "part": {
          "$ref": "#/components/schemas/Part"
        },
        "time": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "sessionID",
        "part",
        "time"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventmessageremoved"></a>
### `SyncEventMessageRemoved`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "message.removed.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "messageID": {
          "type": "string",
          "pattern": "^msg"
        }
      },
      "required": [
        "sessionID",
        "messageID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventmessageupdated"></a>
### `SyncEventMessageUpdated`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "message.updated.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Message"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessioncreated"></a>
### `SyncEventSessionCreated`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.created.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Session"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessiondeleted"></a>
### `SyncEventSessionDeleted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.deleted.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "$ref": "#/components/schemas/Session"
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextagentswitched"></a>
### `SyncEventSessionNextAgentSwitched`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.agent.switched.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "agent": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "agent"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextcompactiondelta"></a>
### `SyncEventSessionNextCompactionDelta`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.compaction.delta.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextcompactionended"></a>
### `SyncEventSessionNextCompactionEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.compaction.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        },
        "include": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextcompactionstarted"></a>
### `SyncEventSessionNextCompactionStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.compaction.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reason": {
          "type": "string",
          "enum": [
            "auto",
            "manual"
          ]
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reason"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextmodelswitched"></a>
### `SyncEventSessionNextModelSwitched`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.model.switched.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "model": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "providerID": {
              "type": "string"
            },
            "variant": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "providerID",
            "variant"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "model"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextprompted"></a>
### `SyncEventSessionNextPrompted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.prompted.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "prompt": {
          "$ref": "#/components/schemas/Prompt"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "prompt"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextreasoningdelta"></a>
### `SyncEventSessionNextReasoningDelta`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.reasoning.delta.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextreasoningended"></a>
### `SyncEventSessionNextReasoningEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.reasoning.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextreasoningstarted"></a>
### `SyncEventSessionNextReasoningStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.reasoning.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "reasoningID": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "reasoningID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextretried"></a>
### `SyncEventSessionNextRetried`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.retried.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "attempt": {
          "type": "number"
        },
        "error": {
          "$ref": "#/components/schemas/SessionNextRetry_error"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "attempt",
        "error"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextshellended"></a>
### `SyncEventSessionNextShellEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.shell.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "output": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "output"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextshellstarted"></a>
### `SyncEventSessionNextShellStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.shell.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "command": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "command"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextstepended"></a>
### `SyncEventSessionNextStepEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.step.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "finish": {
          "type": "string"
        },
        "cost": {
          "type": "number"
        },
        "tokens": {
          "type": "object",
          "properties": {
            "input": {
              "type": "number"
            },
            "output": {
              "type": "number"
            },
            "reasoning": {
              "type": "number"
            },
            "cache": {
              "type": "object",
              "properties": {
                "read": {
                  "type": "number"
                },
                "write": {
                  "type": "number"
                }
              },
              "required": [
                "read",
                "write"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "input",
            "output",
            "reasoning",
            "cache"
          ],
          "additionalProperties": false
        },
        "snapshot": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "finish",
        "cost",
        "tokens"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextstepfailed"></a>
### `SyncEventSessionNextStepFailed`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.step.failed.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "error": {
          "$ref": "#/components/schemas/SessionErrorUnknown"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "error"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextstepstarted"></a>
### `SyncEventSessionNextStepStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.step.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "agent": {
          "type": "string"
        },
        "model": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "providerID": {
              "type": "string"
            },
            "variant": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "providerID",
            "variant"
          ],
          "additionalProperties": false
        },
        "snapshot": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "agent",
        "model"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnextsynthetic"></a>
### `SyncEventSessionNextSynthetic`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.synthetic.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttextdelta"></a>
### `SyncEventSessionNextTextDelta`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.text.delta.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttextended"></a>
### `SyncEventSessionNextTextEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.text.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttextstarted"></a>
### `SyncEventSessionNextTextStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.text.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        }
      },
      "required": [
        "timestamp",
        "sessionID"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolcalled"></a>
### `SyncEventSessionNextToolCalled`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.called.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "tool": {
          "type": "string"
        },
        "input": {
          "type": "object"
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "tool",
        "input",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolfailed"></a>
### `SyncEventSessionNextToolFailed`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.failed.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "error": {
          "$ref": "#/components/schemas/SessionErrorUnknown"
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "error",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolinputdelta"></a>
### `SyncEventSessionNextToolInputDelta`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.input.delta.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "delta": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "delta"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolinputended"></a>
### `SyncEventSessionNextToolInputEnded`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.input.ended.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "text"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolinputstarted"></a>
### `SyncEventSessionNextToolInputStarted`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.input.started.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "name"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolprogress"></a>
### `SyncEventSessionNextToolProgress`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.progress.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "structured": {
          "type": "object"
        },
        "content": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ToolTextContent"
              },
              {
                "$ref": "#/components/schemas/ToolFileContent"
              }
            ]
          }
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "structured",
        "content"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionnexttoolsuccess"></a>
### `SyncEventSessionNextToolSuccess`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.next.tool.success.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "timestamp": {
          "type": "number"
        },
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "callID": {
          "type": "string"
        },
        "structured": {
          "type": "object"
        },
        "content": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/ToolTextContent"
              },
              {
                "$ref": "#/components/schemas/ToolFileContent"
              }
            ]
          }
        },
        "provider": {
          "type": "object",
          "properties": {
            "executed": {
              "type": "boolean"
            },
            "metadata": {
              "type": "object"
            }
          },
          "required": [
            "executed"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "timestamp",
        "sessionID",
        "callID",
        "structured",
        "content",
        "provider"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-synceventsessionupdated"></a>
### `SyncEventSessionUpdated`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "sync"
      ]
    },
    "name": {
      "type": "string",
      "enum": [
        "session.updated.1"
      ]
    },
    "id": {
      "type": "string"
    },
    "seq": {
      "type": "number"
    },
    "aggregateID": {
      "type": "string",
      "enum": [
        "sessionID"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "sessionID": {
          "type": "string",
          "pattern": "^ses"
        },
        "info": {
          "type": "object",
          "properties": {
            "id": {
              "anyOf": [
                {
                  "type": "string",
                  "pattern": "^ses"
                },
                {
                  "type": "null"
                }
              ]
            },
            "slug": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "projectID": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "workspaceID": {
              "anyOf": [
                {
                  "type": "string",
                  "pattern": "^wrk"
                },
                {
                  "type": "null"
                }
              ]
            },
            "directory": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "path": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "parentID": {
              "anyOf": [
                {
                  "type": "string",
                  "pattern": "^ses"
                },
                {
                  "type": "null"
                }
              ]
            },
            "summary": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "additions": {
                      "type": "number"
                    },
                    "deletions": {
                      "type": "number"
                    },
                    "files": {
                      "type": "number"
                    },
                    "diffs": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/SnapshotFileDiff"
                      }
                    }
                  },
                  "required": [
                    "additions",
                    "deletions",
                    "files"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "cost": {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            "tokens": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "input": {
                      "type": "number"
                    },
                    "output": {
                      "type": "number"
                    },
                    "reasoning": {
                      "type": "number"
                    },
                    "cache": {
                      "type": "object",
                      "properties": {
                        "read": {
                          "type": "number"
                        },
                        "write": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "read",
                        "write"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "required": [
                    "input",
                    "output",
                    "reasoning",
                    "cache"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "share": {
              "type": "object",
              "properties": {
                "url": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            },
            "title": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "agent": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "model": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "providerID": {
                      "type": "string"
                    },
                    "variant": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "id",
                    "providerID"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "version": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "time": {
              "type": "object",
              "properties": {
                "created": {
                  "anyOf": [
                    {
                      "type": "integer",
                      "minimum": 0
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "updated": {
                  "anyOf": [
                    {
                      "type": "integer",
                      "minimum": 0
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "compacting": {
                  "anyOf": [
                    {
                      "type": "integer",
                      "minimum": 0
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "archived": {
                  "anyOf": [
                    {
                      "type": "number"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            },
            "permission": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/PermissionRuleset"
                },
                {
                  "type": "null"
                }
              ]
            },
            "revert": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "messageID": {
                      "type": "string",
                      "pattern": "^msg"
                    },
                    "partID": {
                      "type": "string",
                      "pattern": "^prt"
                    },
                    "snapshot": {
                      "type": "string"
                    },
                    "diff": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "messageID"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "additionalProperties": false
        }
      },
      "required": [
        "sessionID",
        "info"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "type",
    "name",
    "id",
    "seq",
    "aggregateID",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-textpart"></a>
### `TextPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "text"
      ]
    },
    "text": {
      "type": "string"
    },
    "synthetic": {
      "type": "boolean"
    },
    "ignored": {
      "type": "boolean"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start"
      ],
      "additionalProperties": false
    },
    "metadata": {
      "type": "object"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-textpartinput"></a>
### `TextPartInput`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "type": {
      "type": "string",
      "enum": [
        "text"
      ]
    },
    "text": {
      "type": "string"
    },
    "synthetic": {
      "type": "boolean"
    },
    "ignored": {
      "type": "boolean"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start"
      ],
      "additionalProperties": false
    },
    "metadata": {
      "type": "object"
    }
  },
  "required": [
    "type",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-todo"></a>
### `Todo`

```json
{
  "type": "object",
  "properties": {
    "content": {
      "type": "string",
      "description": "Brief description of the task"
    },
    "status": {
      "type": "string",
      "description": "Current status of the task: pending, in_progress, completed, cancelled"
    },
    "priority": {
      "type": "string",
      "description": "Priority level of the task: high, medium, low"
    }
  },
  "required": [
    "content",
    "status",
    "priority"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolfilecontent"></a>
### `ToolFileContent`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "file"
      ]
    },
    "uri": {
      "type": "string"
    },
    "mime": {
      "type": "string"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "uri",
    "mime"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolids"></a>
### `ToolIDs`

```json
{
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

<a id="schema-toollist"></a>
### `ToolList`

```json
{
  "type": "array",
  "items": {
    "$ref": "#/components/schemas/ToolListItem"
  }
}
```

<a id="schema-toollistitem"></a>
### `ToolListItem`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "parameters": {}
  },
  "required": [
    "id",
    "description",
    "parameters"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolpart"></a>
### `ToolPart`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^prt"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "messageID": {
      "type": "string",
      "pattern": "^msg"
    },
    "type": {
      "type": "string",
      "enum": [
        "tool"
      ]
    },
    "callID": {
      "type": "string"
    },
    "tool": {
      "type": "string"
    },
    "state": {
      "$ref": "#/components/schemas/ToolState"
    },
    "metadata": {
      "type": "object"
    }
  },
  "required": [
    "id",
    "sessionID",
    "messageID",
    "type",
    "callID",
    "tool",
    "state"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolstate"></a>
### `ToolState`

```json
{
  "anyOf": [
    {
      "$ref": "#/components/schemas/ToolStatePending"
    },
    {
      "$ref": "#/components/schemas/ToolStateRunning"
    },
    {
      "$ref": "#/components/schemas/ToolStateCompleted"
    },
    {
      "$ref": "#/components/schemas/ToolStateError"
    }
  ]
}
```

<a id="schema-toolstatecompleted"></a>
### `ToolStateCompleted`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "completed"
      ]
    },
    "input": {
      "type": "object"
    },
    "output": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        },
        "compacted": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start",
        "end"
      ],
      "additionalProperties": false
    },
    "attachments": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/FilePart"
      }
    }
  },
  "required": [
    "status",
    "input",
    "output",
    "title",
    "metadata",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolstateerror"></a>
### `ToolStateError`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "error"
      ]
    },
    "input": {
      "type": "object"
    },
    "error": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        },
        "end": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start",
        "end"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "status",
    "input",
    "error",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolstatepending"></a>
### `ToolStatePending`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "pending"
      ]
    },
    "input": {
      "type": "object"
    },
    "raw": {
      "type": "string"
    }
  },
  "required": [
    "status",
    "input",
    "raw"
  ],
  "additionalProperties": false
}
```

<a id="schema-toolstaterunning"></a>
### `ToolStateRunning`

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "running"
      ]
    },
    "input": {
      "type": "object"
    },
    "title": {
      "type": "string"
    },
    "metadata": {
      "type": "object"
    },
    "time": {
      "type": "object",
      "properties": {
        "start": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "start"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "status",
    "input",
    "time"
  ],
  "additionalProperties": false
}
```

<a id="schema-tooltextcontent"></a>
### `ToolTextContent`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "text"
      ]
    },
    "text": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "text"
  ],
  "additionalProperties": false
}
```

<a id="schema-unknownerror"></a>
### `UnknownError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "UnknownError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-usermessage"></a>
### `UserMessage`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^msg"
    },
    "sessionID": {
      "type": "string",
      "pattern": "^ses"
    },
    "role": {
      "type": "string",
      "enum": [
        "user"
      ]
    },
    "time": {
      "type": "object",
      "properties": {
        "created": {
          "type": "integer",
          "minimum": 0
        }
      },
      "required": [
        "created"
      ],
      "additionalProperties": false
    },
    "format": {
      "$ref": "#/components/schemas/OutputFormat"
    },
    "summary": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "diffs": {
          "type": "array",
          "items": {
            "$ref": "#/components/schemas/SnapshotFileDiff"
          }
        }
      },
      "required": [
        "diffs"
      ],
      "additionalProperties": false
    },
    "agent": {
      "type": "string"
    },
    "model": {
      "type": "object",
      "properties": {
        "providerID": {
          "type": "string"
        },
        "modelID": {
          "type": "string"
        },
        "variant": {
          "type": "string"
        }
      },
      "required": [
        "providerID",
        "modelID"
      ],
      "additionalProperties": false
    },
    "system": {
      "type": "string"
    },
    "tools": {
      "type": "object",
      "additionalProperties": {
        "type": "boolean"
      }
    }
  },
  "required": [
    "id",
    "sessionID",
    "role",
    "time",
    "agent",
    "model"
  ],
  "additionalProperties": false
}
```

<a id="schema-v2sessionmessagesresponse"></a>
### `V2SessionMessagesResponse`

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/SessionMessage"
      }
    },
    "cursor": {
      "type": "object",
      "properties": {
        "previous": {
          "type": "string"
        },
        "next": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "items",
    "cursor"
  ],
  "additionalProperties": false
}
```

<a id="schema-v2sessionsresponse"></a>
### `V2SessionsResponse`

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/SessionInfo"
      }
    },
    "cursor": {
      "type": "object",
      "properties": {
        "previous": {
          "type": "string"
        },
        "next": {
          "type": "string"
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "items",
    "cursor"
  ],
  "additionalProperties": false
}
```

<a id="schema-vcsapplyerror"></a>
### `VcsApplyError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "VcsApplyError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        },
        "reason": {
          "type": "string",
          "enum": [
            "non-git",
            "not-clean"
          ]
        }
      },
      "required": [
        "message",
        "reason"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-vcsfilediff"></a>
### `VcsFileDiff`

```json
{
  "type": "object",
  "properties": {
    "file": {
      "type": "string"
    },
    "patch": {
      "type": "string"
    },
    "additions": {
      "type": "number"
    },
    "deletions": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "added",
        "deleted",
        "modified"
      ]
    }
  },
  "required": [
    "file",
    "additions",
    "deletions"
  ],
  "additionalProperties": false
}
```

<a id="schema-vcsfilestatus"></a>
### `VcsFileStatus`

```json
{
  "type": "object",
  "properties": {
    "file": {
      "type": "string"
    },
    "additions": {
      "type": "number"
    },
    "deletions": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": [
        "added",
        "deleted",
        "modified"
      ]
    }
  },
  "required": [
    "file",
    "additions",
    "deletions",
    "status"
  ],
  "additionalProperties": false
}
```

<a id="schema-vcsinfo"></a>
### `VcsInfo`

```json
{
  "type": "object",
  "properties": {
    "branch": {
      "type": "string"
    },
    "default_branch": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

<a id="schema-wellknownauth"></a>
### `WellKnownAuth`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "wellknown"
      ]
    },
    "key": {
      "type": "string"
    },
    "token": {
      "type": "string"
    }
  },
  "required": [
    "type",
    "key",
    "token"
  ],
  "additionalProperties": false
}
```

<a id="schema-workspace"></a>
### `Workspace`

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^wrk"
    },
    "type": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "branch": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "directory": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "extra": {
      "anyOf": [
        {},
        {
          "type": "null"
        }
      ]
    },
    "projectID": {
      "type": "string"
    },
    "timeUsed": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "string",
          "enum": [
            "NaN"
          ]
        },
        {
          "type": "string",
          "enum": [
            "Infinity"
          ]
        },
        {
          "type": "string",
          "enum": [
            "-Infinity"
          ]
        },
        {
          "type": "string",
          "enum": [
            "Infinity",
            "-Infinity",
            "NaN"
          ]
        }
      ]
    }
  },
  "required": [
    "id",
    "type",
    "name",
    "projectID",
    "timeUsed"
  ],
  "additionalProperties": false
}
```

<a id="schema-workspacewarperror"></a>
### `WorkspaceWarpError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "WorkspaceWarpError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-worktree"></a>
### `Worktree`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "branch": {
      "type": "string"
    },
    "directory": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "directory"
  ],
  "additionalProperties": false
}
```

<a id="schema-worktreecreateinput"></a>
### `WorktreeCreateInput`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "startCommand": {
      "type": "string",
      "description": "Additional startup script to run after the project's start command"
    }
  },
  "additionalProperties": false
}
```

<a id="schema-worktreeerror"></a>
### `WorktreeError`

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "enum": [
        "WorktreeNotGitError",
        "WorktreeNameGenerationFailedError",
        "WorktreeCreateFailedError",
        "WorktreeStartCommandFailedError",
        "WorktreeRemoveFailedError",
        "WorktreeResetFailedError",
        "WorktreeListFailedError"
      ]
    },
    "data": {
      "type": "object",
      "properties": {
        "message": {
          "type": "string"
        }
      },
      "required": [
        "message"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "name",
    "data"
  ],
  "additionalProperties": false
}
```

<a id="schema-worktreeremoveinput"></a>
### `WorktreeRemoveInput`

```json
{
  "type": "object",
  "properties": {
    "directory": {
      "type": "string"
    }
  },
  "required": [
    "directory"
  ],
  "additionalProperties": false
}
```

<a id="schema-worktreeresetinput"></a>
### `WorktreeResetInput`

```json
{
  "type": "object",
  "properties": {
    "directory": {
      "type": "string"
    }
  },
  "required": [
    "directory"
  ],
  "additionalProperties": false
}
```
