import { useOutletContext } from "react-router-dom"
import type { KeywordWorkspaceContext } from "../hooks/use-job-log-dialog"
import { useKeywordWorkspace } from "../hooks/use-keyword-workspace"
import { KeywordFormModal } from "./KeywordFormModal"
import { KeywordPicker } from "./KeywordPicker"
import { KeywordNewsPanel } from "./KeywordNewsPanel"

export function KeywordsPage() {
  const workspace = useKeywordWorkspace()
  const jobs = useOutletContext<KeywordWorkspaceContext>()
  const { dialog, selectedKeyword } = workspace

  return (
    <div className="keyword-workspace">
      <KeywordPicker
        keywords={workspace.filteredKeywords}
        total={workspace.keywords.length}
        selectedId={selectedKeyword?.id}
        filter={workspace.filter}
        onFilter={workspace.setFilter}
        onSelect={workspace.selectKeyword}
        onAdd={dialog.openCreateDialog}
        onEdit={dialog.openEditDialog}
        onDelete={workspace.handleDelete}
        isDeleting={workspace.isDeleting}
        isLoading={workspace.query.isLoading}
        error={workspace.query.error}
        onRetry={() => workspace.query.refetch()}
      />
      <KeywordNewsPanel
        keyword={selectedKeyword}
        isLoadingKeywords={workspace.query.isLoading}
        hasKeywordError={!!workspace.query.error}
        job={selectedKeyword ? jobs.getJob(selectedKeyword.id) : undefined}
        isBusy={selectedKeyword ? jobs.isPolling(selectedKeyword.id) : false}
        onScrape={(filters) => {
          if (selectedKeyword) {
            jobs.openJobLogs(selectedKeyword)
            jobs.startAsyncScrape(selectedKeyword.id, filters)
          }
        }}
        onAdd={dialog.openCreateDialog}
      />
      <KeywordFormModal
        open={dialog.dialogMode !== null}
        mode={dialog.dialogMode}
        editingKeyword={dialog.editingKeyword}
        keyword={dialog.keyword}
        setKeyword={dialog.setKeyword}
        formError={dialog.formError}
        isSubmitting={workspace.isSubmitting}
        onClose={dialog.closeDialog}
        onSubmit={workspace.handleSubmit}
      />
    </div>
  )
}
