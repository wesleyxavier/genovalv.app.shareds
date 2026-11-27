/**
 * Resolves effective module codes for a company as the sorted unique intersection
 * of plan modules, segment modules, and active catalog modules (fail-closed).
 */
export function resolveEffectiveModules(
  planModuleCodes: readonly string[] | null | undefined,
  segmentModuleCodes: readonly string[] | null | undefined,
  activeModuleCodes: readonly string[] | null | undefined,
): string[] {
  if (!planModuleCodes?.length || !segmentModuleCodes?.length || !activeModuleCodes?.length) {
    return [];
  }
  const segmentSet = new Set(segmentModuleCodes);
  const activeSet = new Set(activeModuleCodes);
  const result = new Set<string>();

  for (const code of planModuleCodes) {
    if (segmentSet.has(code) && activeSet.has(code)) {
      result.add(code);
    }
  }
  return Array.from(result).sort();
}
