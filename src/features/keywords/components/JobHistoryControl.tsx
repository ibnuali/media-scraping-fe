import { useJobLogDialog } from "../hooks/use-job-log-dialog"
import { JobHistoryButton } from "./JobHistoryButton"
import { JobLogDialog } from "./JobLogDialog"

export function JobHistoryControl() {
  const dialog = useJobLogDialog()
  return (
    <>
      <JobHistoryButton onSelect={dialog.openJobLogs} />
      {dialog.target && (
        <JobLogDialog
          key={dialog.job?.jobId}
          target={dialog.target}
          job={dialog.job}
          open={dialog.open}
          onOpenChange={dialog.setOpen}
          onClose={dialog.closeLogs}
        />
      )}
    </>
  )
}
