import { useMutation, useQuery } from "@tanstack/react-query"
import { datasetsApi } from "../api"
export function useCorpus() {
  const versions = useQuery({
    queryKey: ["datasets", "versions"],
    queryFn: datasetsApi.versions,
  })
  const audit = useQuery({
    queryKey: ["datasets", "audit"],
    queryFn: datasetsApi.audit,
  })
  const analysis = useMutation({ mutationFn: datasetsApi.analyze })
  return { versions, audit, analysis }
}
